const jwt = require('jsonwebtoken');
const env = require('../config/env');

const generateAccessToken = (userId) => {
  return jwt.sign({ sub: userId }, env.JWT_ACCESS_SECRET, {
    expiresIn: env.JWT_ACCESS_EXPIRES_IN,
  });
};

const generateRefreshToken = (userId) => {
  return jwt.sign({ sub: userId }, env.JWT_REFRESH_SECRET, {
    expiresIn: env.JWT_REFRESH_EXPIRES_IN,
  });
};

const verifyAccessToken = (token) => jwt.verify(token, env.JWT_ACCESS_SECRET);
const verifyRefreshToken = (token) => jwt.verify(token, env.JWT_REFRESH_SECRET);

const setAuthCookies = (res, accessToken, refreshToken) => {
  const isProd = process.env.NODE_ENV === 'production';

  res.cookie('accessToken', accessToken, {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? 'none' : 'lax',
    maxAge: 15 * 60 * 1000, // 15 minutes
  });

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? 'none' : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    path: '/api/v1/auth/refresh',
  });
};

const clearAuthCookies = (res) => {
  const isProd = process.env.NODE_ENV === 'production';
  
  res.clearCookie('accessToken', {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? 'none' : 'lax'
  });
  
  res.clearCookie('refreshToken', { 
    path: '/api/v1/auth/refresh',
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? 'none' : 'lax'
  });
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
  setAuthCookies,
  clearAuthCookies,
};
