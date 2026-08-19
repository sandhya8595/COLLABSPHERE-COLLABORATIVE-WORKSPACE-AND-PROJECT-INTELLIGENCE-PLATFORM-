const catchAsync = require('../utils/catchAsync');
const ApiError = require('../utils/apiError');
const { verifyAccessToken } = require('../utils/generateToken');
const { User } = require('../models');

const protect = catchAsync(async (req, res, next) => {
  let token;

  if (req.cookies?.accessToken) {
    token = req.cookies.accessToken;
  } else if (req.headers.authorization?.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    throw new ApiError(401, 'Not authenticated. Please log in.');
  }

  let decoded;
  try {
    decoded = verifyAccessToken(token);
  } catch (err) {
    throw new ApiError(401, 'Session expired or invalid token. Please log in again.');
  }

  const user = await User.findById(decoded.sub);
  if (!user || !user.isActive) {
    throw new ApiError(401, 'User no longer exists or is deactivated.');
  }

  req.user = user;
  next();
});

// Optional auth: attaches req.user if token present, but doesn't block if absent
const optionalAuth = catchAsync(async (req, res, next) => {
  let token = req.cookies?.accessToken;
  if (!token && req.headers.authorization?.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  }
  if (!token) return next();

  try {
    const decoded = verifyAccessToken(token);
    const user = await User.findById(decoded.sub);
    if (user && user.isActive) req.user = user;
  } catch (err) {
    // ignore invalid token for optional auth
  }
  next();
});

module.exports = { protect, optionalAuth };
