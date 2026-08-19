const { User } = require('../models');
const logger = require('../utils/logger');

// Tracks how many active sockets a user has open (multi-tab/device support)
const onlineUsers = new Map(); // userId -> Set of socket ids

const registerPresenceHandlers = (io, socket) => {
  const userId = socket.user._id.toString();

  socket.on('presence:join', async (workspaceId) => {
    socket.join(`workspace:${workspaceId}`);

    if (!onlineUsers.has(userId)) {
      onlineUsers.set(userId, new Set());
      await User.findByIdAndUpdate(userId, { status: 'online' });
    }
    onlineUsers.get(userId).add(socket.id);

    io.to(`workspace:${workspaceId}`).emit('presence:update', {
      userId,
      status: 'online',
    });
  });

  socket.on('presence:away', () => {
    io.emit('presence:update', { userId, status: 'away' });
  });

  socket.on('disconnect', async () => {
    const sockets = onlineUsers.get(userId);
    if (sockets) {
      sockets.delete(socket.id);
      if (sockets.size === 0) {
        onlineUsers.delete(userId);
        await User.findByIdAndUpdate(userId, { status: 'offline' }).catch((err) =>
          logger.error(`Failed to update offline status: ${err.message}`)
        );
        io.emit('presence:update', { userId, status: 'offline' });
      }
    }
  });
};

module.exports = { registerPresenceHandlers, onlineUsers };
