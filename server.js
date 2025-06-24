// server.js - Complete Express server for Week 2 assignment

// Import required modules
require('dotenv').config();
const express = require('express');

// Import custom middleware
const logger = require('./middleware/logger');
const auth = require('./middleware/auth');

// Import routes
const productsRouter = require('./routes/products');

// Import custom error classes
const NotFoundError = require('./errors/NotFoundError');
const ValidationError = require('./errors/ValidationError');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Global middleware setup
app.use(express.json({ limit: '10mb' })); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies
app.use(logger); // Custom logging middleware

// Root route (public - no auth required)
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to the Products API!',
    version: '1.0.0',
    endpoints: {
      products: '/api/products',
      search: '/api/products/search?name=term',
      stats: '/api/products/stats'
    },
    documentation: 'See README.md for full API documentation'
  });
});

// Health check endpoint (public)
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Apply authentication middleware to API routes
app.use('/api', auth);

// API routes
app.use('/api/products', productsRouter);

// 404 handler for undefined routes
app.use('*', (req, res, next) => {
  throw new NotFoundError(`Route ${req.originalUrl} not found`);
});

// Global error handling middleware
app.use((error, req, res, next) => {
  console.error('Error occurred:', error);
  
  // Handle custom errors
  if (error instanceof NotFoundError || error instanceof ValidationError) {
    return res.status(error.statusCode).json({
      error: error.name,
      message: error.message,
      ...(error.errors && { details: error.errors })
    });
  }
  
  // Handle JSON parsing errors
  if (error instanceof SyntaxError && error.status === 400 && 'body' in error) {
    return res.status(400).json({
      error: 'BadRequest',
      message: 'Invalid JSON format in request body'
    });
  }
  
  // Handle other known errors
  if (error.statusCode) {
    return res.status(error.statusCode).json({
      error: error.name || 'Error',
      message: error.message
    });
  }
  
  // Handle unexpected errors
  res.status(500).json({
    error: 'InternalServerError',
    message: 'An unexpected error occurred',
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
  });
});

// Graceful shutdown handling
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Start the server
const server = app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
  console.log(`📝 API Documentation: http://localhost:${PORT}/`);
  console.log(`🔍 Health Check: http://localhost:${PORT}/health`);
});

// Export the app and server for testing purposes
module.exports = { app, server }; 