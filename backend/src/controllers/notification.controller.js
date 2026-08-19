const catchAsync = require('../utils/catchAsync');
const ApiResponse = require('../utils/apiResponse');
const ApiError = require('../utils/apiError');
const { Notification } = require('../models');

// GET /api/v1/notifications?unreadOnly=true&limit=20
const getNotifications = catchAsync(async (req, res) => {
  const { unreadOnly, limit = 20, page = 1 } = req.query;

  const query = { recipient: req.user._id };
  if (unreadOnly === 'true') query.isRead = false;

  const notifications = await Notification.find(query)
    .populate('sender', 'firstName lastName avatar')
    .sort('-createdAt')
    .skip((Number(page) - 1) * Number(limit))
    .limit(Number(limit));

  const unreadCount = await Notification.countDocuments({ recipient: req.user._id, isRead: false });

  res.status(200).json(new ApiResponse(200, { notifications, unreadCount }));
});

// PATCH /api/v1/notifications/:id/read
const markAsRead = catchAsync(async (req, res) => {
  const notification = await Notification.findOneAndUpdate(
    { _id: req.params.id, recipient: req.user._id },
    { isRead: true },
    { new: true }
  );
  if (!notification) throw new ApiError(404, 'Notification not found.');

  res.status(200).json(new ApiResponse(200, { notification }));
});

// PATCH /api/v1/notifications/read-all
const markAllAsRead = catchAsync(async (req, res) => {
  await Notification.updateMany({ recipient: req.user._id, isRead: false }, { isRead: true });
  res.status(200).json(new ApiResponse(200, null, 'All notifications marked as read.'));
});

// DELETE /api/v1/notifications/:id
const deleteNotification = catchAsync(async (req, res) => {
  const notification = await Notification.findOneAndDelete({
    _id: req.params.id,
    recipient: req.user._id,
  });
  if (!notification) throw new ApiError(404, 'Notification not found.');

  res.status(200).json(new ApiResponse(200, null, 'Notification deleted.'));
});

module.exports = { getNotifications, markAsRead, markAllAsRead, deleteNotification };
