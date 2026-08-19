require('dotenv').config();

module.exports = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: process.env.PORT || 5000,
  CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:5173',

  MONGO_URI: process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/collabsphere',

  JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET,
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,
  JWT_ACCESS_EXPIRES_IN: process.env.JWT_ACCESS_EXPIRES_IN || '15m',
  JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN || '7d',

  COOKIE_SECRET: process.env.COOKIE_SECRET,

  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
  GOOGLE_CALLBACK_URL: process.env.GOOGLE_CALLBACK_URL,

  SMTP_HOST: process.env.SMTP_HOST,
  SMTP_PORT: process.env.SMTP_PORT,
  SMTP_USER: process.env.SMTP_USER,
  SMTP_PASS: process.env.SMTP_PASS,
  EMAIL_FROM: process.env.EMAIL_FROM || 'CollabSphere <no-reply@collabsphere.co>',

  MAX_FILE_SIZE_MB: Number(process.env.MAX_FILE_SIZE_MB) || 25,
  UPLOAD_DIR: process.env.UPLOAD_DIR || 'uploads',

  RATE_LIMIT_WINDOW_MIN: Number(process.env.RATE_LIMIT_WINDOW_MIN) || 15,
  RATE_LIMIT_MAX: Number(process.env.RATE_LIMIT_MAX) || 200,
};
