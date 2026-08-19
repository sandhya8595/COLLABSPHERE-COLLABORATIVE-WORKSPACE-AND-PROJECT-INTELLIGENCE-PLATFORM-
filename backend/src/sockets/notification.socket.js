const { Notification } = require('../models');
const logger = require('../utils/logger');

let ioInstance = null;

const registerNotificationHandlers = (io, socket) => {
  ioInstance = io;
  socket.on('notification:join', () => {
    socket.join(`user:${socket.user._id}`);
  });
};

/**
 * Call this from anywhere in the app (controllers/services) to create
 * a notification AND push it in real-time via Socket.IO.
 */
const pushNotification = async ({ recipient, sender, type, title, message, entityType, entityId, link }) => {
  try {
    const notification = await Notification.create({
      recipient,
      sender,
      type,
      title,
      message,
      entityType,
      entityId,
      link,
    });

    if (ioInstance) {
      ioInstance.to(`user:${recipient}`).emit('notification:new', notification);
    }

    return notification;
  } catch (err) {
    logger.error(`pushNotification failed: ${err.message}`);
  }
};

module.exports = { registerNotificationHandlers, pushNotification };
