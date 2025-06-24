// middleware/logger.js - Custom logging middleware

const logger = (req, res, next) => {
  const timestamp = new Date().toISOString();
  const method = req.method;
  const url = req.originalUrl || req.url;
  const userAgent = req.get('User-Agent') || 'Unknown';
  
  console.log(`[${timestamp}] ${method} ${url} - ${userAgent}`);
  
  // Log response status when the response finishes
  const originalSend = res.send;
  res.send = function(data) {
    console.log(`[${timestamp}] ${method} ${url} - ${res.statusCode}`);
    originalSend.call(this, data);
  };
  
  next();
};

module.exports = logger;
