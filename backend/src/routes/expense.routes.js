const express = require('express');
const { body } = require('express-validator');
const { createExpense, getExpenses, updateExpense, deleteExpense } = require('../controllers/expense.controller');
const { protect } = require('../middlewares/auth');
const { requireTripMember } = require('../middlewares/tripAccess');
const validate = require('../middlewares/validate');

const router = express.Router({ mergeParams: true });

router.use(protect);

// Create expense
router.post('/',
  [
    body('description').notEmpty().withMessage('Description is required'),
    body('amount').isFloat({ min: 0.01 }).withMessage('Amount must be greater than 0'),
    body('category').optional().isString(),
    body('date').optional().isISO8601().withMessage('Invalid date'),
    body('splitType').isIn(['equal', 'custom']).withMessage('Split type must be equal or custom'),
    body('splits').isArray({ min: 1 }).withMessage('At least one split required'),
    body('splits.*.userId').notEmpty().withMessage('User ID required for split'),
    body('splits.*.amount').if(body('splitType').equals('custom')).isFloat({ min: 0 }).withMessage('Split amount required for custom split'),
    validate
  ],
  requireTripMember,
  createExpense
);

// Get expenses
router.get('/', requireTripMember, getExpenses);

module.exports = router;