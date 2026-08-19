const mongoose = require('mongoose');
const { NOTIFICATION_TYPES } = require('../config/constants');

const notificationSchema = new mongoose.Schema(
  {
    recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    type: { type: String, enum: Object.values(NOTIFICATION_TYPES), required: true },

    title: { type: String, required: true },
    message: { type: String, default: '' },

    entityType: { type: String }, // 'Task', 'Document', 'Chat', etc.
    entityId: { type: mongoose.Schema.Types.ObjectId },
    link: { type: String, default: '' },

    isRead: { type: Boolean, default: false },
  },
  { timestamps: true }
);

notificationSchema.index({ recipient: 1, isRead: 1, createdAt: -1 });

module.exports = mongoose.model('Notification', notificationSchema);
