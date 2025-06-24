// middleware/validate.js - Validation middleware for product operations

const ValidationError = require('../errors/ValidationError');

// Validation rules for product fields
const validateProduct = (productData, isUpdate = false) => {
  const errors = [];
  const { name, description, price, category, inStock } = productData;
  
  // Required field validation (skip for updates if field is not provided)
  if (!isUpdate || name !== undefined) {
    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      errors.push('Name is required and must be a non-empty string');
    } else if (name.trim().length > 100) {
      errors.push('Name must be less than 100 characters');
    }
  }
  
  if (!isUpdate || description !== undefined) {
    if (!description || typeof description !== 'string' || description.trim().length === 0) {
      errors.push('Description is required and must be a non-empty string');
    } else if (description.trim().length > 500) {
      errors.push('Description must be less than 500 characters');
    }
  }
  
  if (!isUpdate || price !== undefined) {
    if (price === undefined || price === null) {
      errors.push('Price is required');
    } else if (typeof price !== 'number' || price < 0) {
      errors.push('Price must be a positive number');
    }
  }
  
  if (!isUpdate || category !== undefined) {
    if (!category || typeof category !== 'string' || category.trim().length === 0) {
      errors.push('Category is required and must be a non-empty string');
    }
  }
  
  if (!isUpdate || inStock !== undefined) {
    if (typeof inStock !== 'boolean') {
      errors.push('inStock must be a boolean value');
    }
  }
  
  return errors;
};

// Middleware for validating product creation
const validateCreateProduct = (req, res, next) => {
  const errors = validateProduct(req.body, false);
  
  if (errors.length > 0) {
    throw new ValidationError('Product validation failed', errors);
  }
  
  next();
};

// Middleware for validating product updates
const validateUpdateProduct = (req, res, next) => {
  const errors = validateProduct(req.body, true);
  
  if (errors.length > 0) {
    throw new ValidationError('Product validation failed', errors);
  }
  
  next();
};

module.exports = {
  validateCreateProduct,
  validateUpdateProduct
};
