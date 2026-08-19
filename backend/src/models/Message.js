const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema(
  {
    chat: { type: mongoose.Schema.Types.ObjectId, ref: 'Chat', required: true, index: true },
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, default: '' },

    attachments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'File' }],
    sharedDocument: { type: mongoose.Schema.Types.ObjectId, ref: 'Document', default: null },
    mentions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],

    reactions: [
      {
        emoji: { type: String },
        users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
      },
    ],

    parentMessage: { type: mongoose.Schema.Types.ObjectId, ref: 'Message', default: null },
    threadReplyCount: { type: Number, default: 0 },

    readBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    deletedFor: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    isEdited: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

messageSchema.index({ chat: 1, createdAt: -1 });
messageSchema.index({ content: 'text' });

module.exports = mongoose.model('Message', messageSchema);
