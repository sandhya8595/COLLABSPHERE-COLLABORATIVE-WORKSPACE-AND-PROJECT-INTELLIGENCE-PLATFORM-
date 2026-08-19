const mongoose = require('mongoose');
const { ROLES } = require('../config/constants');

const workspaceMemberSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    role: {
      type: String,
      enum: Object.values(ROLES),
      default: ROLES.MEMBER,
    },
    invitedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    joinedAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const workspaceSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, trim: true, lowercase: true },
    description: { type: String, default: '' },

    organization: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Organization',
      required: true,
      index: true,
    },

    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    members: [workspaceMemberSchema],

    settings: {
      isPublic: { type: Boolean, default: false },
      allowGuestAccess: { type: Boolean, default: false },
    },

    storageQuotaMB: { type: Number, default: 5120 }, // 5GB default
    storageUsedMB: { type: Number, default: 0 },

    inviteCode: { type: String, unique: true, sparse: true },

    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

workspaceSchema.index({ organization: 1, slug: 1 }, { unique: true });

module.exports = mongoose.model('Workspace', workspaceSchema);
