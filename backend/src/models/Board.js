const mongoose = require('mongoose');

const boardSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true, index: true },
    columnOrder: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Column' }],
    activeSprint: { type: String, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Board', boardSchema);
