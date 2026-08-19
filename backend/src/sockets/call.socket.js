const logger = require('../utils/logger');

const activeCalls = new Map(); // chatId -> Set of user sockets metadata

const registerCallHandlers = (io, socket) => {
  socket.on('call:join', ({ chatId }) => {
    if (!chatId) return;
    const roomName = `call:room:${chatId}`;
    socket.join(roomName);

    logger.info(`User ${socket.user._id} (${socket.user.firstName}) joined video call room: ${chatId}`);

    const roomSockets = io.sockets.adapter.rooms.get(roomName) || new Set();
    const existingParticipants = [];

    for (const socketId of roomSockets) {
      if (socketId !== socket.id) {
        const clientSocket = io.sockets.sockets.get(socketId);
        if (clientSocket && clientSocket.user) {
          existingParticipants.push({
            socketId: clientSocket.id,
            user: {
              _id: clientSocket.user._id,
              firstName: clientSocket.user.firstName,
              lastName: clientSocket.user.lastName,
              avatar: clientSocket.user.avatar,
            },
          });
        }
      }
    }

    // Send existing users list to the newly joined peer
    socket.emit('call:room-users', {
      chatId,
      participants: existingParticipants,
    });

    // Notify existing users about the new participant
    socket.to(roomName).emit('call:user-joined', {
      chatId,
      socketId: socket.id,
      user: {
        _id: socket.user._id,
        firstName: socket.user.firstName,
        lastName: socket.user.lastName,
        avatar: socket.user.avatar,
      },
    });

    // Notify main chat room that a call is ongoing / user joined
    io.to(`chat:${chatId}`).emit('call:status-update', {
      chatId,
      activeCount: roomSockets.size,
    });
  });

  socket.on('call:signal', ({ to, signal }) => {
    if (!to || !signal) return;
    io.to(to).emit('call:signal', {
      from: socket.id,
      signal,
      user: {
        _id: socket.user._id,
        firstName: socket.user.firstName,
        lastName: socket.user.lastName,
        avatar: socket.user.avatar,
      },
    });
  });

  socket.on('call:toggle-media', ({ chatId, isMuted, isVideoOff, isScreenSharing }) => {
    if (!chatId) return;
    const roomName = `call:room:${chatId}`;
    socket.to(roomName).emit('call:media-state-changed', {
      socketId: socket.id,
      userId: socket.user._id,
      isMuted,
      isVideoOff,
      isScreenSharing,
    });
  });

  const handleLeaveCall = (chatId) => {
    if (!chatId) return;
    const roomName = `call:room:${chatId}`;
    socket.leave(roomName);

    socket.to(roomName).emit('call:user-left', {
      socketId: socket.id,
      userId: socket.user._id,
    });

    const roomSockets = io.sockets.adapter.rooms.get(roomName) || new Set();
    io.to(`chat:${chatId}`).emit('call:status-update', {
      chatId,
      activeCount: roomSockets.size,
    });
    logger.info(`User ${socket.user._id} left video call room: ${chatId}`);
  };

  socket.on('call:leave', ({ chatId }) => {
    handleLeaveCall(chatId);
  });

  socket.on('disconnecting', () => {
    for (const room of socket.rooms) {
      if (room.startsWith('call:room:')) {
        const chatId = room.replace('call:room:', '');
        socket.to(room).emit('call:user-left', {
          socketId: socket.id,
          userId: socket.user?._id,
        });

        setTimeout(() => {
          const roomSockets = io.sockets.adapter.rooms.get(room) || new Set();
          io.to(`chat:${chatId}`).emit('call:status-update', {
            chatId,
            activeCount: roomSockets.size,
          });
        }, 100);
      }
    }
  });
};

module.exports = { registerCallHandlers };
