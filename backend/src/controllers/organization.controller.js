const catchAsync = require('../utils/catchAsync');
const ApiResponse = require('../utils/apiResponse');
const ApiError = require('../utils/apiError');
const { Organization } = require('../models');

const slugify = (str) =>
  str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-');

// POST /api/v1/organizations
const createOrganization = catchAsync(async (req, res) => {
  const { name } = req.body;
  let slug = slugify(name);

  const existing = await Organization.findOne({ slug });
  if (existing) slug = `${slug}-${Date.now().toString(36)}`;

  const org = await Organization.create({
    name,
    slug,
    owner: req.user._id,
    members: [{ user: req.user._id, role: 'org_admin' }],
  });

  res.status(201).json(new ApiResponse(201, { organization: org }, 'Organization created.'));
});

// GET /api/v1/organizations (orgs the current user belongs to)
const getMyOrganizations = catchAsync(async (req, res) => {
  const orgs = await Organization.find({ 'members.user': req.user._id, isActive: true }).sort(
    '-createdAt'
  );
  res.status(200).json(new ApiResponse(200, { organizations: orgs }));
});

// GET /api/v1/organizations/:id
const getOrganizationById = catchAsync(async (req, res) => {
  const org = await Organization.findById(req.params.id).populate(
    'members.user',
    'firstName lastName email avatar'
  );
  if (!org) throw new ApiError(404, 'Organization not found.');
  res.status(200).json(new ApiResponse(200, { organization: org }));
});

// PATCH /api/v1/organizations/:id
const updateOrganization = catchAsync(async (req, res) => {
  const allowedFields = ['name', 'logo', 'customDomain'];
  const updates = {};
  allowedFields.forEach((f) => {
    if (req.body[f] !== undefined) updates[f] = req.body[f];
  });

  const org = await Organization.findByIdAndUpdate(req.params.id, updates, {
    new: true,
    runValidators: true,
  });
  if (!org) throw new ApiError(404, 'Organization not found.');

  res.status(200).json(new ApiResponse(200, { organization: org }, 'Organization updated.'));
});

// POST /api/v1/organizations/:id/members
const addMember = catchAsync(async (req, res) => {
  const { userId, role = 'member' } = req.body;
  const org = await Organization.findById(req.params.id);
  if (!org) throw new ApiError(404, 'Organization not found.');

  const alreadyMember = org.members.some((m) => m.user.toString() === userId);
  if (alreadyMember) throw new ApiError(409, 'User is already a member of this organization.');

  org.members.push({ user: userId, role });
  await org.save();

  res.status(200).json(new ApiResponse(200, { organization: org }, 'Member added.'));
});

// DELETE /api/v1/organizations/:id/members/:userId
const removeMember = catchAsync(async (req, res) => {
  const org = await Organization.findById(req.params.id);
  if (!org) throw new ApiError(404, 'Organization not found.');

  org.members = org.members.filter((m) => m.user.toString() !== req.params.userId);
  await org.save();

  res.status(200).json(new ApiResponse(200, { organization: org }, 'Member removed.'));
});

module.exports = {
  createOrganization,
  getMyOrganizations,
  getOrganizationById,
  updateOrganization,
  addMember,
  removeMember,
};
