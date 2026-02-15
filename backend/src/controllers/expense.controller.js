const asyncHandler = require('../utils/asyncHandler');
const expenseService = require('../services/expense.service');

const createExpense = asyncHandler(async (req, res) => {
  const expense = await expenseService.createExpense(req.params.tripId, req.user.id, req.body);
  res.status(201).json({ success: true, data: expense });
});

const getExpenses = asyncHandler(async (req, res) => {
  const expenses = await expenseService.getExpenses(req.params.tripId, req.user.id);
  res.json({ success: true, data: expenses });
});

const updateExpense = asyncHandler(async (req, res) => {
  const expense = await expenseService.updateExpense(req.params.id, req.user.id, req.body);
  res.json({ success: true, data: expense });
});

const deleteExpense = asyncHandler(async (req, res) => {
  await expenseService.deleteExpense(req.params.id, req.user.id);
  res.json({ success: true, message: 'Expense deleted successfully' });
});

module.exports = { createExpense, getExpenses, updateExpense, deleteExpense };
