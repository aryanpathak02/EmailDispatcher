const app = require('./app');

// Environment variables
const port = process.env.PORT || 3000;
const nodeEnv = process.env.NODE_ENV || 'development';

// Graceful shutdown handlers
const gracefulShutdown = (signal) => {
  console.log(`${signal} received, shutting down gracefully`);
  process.exit(0);
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Start server
app.listen(port, () => {
  console.log(`🚀 Server running on port ${port} in ${nodeEnv} mode`);
  console.log(`📧 Email service configured`);
  console.log(`🌐 Allowed origin: ${process.env.ALLOWED_ORIGIN || 'http://localhost:3000'}`);
  console.log(`💚 Health check: http://localhost:${port}/health`);
});