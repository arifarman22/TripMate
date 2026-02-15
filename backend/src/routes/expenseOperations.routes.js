const express = require('express');
const { body } = require('express-validator');
const { updateExpense, deleteExpense } = require('../controllers/expense.controller');
const { protect } = require('../middlewares/auth');
const { requireExpenseAccess } = require('../middlewares/expenseAccess');
const validate = require('../middlewares/validate');

const router = express.Router();

router.use(protect);

// Update expense (payer or team lead only)
router.put('/:id',
  [
    body('description').optional().notEmpty().withMessage('Description cannot be empty'),
    body('amount').optional().isFloat({ min: 0.01 }).withMessage('Amount must be greater than 0'),
    body('category').optional().isString(),
    body('date').optional().isISO8601().withMessage('Invalid date'),
    body('splitType').optional().isIn(['equal', 'custom']).withMessage('Split type must be equal or custom'),
    body('splits').optional().isArray({ min: 1 }).withMessage('At least one split required'),
    body('splits.*.userId').if(body('splits').exists()).notEmpty().withMessage('User ID required for split'),
    body('splits.*.amount').if(body('splitType').equals('custom')).isFloat({ min: 0 }).withMessage('Split amount required for custom split'),
    validate
  ],
  requireExpenseAccess,
  updateExpense
);

// Delete expense (payer or team lead only)
router.delete('/:id', requireExpenseAccess, deleteExpense);

module.exports = router;