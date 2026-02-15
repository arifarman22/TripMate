const prisma = require('../config/database');

const create = async (data) => {
  return await prisma.trip.create({ data });
};

const findById = async (id) => {
  return await prisma.trip.findUnique({
    where: { id },
    include: {
      members: { include: { user: { select: { id: true, name: true, email: true } } } },
      expenses: { include: { paidBy: { select: { name: true } }, splits: true } }
    }
  });
};

const findByUserId = async (userId) => {
  return await prisma.trip.findMany({
    where: { members: { some: { userId } } },
    include: { members: { include: { user: { select: { name: true } } } } }
  });
};

const update = async (id, data) => {
  return await prisma.trip.update({
    where: { id },
    data,
    include: {
      members: { include: { user: { select: { id: true, name: true, email: true } } } }
    }
  });
};

const deleteTrip = async (id) => {
  return await prisma.trip.delete({ where: { id } });
};

const addMember = async (tripId, userId, role) => {
  const existing = await prisma.tripMember.findUnique({
    where: { userId_tripId: { userId, tripId } }
  });
  if (existing) throw new Error('User is already a member');
  
  return await prisma.tripMember.create({
    data: { tripId, userId, role },
    include: { user: { select: { id: true, name: true, email: true } } }
  });
};

const removeMember = async (tripId, userId) => {
  return await prisma.tripMember.delete({
    where: { userId_tripId: { userId, tripId } }
  });
};

const getExpenses = async (tripId) => {
  return await prisma.expense.findMany({
    where: { tripId },
    include: { splits: true }
  });
};

module.exports = { create, findById, findByUserId, update, deleteTrip, addMember, removeMember, getExpenses };
