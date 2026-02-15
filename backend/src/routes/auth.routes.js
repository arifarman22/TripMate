const express = require('express');
const { body } = require('express-validator');
const { register, login } = require('../controllers/auth.controller');
const validate = require('../middlewares/validate');

const router = express.Router();

router.post('/register',
  [
    body('email').isEmail().withMessage('Valid email required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('name').notEmpty().withMessage('Name is required'),
    validate
  ],
  register
);

router.post('/login',
  [
    body('email').isEmail().withMessage('Valid email required'),
    body('password').notEmpty().withMessage('Password is required'),
    validate
  ],
  login
);

module.exports = router;
