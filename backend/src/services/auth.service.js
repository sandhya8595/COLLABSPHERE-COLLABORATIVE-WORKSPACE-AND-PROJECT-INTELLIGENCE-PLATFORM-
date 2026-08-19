const crypto = require('crypto');
const { User, Session } = require('../models');
const ApiError = require('../utils/apiError');
const {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} = require('../utils/generateToken');
const { sendVerificationEmail, sendPasswordResetEmail } = require('./email.service');

const registerUser = async ({ firstName, lastName, email, password }) => {
  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) {
    throw new ApiError(409, 'An account with this email already exists.');
  }

  const user = await User.create({ firstName, lastName, email, password });

  const verificationToken = crypto.randomBytes(32).toString('hex');
  const hashedToken = crypto.createHash('sha256').update(verificationToken).digest('hex');

  user.emailVerificationToken = hashedToken;
  user.emailVerificationExpires = Date.now() + 24 * 60 * 60 * 1000;
  await user.save();

  await sendVerificationEmail(user, verificationToken);

  return user;
};

const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
  if (!user) throw new ApiError(401, 'Invalid email or password.');

  if (user.authProvider === 'google' && !user.password) {
    throw new ApiError(400, 'This account uses Google Sign-In. Please continue with Google.');
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) throw new ApiError(401, 'Invalid email or password.');

  if (!user.isActive) throw new ApiError(403, 'This account has been deactivated.');

  user.lastLoginAt = new Date();
  user.status = 'online';
  await user.save();

  return user;
};

const issueTokens = async (user, req) => {
  const accessToken = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);

  await Session.create({
    user: user._id,
    refreshToken,
    userAgent: req.headers['user-agent'] || '',
    ip: req.ip,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  });

  return { accessToken, refreshToken };
};

const rotateRefreshToken = async (oldRefreshToken, req) => {
  let decoded;
  try {
    decoded = verifyRefreshToken(oldRefreshToken);
  } catch (err) {
    throw new ApiError(401, 'Invalid or expired refresh token.');
  }

  const session = await Session.findOne({ refreshToken: oldRefreshToken, isRevoked: false });
  if (!session) throw new ApiError(401, 'Session not found or already revoked.');

  const user = await User.findById(decoded.sub);
  if (!user || !user.isActive) throw new ApiError(401, 'User not found or inactive.');

  // Revoke old session, issue new one (rotation)
  session.isRevoked = true;
  await session.save();

  const tokens = await issueTokens(user, req);
  return { user, ...tokens };
};

const revokeSession = async (refreshToken) => {
  if (!refreshToken) return;
  await Session.findOneAndUpdate({ refreshToken }, { isRevoked: true });
};

const requestPasswordReset = async (email) => {
  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) return; // Don't reveal whether the email exists

  const resetToken = crypto.randomBytes(32).toString('hex');
  const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

  user.passwordResetToken = hashedToken;
  user.passwordResetExpires = Date.now() + 60 * 60 * 1000; // 1 hour
  await user.save();

  await sendPasswordResetEmail(user, resetToken);
};

const resetPassword = async (rawToken, newPassword) => {
  const hashedToken = crypto.createHash('sha256').update(rawToken).digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  }).select('+passwordResetToken +passwordResetExpires');

  if (!user) throw new ApiError(400, 'Password reset token is invalid or has expired.');

  user.password = newPassword;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  return user;
};

const verifyEmailToken = async (rawToken) => {
  const hashedToken = crypto.createHash('sha256').update(rawToken).digest('hex');

  const user = await User.findOne({
    emailVerificationToken: hashedToken,
    emailVerificationExpires: { $gt: Date.now() },
  }).select('+emailVerificationToken +emailVerificationExpires');

  if (!user) throw new ApiError(400, 'Verification token is invalid or has expired.');

  user.isEmailVerified = true;
  user.emailVerificationToken = undefined;
  user.emailVerificationExpires = undefined;
  await user.save();

  return user;
};

module.exports = {
  registerUser,
  loginUser,
  issueTokens,
  rotateRefreshToken,
  revokeSession,
  requestPasswordReset,
  resetPassword,
  verifyEmailToken,
};
