const mongoose = require('mongoose');

const documentVersionSchema = new mongoose.Schema(
  {
    document: { type: mongoose.Schema.Types.ObjectId, ref: 'Document', required: true, index: true },
    content: { type: mongoose.Schema.Types.Mixed, required: true },
    versionLabel: { type: String, default: '' }, // e.g. "V2 - Final Review"
    editedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('DocumentVersion', documentVersionSchema);
