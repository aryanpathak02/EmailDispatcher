const express = require('express');
const { healthLimiter } = require('../middleware/rateLimiter');
const HTTP_STATUS = require('../utils/httpStatus');

const router = express.Router();

/**
 * Health check endpoint with rate limiting
 */
router.get('/health', healthLimiter, (req, res) => {
  res.status(HTTP_STATUS.OK).json({ 
    success: true,
    status: 'OK', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    rateLimit: {
      limit: req.rateLimit?.limit,
      remaining: req.rateLimit?.remaining,
      reset: req.rateLimit?.reset
    }
  });
});

module.exports = router;