const logger = require('../utils/logger');
const AppError = require('../utils/AppError');

const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log error with context
  logger.error({
    message: err.message,
    stack: err.stack,
    url: req.originalUrl,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent')
  });

  // Prisma errors
  if (err.code === 'P2002') {
    error = new AppError('Duplicate field value', 400);
  }
  if (err.code === 'P2025') {
    error = new AppError('Record not found', 404);
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    error = new AppError('Invalid token', 401);
  }
  if (err.name === 'TokenExpiredError') {
    error = new AppError('Token expired', 401);
  }

  // Validation errors
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(val => val.message).join(', ');
    error = new AppError(message, 400);
  }

  // Production error response
  const response = {
    success: false,
    error: {
      message: error.message || 'Internal server error',
      ...(process.env.NODE_ENV === 'development' && {
        stack: err.stack,
        details: err
      })
    }
  };

  res.status(error.statusCode || 500).json(response);
};

const notFound = (req, res, next) => {
  const error = new AppError(`Route ${req.originalUrl} not found`, 404);
  next(error);
};

module.exports = { errorHandler, notFound };
