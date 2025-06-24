// middleware/auth.js - Authentication middleware for API key validation

require('dotenv').config();

const auth = (req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  const expectedApiKey = process.env.API_KEY;
  
  // Skip auth for root route
  if (req.path === '/') {
    return next();
  }
  
  if (!apiKey) {
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'API key is required. Please provide x-api-key header.'
    });
  }
  
  if (apiKey !== expectedApiKey) {
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'Invalid API key provided.'
    });
  }
  
  next();
};

module.exports = auth;
