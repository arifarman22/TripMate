const express = require('express');
const authRoutes = require('./auth.routes');
const tripRoutes = require('./trip.routes');
const expenseOperationsRoutes = require('./expenseOperations.routes');
const notificationRoutes = require('./notification.routes');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/trips', tripRoutes);
router.use('/expenses', expenseOperationsRoutes);
router.use('/notifications', notificationRoutes);

module.exports = router;
