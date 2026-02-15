const asyncHandler = require('../utils/asyncHandler');
const notificationService = require('../services/notification.service');

const getNotifications = asyncHandler(async (req, res) => {
  const limit = parseInt(req.query.limit) || 50;
  const notifications = await notificationService.getUserNotifications(req.user.id, limit);
  res.json({ success: true, data: notifications });
});

const markAsRead = asyncHandler(async (req, res) => {
  await notificationService.markNotificationAsRead(req.params.id, req.user.id);
  res.json({ success: true, message: 'Notification marked as read' });
});

const markAllAsRead = asyncHandler(async (req, res) => {
  await notificationService.markAllNotificationsAsRead(req.user.id);
  res.json({ success: true, message: 'All notifications marked as read' });
});

const getUnreadCount = asyncHandler(async (req, res) => {
  const count = await notificationService.getUnreadCount(req.user.id);
  res.json({ success: true, data: { count } });
});

module.exports = { getNotifications, markAsRead, markAllAsRead, getUnreadCount };