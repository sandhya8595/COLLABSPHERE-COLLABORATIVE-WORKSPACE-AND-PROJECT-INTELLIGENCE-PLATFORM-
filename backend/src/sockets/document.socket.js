const { Document } = require('../models');
const logger = require('../utils/logger');

const registerDocumentHandlers = (io, socket) => {
  socket.on('document:join', (documentId) => {
    socket.join(`document:${documentId}`);
  });

  socket.on('document:leave', (documentId) => {
    socket.leave(`document:${documentId}`);
  });

  // Broadcast incremental content changes (e.g. TipTap/ProseMirror steps)
  socket.on('document:change', ({ documentId, changes, version }) => {
    socket.to(`document:${documentId}`).emit('document:changed', {
      changes,
      version,
      userId: socket.user._id,
    });
  });

  // Cursor / selection presence
  socket.on('document:cursor', ({ documentId, position, selection }) => {
    socket.to(`document:${documentId}`).emit('document:cursor:update', {
      userId: socket.user._id,
      name: `${socket.user.firstName} ${socket.user.lastName || ''}`.trim(),
      position,
      selection,
    });
  });

  socket.on('document:typing', ({ documentId, isTyping }) => {
    socket.to(`document:${documentId}`).emit('document:typing:update', {
      userId: socket.user._id,
      isTyping,
    });
  });

  // Periodic autosave from client -> persist full content snapshot
  socket.on('document:save', async ({ documentId, content }) => {
    try {
      await Document.findByIdAndUpdate(documentId, {
        content,
        lastEditedBy: socket.user._id,
      });
      socket.to(`document:${documentId}`).emit('document:saved', {
        savedBy: socket.user._id,
        savedAt: new Date(),
      });
    } catch (err) {
      logger.error(`document:save failed: ${err.message}`);
    }
  });
};

module.exports = { registerDocumentHandlers };
