const express = require('express');
const { body } = require('express-validator');
const { 
  createTrip, 
  getTrips, 
  getTripById, 
  updateTrip, 
  deleteTrip, 
  addMember, 
  removeMember, 
  getBalances,
  getSuggestedPayments,
  getUserBalance,
  updateMemberDeposit
} = require('../controllers/trip.controller');
const { protect } = require('../middlewares/auth');
const { requireTripMember, requireTripAdmin } = require('../middlewares/tripAccess');
const validate = require('../middlewares/validate');
const expenseRoutes = require('./expense.routes');

const router = express.Router();

router.use(protect);

// Create trip (Team Lead only)
router.post('/',
  [
    body('name').notEmpty().withMessage('Trip name is required'),
    body('description').optional().isString(),
    body('currency').optional().isString(),
    body('budget').optional().isNumeric().withMessage('Budget must be a number'),
    body('startDate').optional().isISO8601().withMessage('Invalid start date'),
    body('endDate').optional().isISO8601().withMessage('Invalid end date'),
    validate
  ],
  createTrip
);

// Get user's trips
router.get('/', getTrips);

// Get trip by ID (members only)
router.get('/:id', requireTripMember, getTripById);

// Update trip (Team Lead only)
router.put('/:id',
  [
    body('name').optional().notEmpty().withMessage('Trip name cannot be empty'),
    body('description').optional().isString(),
    body('currency').optional().isString(),
    body('budget').optional().isNumeric().withMessage('Budget must be a number'),
    body('startDate').optional().isISO8601().withMessage('Invalid start date'),
    body('endDate').optional().isISO8601().withMessage('Invalid end date'),
    validate
  ],
  requireTripAdmin,
  updateTrip
);

// Delete trip (Team Lead only)
router.delete('/:id', requireTripAdmin, deleteTrip);

// Add member (Team Lead only)
router.post('/:id/members',
  [
    body('email').isEmail().withMessage('Valid email required'),
    validate
  ],
  requireTripAdmin,
  addMember
);

// Remove member (Team Lead only)
router.delete('/:id/members',
  [
    body('userId').notEmpty().withMessage('User ID is required'),
    validate
  ],
  requireTripAdmin,
  removeMember
);

// Update member deposit (Team Lead only)
router.put('/:id/members/deposit',
  [
    body('userId').notEmpty().withMessage('User ID is required'),
    body('amount').isFloat({ min: 0 }).withMessage('Amount must be a positive number'),
    validate
  ],
  requireTripAdmin,
  updateMemberDeposit
);

// Get balances (members only)
router.get('/:id/balances', requireTripMember, getBalances);

// Get user's own balance (members only)
router.get('/:id/my-balance', requireTripMember, getUserBalance);

// Get suggested payments (members only)
router.get('/:id/suggested-payments', requireTripMember, getSuggestedPayments);

// Expense routes (must be last to avoid conflicts)
router.use('/:tripId/expenses', expenseRoutes);

module.exports = router;
