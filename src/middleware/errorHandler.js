const HTTP_STATUS = require('../utils/httpStatus');

/**
 * Global error handler middleware
 */
const errorHandler = (error, req, res, next) => {
  console.error('Unhandled error:', error);
  
  // Don't expose error details in production
  const isDevelopment = process.env.NODE_ENV !== 'production';
  
  res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
    success: false,
    message: 'Internal server error',
    ...(isDevelopment && { error: error.message, stack: error.stack })
  });
};

/**
 * 404 handler middleware
 */
const notFoundHandler = (req, res) => {
  res.status(HTTP_STATUS.NOT_FOUND).json({ 
    success: false,
    message: 'Endpoint not found',
    path: req.path
  });
};

module.exports = {
  errorHandler,
  notFoundHandler
};