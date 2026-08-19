const { Resend } = require('resend');
const nodemailer = require('nodemailer');
const env = require('../config/env');
const logger = require('../utils/logger');

// ── Email Transport ─────────────────────────────────────────────────────────
// In production (Render), use Resend API.
// In development, fallback to Nodemailer SMTP (e.g. Mailtrap or local SMTP).

let resend = null;
if (process.env.RESEND_API_KEY) {
  resend = new Resend(process.env.RESEND_API_KEY);
  logger.info('Email transport: Resend API');
}

// Nodemailer fallback for local dev
let transporter = null;
if (!resend && env.SMTP_HOST) {
  transporter = nodemailer.createTransport({
    host: env.SMTP_HOST,
    port: Number(env.SMTP_PORT) || 587,
    secure: Number(env.SMTP_PORT) === 465,
    auth: {
      user: env.SMTP_USER,
      pass: env.SMTP_PASS,
    },
  });
  logger.info('Email transport: Nodemailer SMTP');
}

// ── Generic send ────────────────────────────────────────────────────────────
const sendEmail = async ({ to, subject, html }) => {
  const fromAddress = process.env.RESEND_FROM || env.EMAIL_FROM || 'CollabSphere <onboarding@resend.dev>';

  try {
    if (resend) {
      // Resend API
      const { data, error } = await resend.emails.send({
        from: fromAddress,
        to: [to],
        subject,
        html,
      });
      if (error) {
        logger.error(`Resend error sending to ${to}: ${JSON.stringify(error)}`);
        return;
      }
      logger.info(`Email sent via Resend to ${to}: ${subject} (id: ${data?.id})`);
    } else if (transporter) {
      // Nodemailer fallback
      await transporter.sendMail({
        from: fromAddress,
        to,
        subject,
        html,
      });
      logger.info(`Email sent via Nodemailer to ${to}: ${subject}`);
    } else {
      logger.warn(`No email transport configured. Skipping email to ${to}: ${subject}`);
      logger.warn(`Set RESEND_API_KEY (production) or SMTP_HOST (local) to enable emails.`);
    }
  } catch (err) {
    logger.error(`Failed to send email to ${to}: ${err.message}`);
  }
};

// ── Specific emails ─────────────────────────────────────────────────────────
const sendVerificationEmail = async (user, token) => {
  const verifyUrl = `${env.CLIENT_URL}/verify-email?token=${token}`;
  await sendEmail({
    to: user.email,
    subject: 'Verify your CollabSphere account',
    html: `
      <div style="font-family: 'Segoe UI', sans-serif; max-width: 520px; margin: 40px auto; background: #ffffff; border-radius: 12px; border: 1px solid #e5e7eb; overflow: hidden;">
        <div style="background: linear-gradient(135deg, #1d4ed8, #7c3aed); padding: 32px 24px; text-align: center;">
          <h1 style="margin: 0; color: #fff; font-size: 24px; letter-spacing: -0.5px;">CollabSphere</h1>
        </div>
        <div style="padding: 32px 24px;">
          <h2 style="margin: 0 0 12px; color: #111827; font-size: 20px;">Welcome, ${user.firstName}! 🎉</h2>
          <p style="color: #4b5563; line-height: 1.6; margin: 0 0 24px;">Please verify your email address to activate your account and start collaborating.</p>
          <a href="${verifyUrl}" style="display: inline-block; padding: 14px 32px; background: linear-gradient(135deg, #1d4ed8, #7c3aed); color: #fff; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 15px;">Verify Email Address</a>
          <p style="margin-top: 24px; color: #9ca3af; font-size: 13px;">This link expires in 24 hours. If you didn't create an account, you can safely ignore this email.</p>
        </div>
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
      <div style="font-family: 'Segoe UI', sans-serif; max-width: 520px; margin: 40px auto; background: #ffffff; border-radius: 12px; border: 1px solid #e5e7eb; overflow: hidden;">
        <div style="background: linear-gradient(135deg, #1d4ed8, #7c3aed); padding: 32px 24px; text-align: center;">
          <h1 style="margin: 0; color: #fff; font-size: 24px; letter-spacing: -0.5px;">CollabSphere</h1>
        </div>
        <div style="padding: 32px 24px;">
          <h2 style="margin: 0 0 12px; color: #111827; font-size: 20px;">Password Reset Request 🔐</h2>
          <p style="color: #4b5563; line-height: 1.6; margin: 0 0 8px;">Hi ${user.firstName},</p>
          <p style="color: #4b5563; line-height: 1.6; margin: 0 0 24px;">We received a request to reset your password. Click the button below to choose a new one.</p>
          <a href="${resetUrl}" style="display: inline-block; padding: 14px 32px; background: linear-gradient(135deg, #1d4ed8, #7c3aed); color: #fff; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 15px;">Reset Password</a>
          <p style="margin-top: 24px; color: #9ca3af; font-size: 13px;">This link expires in 1 hour. If you didn't request this, you can safely ignore this email — your password will remain unchanged.</p>
        </div>
        <div style="background: #f9fafb; padding: 16px 24px; border-top: 1px solid #e5e7eb;">
          <p style="margin: 0; color: #9ca3af; font-size: 12px; text-align: center;">© CollabSphere — Collaborative Workspace & Project Intelligence Platform</p>
        </div>
      </div>
    `,
  });
};

module.exports = { sendEmail, sendVerificationEmail, sendPasswordResetEmail };
