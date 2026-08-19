const catchAsync = require('../utils/catchAsync');
const ApiResponse = require('../utils/apiResponse');
const ApiError = require('../utils/apiError');
const { User } = require('../models');

// GET /api/v1/users/:id
const getUserById = catchAsync(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) throw new ApiError(404, 'User not found.');
  res.status(200).json(new ApiResponse(200, { user: user.toSafeObject() }));
});

// PATCH /api/v1/users/me
const updateProfile = catchAsync(async (req, res) => {
  const allowedFields = ['firstName', 'lastName', 'jobTitle'];
  const updates = {};
  allowedFields.forEach((field) => {
    if (req.body[field] !== undefined) updates[field] = req.body[field];
  });

  const user = await User.findByIdAndUpdate(req.user._id, updates, {
    new: true,
    runValidators: true,
  });

  res.status(200).json(new ApiResponse(200, { user: user.toSafeObject() }, 'Profile updated.'));
});

// POST /api/v1/users/me/avatar
const uploadAvatar = catchAsync(async (req, res) => {
  if (!req.file) throw new ApiError(400, 'No avatar file provided.');

  const avatarUrl = `/uploads/avatars/${req.file.filename}`;
  const user = await User.findByIdAndUpdate(
    req.user._id,
    { avatar: avatarUrl },
    { new: true }
  );

  res.status(200).json(new ApiResponse(200, { user: user.toSafeObject() }, 'Avatar updated.'));
});

// PATCH /api/v1/users/me/password
const changePassword = catchAsync(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const user = await User.findById(req.user._id).select('+password');

  if (user.password) {
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) throw new ApiError(401, 'Current password is incorrect.');
  }

  user.password = newPassword;
  await user.save();

  res.status(200).json(new ApiResponse(200, null, 'Password changed successfully.'));
});

// DELETE /api/v1/users/me
const deactivateAccount = catchAsync(async (req, res) => {
  await User.findByIdAndUpdate(req.user._id, { isActive: false });
  res.status(200).json(new ApiResponse(200, null, 'Account deactivated.'));
});

module.exports = {
  getUserById,
  updateProfile,
  uploadAvatar,
  changePassword,
  deactivateAccount,
};
