const prisma = require('../config/database');

const create = async (data) => {
  return await prisma.notification.create({ data });
};

const createMany = async (notifications) => {
  return await prisma.notification.createMany({ data: notifications });
};

const findByUserId = async (userId, limit = 50) => {
  return await prisma.notification.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    take: limit
  });
};

const markAsRead = async (id, userId) => {
  return await prisma.notification.update({
    where: { id, userId },
    data: { read: true }
  });
};

const markAllAsRead = async (userId) => {
  return await prisma.notification.updateMany({
    where: { userId, read: false },
    data: { read: true }
  });
};

const getUnreadCount = async (userId) => {
  return await prisma.notification.count({
    where: { userId, read: false }
  });
};

module.exports = { create, createMany, findByUserId, markAsRead, markAllAsRead, getUnreadCount };