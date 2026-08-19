const ApiError = require('../utils/apiError');
const logger = require('../utils/logger');

// eslint-disable-next-line no-unused-vars
const errorMiddleware = (err, req, res, next) => {
  let error = err;

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    error = new ApiError(400, `Invalid ${err.path}: ${err.value}`);
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0];
    error = new ApiError(409, `Duplicate value for field: ${field}`);
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((val) => val.message);
    error = new ApiError(400, messages.join(', '));
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    error = new ApiError(401, 'Invalid token. Please log in again.');
  }
  if (err.name === 'TokenExpiredError') {
    error = new ApiError(401, 'Token expired. Please log in again.');
  }

  if (!(error instanceof ApiError)) {
    error = new ApiError(err.statusCode || 500, err.message || 'Internal Server Error');
  }

  if (error.statusCode >= 500) {
    logger.error(`${req.method} ${req.originalUrl} - ${error.message}\n${err.stack}`);
  }

  res.status(error.statusCode).json({
    success: false,
    statusCode: error.statusCode,
    message: error.message,
    errors: error.errors || [],
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

const notFoundMiddleware = (req, res, next) => {
  next(new ApiError(404, `Route not found: ${req.originalUrl}`));
};

module.exports = { errorMiddleware, notFoundMiddleware };
