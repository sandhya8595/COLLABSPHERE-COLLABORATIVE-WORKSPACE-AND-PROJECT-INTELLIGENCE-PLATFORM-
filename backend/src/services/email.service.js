const nodemailer = require('nodemailer');
const env = require('../config/env');
const logger = require('../utils/logger');

const transporter = nodemailer.createTransport({
  host: env.SMTP_HOST,
  port: Number(env.SMTP_PORT) || 587,
  secure: Number(env.SMTP_PORT) === 465,
  auth: {
    user: env.SMTP_USER,
    pass: env.SMTP_PASS,
  },
});

const sendEmail = async ({ to, subject, html }) => {
  try {
    await transporter.sendMail({
      from: env.EMAIL_FROM,
      to,
      subject,
      html,
    });
    logger.info(`Email sent to ${to}: ${subject}`);
  } catch (err) {
    logger.error(`Failed to send email to ${to}: ${err.message}`);
  }
};

const sendVerificationEmail = async (user, token) => {
  const verifyUrl = `${env.CLIENT_URL}/verify-email?token=${token}`;
  await sendEmail({
    to: user.email,
    subject: 'Verify your CollabSphere account',
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: auto;">
        <h2>Welcome to CollabSphere, ${user.firstName}!</h2>
        <p>Please verify your email address to activate your account.</p>
        <a href="${verifyUrl}" style="display:inline-block;padding:12px 24px;background:#1d4ed8;color:#fff;border-radius:6px;text-decoration:none;">Verify Email</a>
        <p style="margin-top:16px;color:#666;">This link expires in 24 hours.</p>
      </div>
    `,
  });
};

const sendPasswordResetEmail = async (user, token) => {
  const resetUrl = `${env.CLIENT_URL}/reset-password?token=${token}`;
  await sendEmail({
    to: user.email,
    subject: 'Reset your CollabSphere password',
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: auto;">
        <h2>Password Reset Request</h2>
        <p>Hi ${user.firstName}, click below to reset your password.</p>
        <a href="${resetUrl}" style="display:inline-block;padding:12px 24px;background:#1d4ed8;color:#fff;border-radius:6px;text-decoration:none;">Reset Password</a>
        <p style="margin-top:16px;color:#666;">This link expires in 1 hour. If you didn't request this, ignore this email.</p>
      </div>
    `,
  });
};

module.exports = { sendEmail, sendVerificationEmail, sendPasswordResetEmail };
