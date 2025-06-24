// routes/products.js - Product routes and business logic

const express = require('express');
const { v4: uuidv4 } = require('uuid');
const router = express.Router();

const NotFoundError = require('../errors/NotFoundError');
const ValidationError = require('../errors/ValidationError');
const { validateCreateProduct, validateUpdateProduct } = require('../middleware/validate');

// In-memory products database (in a real app, this would be a database)
let products = [
  {
    id: uuidv4(),
    name: 'Laptop',
    description: 'High-performance laptop with 16GB RAM and 512GB SSD',
    price: 1299.99,
    category: 'electronics',
    inStock: true
  },
  {
    id: uuidv4(),
    name: 'Smartphone',
    description: 'Latest model smartphone with 128GB storage and 5G connectivity',
    price: 899.99,
    category: 'electronics',
    inStock: true
  },
  {
    id: uuidv4(),
    name: 'Coffee Maker',
    description: 'Programmable coffee maker with built-in timer and auto-shutoff',
    price: 79.99,
    category: 'kitchen',
    inStock: false
  },
  {
    id: uuidv4(),
    name: 'Desk Chair',
    description: 'Ergonomic office chair with lumbar support and adjustable height',
    price: 249.99,
    category: 'furniture',
    inStock: true
  },
  {
    id: uuidv4(),
    name: 'Headphones',
    description: 'Wireless noise-cancelling headphones with 30-hour battery life',
    price: 199.99,
    category: 'electronics',
    inStock: true
  }
];

// Helper function to find product by ID
const findProductById = (id) => {
  return products.find(product => product.id === id);
};

// GET /api/products - Get all products with optional filtering and pagination
router.get('/', (req, res) => {
  const { category, page = 1, limit = 10 } = req.query;
  let filteredProducts = [...products];
  
  // Filter by category if provided
  if (category) {
    filteredProducts = filteredProducts.filter(
      product => product.category.toLowerCase() === category.toLowerCase()
    );
  }
  
  // Calculate pagination
  const pageNum = parseInt(page, 10);
  const limitNum = parseInt(limit, 10);
  const startIndex = (pageNum - 1) * limitNum;
  const endIndex = startIndex + limitNum;
  
  // Apply pagination
  const paginatedProducts = filteredProducts.slice(startIndex, endIndex);
  
  // Build response with metadata
  const response = {
    data: paginatedProducts,
    pagination: {
      page: pageNum,
      limit: limitNum,
      total: filteredProducts.length,
      totalPages: Math.ceil(filteredProducts.length / limitNum),
      hasNext: endIndex < filteredProducts.length,
      hasPrev: pageNum > 1
    }
  };
  
  res.json(response);
});

// GET /api/products/search - Search products by name
router.get('/search', (req, res) => {
  const { name } = req.query;
  
  if (!name) {
    throw new ValidationError('Search term is required. Use ?name=searchTerm');
  }
  
  const searchResults = products.filter(product =>
    product.name.toLowerCase().includes(name.toLowerCase())
  );
  
  res.json({
    data: searchResults,
    count: searchResults.length,
    searchTerm: name
  });
});

// GET /api/products/stats - Get product statistics
router.get('/stats', (req, res) => {
  const stats = products.reduce((acc, product) => {
    const category = product.category;
    acc[category] = (acc[category] || 0) + 1;
    return acc;
  }, {});
  
  const response = {
    totalProducts: products.length,
    inStockCount: products.filter(p => p.inStock).length,
    outOfStockCount: products.filter(p => !p.inStock).length,
    categoryStats: stats,
    averagePrice: products.reduce((sum, p) => sum + p.price, 0) / products.length
  };
  
  res.json(response);
});

// GET /api/products/:id - Get a specific product by ID
router.get('/:id', (req, res) => {
  const { id } = req.params;
  const product = findProductById(id);
  
  if (!product) {
    throw new NotFoundError(`Product with ID ${id} not found`);
  }
  
  res.json(product);
});

// POST /api/products - Create a new product
router.post('/', validateCreateProduct, (req, res) => {
  const { name, description, price, category, inStock } = req.body;
  
  const newProduct = {
    id: uuidv4(),
    name: name.trim(),
    description: description.trim(),
    price: parseFloat(price),
    category: category.trim().toLowerCase(),
    inStock: Boolean(inStock)
  };
  
  products.push(newProduct);
  
  res.status(201).json({
    message: 'Product created successfully',
    product: newProduct
  });
});

// PUT /api/products/:id - Update an existing product
router.put('/:id', validateUpdateProduct, (req, res) => {
  const { id } = req.params;
  const productIndex = products.findIndex(product => product.id === id);
  
  if (productIndex === -1) {
    throw new NotFoundError(`Product with ID ${id} not found`);
  }
  
  const existingProduct = products[productIndex];
  const updates = req.body;
  
  // Update only provided fields
  const updatedProduct = {
    ...existingProduct,
    ...(updates.name && { name: updates.name.trim() }),
    ...(updates.description && { description: updates.description.trim() }),
    ...(updates.price !== undefined && { price: parseFloat(updates.price) }),
    ...(updates.category && { category: updates.category.trim().toLowerCase() }),
    ...(updates.inStock !== undefined && { inStock: Boolean(updates.inStock) })
  };
  
  products[productIndex] = updatedProduct;
  
  res.json({
    message: 'Product updated successfully',
    product: updatedProduct
  });
});

// DELETE /api/products/:id - Delete a product
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  const productIndex = products.findIndex(product => product.id === id);
  
  if (productIndex === -1) {
    throw new NotFoundError(`Product with ID ${id} not found`);
  }
  
  const deletedProduct = products.splice(productIndex, 1)[0];
  
  res.json({
    message: 'Product deleted successfully',
    product: deletedProduct
  });
});

module.exports = router;
