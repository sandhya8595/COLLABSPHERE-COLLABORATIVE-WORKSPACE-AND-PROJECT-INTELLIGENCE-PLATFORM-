const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    workspace: { type: mongoose.Schema.Types.ObjectId, ref: 'Workspace' },
    action: { type: String, required: true },
    entityType: { type: String }, // e.g. 'Task', 'Document', 'File'
    entityId: { type: mongoose.Schema.Types.ObjectId },
    metadata: { type: mongoose.Schema.Types.Mixed, default: {} },
    ip: { type: String },
    userAgent: { type: String },
  },
  { timestamps: true }
);

auditLogSchema.index({ workspace: 1, createdAt: -1 });

module.exports = mongoose.model('Auditlog', auditLogSchema);
