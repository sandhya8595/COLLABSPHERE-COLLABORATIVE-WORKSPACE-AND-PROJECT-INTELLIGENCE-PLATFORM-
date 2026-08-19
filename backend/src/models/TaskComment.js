const mongoose = require('mongoose');

const taskCommentSchema = new mongoose.Schema(
  {
    task: { type: mongoose.Schema.Types.ObjectId, ref: 'Task', required: true, index: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, required: true },
    mentions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    attachments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'File' }],
    parentComment: { type: mongoose.Schema.Types.ObjectId, ref: 'TaskComment', default: null },
    isEdited: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model('TaskComment', taskCommentSchema);
