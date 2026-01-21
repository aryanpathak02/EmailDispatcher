const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

// Import middleware
const { securityHeaders } = require('./middleware/security');
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');
const { generalLimiter } = require('./middleware/rateLimiter');

// Import routes
const emailRoutes = require('./routes/email');
const healthRoutes = require('./routes/health');

// Import utilities
const { createTransporter } = require('./utils/emailService');

const app = express();

// Environment variables with defaults
const allowedOrigin = process.env.ALLOWED_ORIGIN || '*';
const allowedMethods = process.env.ALLOWED_METHODS ? process.env.ALLOWED_METHODS.split(',') : ['GET', 'POST', 'OPTIONS'];
const allowedHeaders = process.env.ALLOWED_HEADERS ? process.env.ALLOWED_HEADERS.split(',') : ['Content-Type', 'Authorization'];

// Validate required environment variables
const requiredEnvVars = ['EMAIL_USER', 'EMAIL_PASSWORD', 'SENDER_EMAIL'];
const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

if (missingEnvVars.length > 0) {
  console.error('Missing required environment variables:', missingEnvVars.join(', '));
  // Don't exit in serverless environment (Vercel), just log error
  if (process.env.VERCEL !== '1') {
    process.exit(1);
  }
}

// Create email transporter and store in app locals
try {
  if (process.env.EMAIL_USER && process.env.EMAIL_PASSWORD) {
    app.locals.transporter = createTransporter();
    console.log('Email transporter created successfully');
  } else {
    console.warn('Email configuration missing, email functionality disabled');
  }
} catch (error) {
  console.error('Failed to create email transporter:', error.message);
  // Don't exit in serverless environment
  if (process.env.VERCEL !== '1') {
    process.exit(1);
  }
}

// Middleware
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

// CORS configuration
app.use(cors({
  origin: allowedOrigin,
  methods: allowedMethods,
  allowedHeaders: allowedHeaders,
  credentials: true
}));

// Security headers
app.use(securityHeaders);

// Apply general rate limiting (skip in development)
if (process.env.NODE_ENV === 'production') {
  app.use(generalLimiter);
}

// Routes - support both /api prefix (Vercel) and root (traditional)
const isVercel = process.env.VERCEL === '1';
const routePrefix = isVercel ? '/api' : '';

app.use(routePrefix, healthRoutes);
app.use(routePrefix, emailRoutes);

// Root route for API info
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Portfolio Contact API',
    version: '1.0.0',
    platform: isVercel ? 'Vercel' : 'Traditional Server',
    endpoints: {
      health: `${routePrefix}/health`,
      sendEmail: `${routePrefix}/send-email`
    }
  });
});

// 404 handler
app.use('*', notFoundHandler);

// Global error handler
app.use(errorHandler);

module.exports = app;