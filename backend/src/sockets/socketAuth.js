const cookie = require('cookie');
const { verifyAccessToken } = require('../utils/generateToken');
const { User } = require('../models');
const logger = require('../utils/logger');

const socketAuthMiddleware = async (socket, next) => {
  try {
    let token = socket.handshake.auth?.token;

    if (!token && socket.handshake.headers.cookie) {
      const parsed = cookie.parse(socket.handshake.headers.cookie);
      token = parsed.accessToken;
    }

    if (!token) return next(new Error('Authentication required.'));

    const decoded = verifyAccessToken(token);
    const user = await User.findById(decoded.sub);
    if (!user || !user.isActive) return next(new Error('User not found or inactive.'));

    socket.user = user;
    next();
  } catch (err) {
    logger.error(`Socket auth failed: ${err.message}`);
    next(new Error('Authentication failed.'));
  }
};

module.exports = socketAuthMiddleware;
