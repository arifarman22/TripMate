const asyncHandler = require('../utils/asyncHandler');
const expenseRepository = require('../repositories/expense.repository');
const tripRepository = require('../repositories/trip.repository');
const AppError = require('../utils/AppError');

const requireExpenseAccess = asyncHandler(async (req, res, next) => {
  const expense = await expenseRepository.findById(req.params.id);
  if (!expense) throw new AppError('Expense not found', 404);

  const trip = await tripRepository.findById(expense.tripId);
  const isMember = trip.members.some(m => m.userId === req.user.id);
  if (!isMember) throw new AppError('Access denied', 403);

  const isPayerOrAdmin = expense.paidById === req.user.id || 
    trip.members.some(m => m.userId === req.user.id && m.role === 'admin');
  if (!isPayerOrAdmin) throw new AppError('Only payer or team lead can modify expense', 403);

  req.expense = expense;
  req.trip = trip;
  next();
});

module.exports = { requireExpenseAccess };