// errors/ValidationError.js - Custom error class for validation failures

class ValidationError extends Error {
  constructor(message = 'Validation failed', errors = []) {
    super(message);
    this.name = 'ValidationError';
    this.statusCode = 400;
    this.errors = errors; // Array of validation error details
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = ValidationError;
