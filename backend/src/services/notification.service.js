const notificationRepository = require('../repositories/notification.repository');
const tripRepository = require('../repositories/trip.repository');
const AppError = require('../utils/AppError');

const NOTIFICATION_TYPES = {
  EXPENSE_ADDED: 'expense_added',
  BALANCE_CHANGED: 'balance_changed',
  MEMBER_ADDED: 'member_added'
};

const createExpenseNotification = async (expense, tripId) => {
  const trip = await tripRepository.findById(tripId);
  if (!trip) return;

  const notifications = trip.members
    .filter(member => member.userId !== expense.paidById)
    .map(member => ({
      userId: member.userId,
      type: NOTIFICATION_TYPES.EXPENSE_ADDED,
      title: 'New Expense Added',
      message: `${expense.paidBy.name} added "${expense.description}" for $${expense.amount}`,
      data: {
        tripId,
        expenseId: expense.id,
        tripName: trip.name,
        amount: expense.amount
      }
    }));

  if (notifications.length > 0) {
    await notificationRepository.createMany(notifications);
  }
};

const createBalanceNotification = async (tripId, affectedUserIds) => {
  const trip = await tripRepository.findById(tripId);
  if (!trip) return;

  const notifications = affectedUserIds.map(userId => ({
    userId,
    type: NOTIFICATION_TYPES.BALANCE_CHANGED,
    title: 'Balance Updated',
    message: `Your balance in "${trip.name}" has been updated`,
    data: {
      tripId,
      tripName: trip.name
    }
  }));

  if (notifications.length > 0) {
    await notificationRepository.createMany(notifications);
  }
};

const getUserNotifications = async (userId, limit) => {
  return await notificationRepository.findByUserId(userId, limit);
};

const markNotificationAsRead = async (notificationId, userId) => {
  return await notificationRepository.markAsRead(notificationId, userId);
};

const markAllNotificationsAsRead = async (userId) => {
  return await notificationRepository.markAllAsRead(userId);
};

const getUnreadCount = async (userId) => {
  return await notificationRepository.getUnreadCount(userId);
};

module.exports = {
  NOTIFICATION_TYPES,
  createExpenseNotification,
  createBalanceNotification,
  getUserNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  getUnreadCount
};