const jwt = require('jsonwebtoken');
const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/AppError');
const { JWT_SECRET } = require('../config/env');
const prisma = require('../config/database');

const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (req.headers.authorization?.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    throw new AppError('Not authorized to access this route', 401);
  }

  const decoded = jwt.verify(token, JWT_SECRET);
  const user = await prisma.user.findUnique({
    where: { id: decoded.id },
    select: { id: true, email: true, name: true }
  });

  if (!user) {
    throw new AppError('User not found', 401);
  }

  req.user = user;
  next();
});

module.exports = { protect };
