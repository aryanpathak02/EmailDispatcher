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
const allowedOrigin = process.env.ALLOWED_ORIGIN || 'http://localhost:3000';
const allowedMethods = process.env.ALLOWED_METHODS ? process.env.ALLOWED_METHODS.split(',') : ['GET', 'POST'];
const allowedHeaders = process.env.ALLOWED_HEADERS ? process.env.ALLOWED_HEADERS.split(',') : ['Content-Type'];

// Validate required environment variables
const requiredEnvVars = ['EMAIL_USER', 'EMAIL_PASSWORD', 'SENDER_EMAIL'];
const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

if (missingEnvVars.length > 0) {
  console.error('Missing required environment variables:', missingEnvVars.join(', '));
  process.exit(1);
}

// Create email transporter and store in app locals
try {
  app.locals.transporter = createTransporter();
  console.log('Email transporter created successfully');
} catch (error) {
  console.error('Failed to create email transporter:', error.message);
  process.exit(1);
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

// Apply general rate limiting to all requests
app.use(generalLimiter);

// Routes
app.use('/', healthRoutes);
app.use('/', emailRoutes);

// 404 handler
app.use('*', notFoundHandler);

// Global error handler
app.use(errorHandler);

module.exports = app;