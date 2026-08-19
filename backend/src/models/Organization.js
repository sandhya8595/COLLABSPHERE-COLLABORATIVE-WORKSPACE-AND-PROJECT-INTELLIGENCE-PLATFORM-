const mongoose = require('mongoose');

const organizationSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    logo: { type: String, default: '' },
    customDomain: { type: String, default: '' },

    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

    members: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        role: {
          type: String,
          enum: ['super_admin', 'org_admin', 'member'],
          default: 'member',
        },
        joinedAt: { type: Date, default: Date.now },
      },
    ],

    billing: {
      plan: { type: String, enum: ['free', 'pro', 'enterprise'], default: 'free' },
      seatsUsed: { type: Number, default: 1 },
    },

    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Organization', organizationSchema);
