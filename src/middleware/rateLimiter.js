const rateLimit = require('express-rate-limit');
const HTTP_STATUS = require('../utils/httpStatus');

/**
 * General rate limiter for all endpoints
 */
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later.',
    retryAfter: '15 minutes'
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  statusCode: HTTP_STATUS.TOO_MANY_REQUESTS || 429,
});

/**
 * Strict rate limiter for email sending endpoint
 */
const emailLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // Limit each IP to 5 email requests per hour
  message: {
    success: false,
    message: 'Too many email requests from this IP. Please wait before sending another message.',
    retryAfter: '1 hour',
    limit: 5,
    windowMs: '1 hour'
  },
  standardHeaders: true,
  legacyHeaders: false,
  statusCode: HTTP_STATUS.TOO_MANY_REQUESTS || 429,
  // Skip successful requests in count (optional)
  skipSuccessfulRequests: false,
  // Skip failed requests in count (optional) 
  skipFailedRequests: false,
});

/**
 * Very strict rate limiter for repeated failures
 */
const strictLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 3, // Only 3 attempts per 5 minutes
  message: {
    success: false,
    message: 'Too many failed attempts. Please wait 5 minutes before trying again.',
    retryAfter: '5 minutes'
  },
  standardHeaders: true,
  legacyHeaders: false,
  statusCode: HTTP_STATUS.TOO_MANY_REQUESTS || 429,
});

/**
 * Health check rate limiter (more lenient)
 */
const healthLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 30, // 30 requests per minute for health checks
  message: {
    success: false,
    message: 'Too many health check requests.',
    retryAfter: '1 minute'
  },
  standardHeaders: true,
  legacyHeaders: false,
  statusCode: HTTP_STATUS.TOO_MANY_REQUESTS || 429,
});

module.exports = {
  generalLimiter,
  emailLimiter,
  strictLimiter,
  healthLimiter
};