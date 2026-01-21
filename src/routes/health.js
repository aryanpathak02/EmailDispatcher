const express = require('express');
const { healthLimiter } = require('../middleware/rateLimiter');
const HTTP_STATUS = require('../utils/httpStatus');

const router = express.Router();

/**
 * Health check endpoint
 */
router.get('/health', healthLimiter, (req, res) => {
  const isVercel = process.env.VERCEL === '1';
  
  const healthData = {
    success: true,
    status: 'OK', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    platform: isVercel ? 'Vercel' : 'Traditional Server',
    services: {
      email: !!req.app.locals.transporter,
      api: true
    }
  };

  // Add rate limit info if available
  if (req.rateLimit) {
    healthData.rateLimit = {
      limit: req.rateLimit.limit,
      remaining: req.rateLimit.remaining,
      reset: new Date(req.rateLimit.reset).toISOString()
    };
  }

  res.status(HTTP_STATUS.OK).json(healthData);
});

module.exports = router;