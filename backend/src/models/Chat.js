const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema(
  {
    name: { type: String, trim: true }, // channel name e.g. "project-alpha"; empty for DMs
    type: { type: String, enum: ['channel', 'direct', 'group'], default: 'channel' },
    workspace: { type: mongoose.Schema.Types.ObjectId, ref: 'Workspace', required: true, index: true },

    members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    isPrivate: { type: Boolean, default: false },
    topic: { type: String, default: '' },

    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Chat', chatSchema);
