const mongoose = require('mongoose');

const columnSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true }, // e.g. To Do, In Progress, Review
    board: { type: mongoose.Schema.Types.ObjectId, ref: 'Board', required: true, index: true },
    order: { type: Number, default: 0 },
    taskOrder: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Task' }],
    color: { type: String, default: '#6366f1' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Column', columnSchema);
