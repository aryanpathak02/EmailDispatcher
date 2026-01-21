const rateLimit = require('express-rate-limit');
const HTTP_STATUS = require('../utils/httpStatus');

// Check if running on Vercel
const isVercel = process.env.VERCEL === '1';
const isDevelopment = process.env.NODE_ENV === 'development';

/**
 * General rate limiter for all endpoints
 */
const generalLimiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || (isVercel ? 200 : 100), // Higher limit for serverless
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later.',
    retryAfter: '15 minutes'
  },
  standardHeaders: true,
  legacyHeaders: false,
  statusCode: HTTP_STATUS.TOO_MANY_REQUESTS,
  skip: () => isDevelopment, // Skip in development
});

/**
 * Email rate limiter for contact form
 */
const emailLimiter = rateLimit({
  windowMs: parseInt(process.env.EMAIL_RATE_LIMIT_WINDOW_MS) || 60 * 60 * 1000, // 1 hour
  max: parseInt(process.env.EMAIL_RATE_LIMIT_MAX_REQUESTS) || (isVercel ? 10 : 5), // Higher for serverless
  message: {
    success: false,
    message: 'Too many email requests from this IP. Please wait before sending another message.',
    retryAfter: '1 hour',
    limit: isVercel ? 10 : 5,
    windowMs: '1 hour'
  },
  standardHeaders: true,
  legacyHeaders: false,
  statusCode: HTTP_STATUS.TOO_MANY_REQUESTS,
  skip: () => isDevelopment,
});

/**
 * Health check rate limiter
 */
const healthLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: isVercel ? 60 : 30, // Higher for serverless monitoring
  message: {
    success: false,
    message: 'Too many health check requests.',
    retryAfter: '1 minute'
  },
  standardHeaders: true,
  legacyHeaders: false,
  statusCode: HTTP_STATUS.TOO_MANY_REQUESTS,
  skip: () => isDevelopment,
});

/**
 * Strict rate limiter for repeated failures (future use)
 */
const strictLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 3,
  message: {
    success: false,
    message: 'Too many failed attempts. Please wait 5 minutes before trying again.',
    retryAfter: '5 minutes'
  },
  standardHeaders: true,
  legacyHeaders: false,
  statusCode: HTTP_STATUS.TOO_MANY_REQUESTS,
  skip: () => isDevelopment,
});

module.exports = {
  generalLimiter,
  emailLimiter,
  strictLimiter,
  healthLimiter
};