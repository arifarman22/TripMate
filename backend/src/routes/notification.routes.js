const express = require('express');
const { getNotifications, markAsRead, markAllAsRead, getUnreadCount } = require('../controllers/notification.controller');
const { protect } = require('../middlewares/auth');

const router = express.Router();

router.use(protect);

router.get('/', getNotifications);
router.get('/unread-count', getUnreadCount);
router.put('/:id/read', markAsRead);
router.put('/mark-all-read', markAllAsRead);

module.exports = router;