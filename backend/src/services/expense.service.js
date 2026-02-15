const expenseRepository = require('../repositories/expense.repository');
const tripRepository = require('../repositories/trip.repository');
const notificationService = require('./notification.service');
const AppError = require('../utils/AppError');

const validateSplits = (amount, splits, splitType) => {
  if (splitType === 'equal') {
    const splitAmount = amount / splits.length;
    return splits.map(split => ({ ...split, amount: splitAmount }));
  }
  
  const totalSplit = splits.reduce((sum, split) => sum + parseFloat(split.amount), 0);
  if (Math.abs(totalSplit - parseFloat(amount)) > 0.01) {
    throw new AppError('Split amounts must equal expense total', 400);
  }
  return splits;
};

const createExpense = async (tripId, userId, data) => {
  const trip = await tripRepository.findById(tripId);
  if (!trip) throw new AppError('Trip not found', 404);
  
  const isMember = trip.members.some(m => m.userId === userId);
  if (!isMember) throw new AppError('Access denied', 403);

  const validSplits = validateSplits(data.amount, data.splits, data.splitType);
  
  const expenseData = {
    tripId,
    paidById: userId,
    description: data.description,
    amount: data.amount,
    category: data.category,
    date: data.date ? new Date(data.date) : new Date()
  };

  const expense = await expenseRepository.create(expenseData, validSplits);
  
  // Create notifications for expense and balance changes
  await notificationService.createExpenseNotification(expense, tripId);
  
  const affectedUserIds = validSplits.map(split => split.userId);
  await notificationService.createBalanceNotification(tripId, affectedUserIds);
  
  return expense;
};

const getExpenses = async (tripId, userId) => {
  const trip = await tripRepository.findById(tripId);
  if (!trip) throw new AppError('Trip not found', 404);
  
  const isMember = trip.members.some(m => m.userId === userId);
  if (!isMember) throw new AppError('Access denied', 403);

  return await expenseRepository.findByTripId(tripId);
};

const updateExpense = async (expenseId, userId, data) => {
  const expense = await expenseRepository.findById(expenseId);
  if (!expense) throw new AppError('Expense not found', 404);

  const trip = await tripRepository.findById(expense.tripId);
  const isPayerOrAdmin = expense.paidById === userId || 
    trip.members.some(m => m.userId === userId && m.role === 'admin');
  if (!isPayerOrAdmin) throw new AppError('Only payer or team lead can modify expense', 403);

  const updateData = {};
  if (data.description) updateData.description = data.description;
  if (data.amount) updateData.amount = data.amount;
  if (data.category !== undefined) updateData.category = data.category;
  if (data.date) updateData.date = new Date(data.date);

  let validSplits = null;
  if (data.splits && data.splitType) {
    validSplits = validateSplits(data.amount || expense.amount, data.splits, data.splitType);
  }

  const updatedExpense = await expenseRepository.update(expenseId, updateData, validSplits);
  
  // Notify affected users of balance changes
  const affectedUserIds = validSplits ? 
    validSplits.map(split => split.userId) : 
    expense.splits.map(split => split.userId);
  await notificationService.createBalanceNotification(expense.tripId, affectedUserIds);
  
  return updatedExpense;
};

const deleteExpense = async (expenseId, userId) => {
  const expense = await expenseRepository.findById(expenseId);
  if (!expense) throw new AppError('Expense not found', 404);

  const trip = await tripRepository.findById(expense.tripId);
  const isPayerOrAdmin = expense.paidById === userId || 
    trip.members.some(m => m.userId === userId && m.role === 'admin');
  if (!isPayerOrAdmin) throw new AppError('Only payer or team lead can delete expense', 403);

  return await expenseRepository.deleteExpense(expenseId);
};

module.exports = { createExpense, getExpenses, updateExpense, deleteExpense };
