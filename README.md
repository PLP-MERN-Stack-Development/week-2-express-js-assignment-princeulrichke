[![Open in Visual Studio Code](https://classroom.github.com/assets/open-in-vscode-2e0aaae1b6195c2367325f4f02e2d04e9abb55f0b24a779b69b11b9e10269abc.svg)](https://classroom.github.com/online_ide?assignment_repo_id=19845071&assignment_repo_type=AssignmentRepo)

# Products API - Express.js RESTful Service

A complete RESTful API built with Express.js for managing products with authentication, validation, error handling, and advanced features.

## 🚀 Features

- **Complete CRUD Operations** for products
- **Custom Middleware** for logging, authentication, and validation
- **Advanced Error Handling** with custom error classes
- **Search and Filter** capabilities
- **Pagination** support
- **Product Statistics** endpoint
- **API Key Authentication**
- **Comprehensive Input Validation**

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd express-products-api
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env file with your configuration
   ```

4. **Start the server**
   ```bash
   # Development mode (with auto-restart)
   npm run dev

   # Production mode
   npm start
   ```

The server will start on `http://localhost:3000`

## 🔑 Authentication

All API endpoints (except root `/` and `/health`) require an API key in the request headers:

```
x-api-key: your-api-key-here
```

Default API key for development: `demo-api-key-12345`

## 📚 API Documentation

### Base URL
```
http://localhost:3000
```

### Public Endpoints

#### Get API Information
```http
GET /
```

#### Health Check
```http
GET /health
```

### Products Endpoints (Require API Key)

#### 1. Get All Products
```http
GET /api/products
```

**Query Parameters:**
- `category` (optional): Filter by product category
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)

**Example:**
```bash
curl -H "x-api-key: demo-api-key-12345" \
     "http://localhost:3000/api/products?category=electronics&page=1&limit=5"
```

**Response:**
```json
{
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 5,
    "total": 15,
    "totalPages": 3,
    "hasNext": true,
    "hasPrev": false
  }
}
```

#### 2. Get Product by ID
```http
GET /api/products/:id
```

**Example:**
```bash
curl -H "x-api-key: demo-api-key-12345" \
     "http://localhost:3000/api/products/123e4567-e89b-12d3-a456-426614174000"
```

#### 3. Create New Product
```http
POST /api/products
```

**Request Body:**
```json
{
  "name": "New Product",
  "description": "Product description",
  "price": 99.99,
  "category": "electronics",
  "inStock": true
}
```

**Example:**
```bash
curl -X POST \
     -H "Content-Type: application/json" \
     -H "x-api-key: demo-api-key-12345" \
     -d '{
       "name": "Gaming Mouse",
       "description": "High-precision gaming mouse with RGB lighting",
       "price": 79.99,
       "category": "electronics",
       "inStock": true
     }' \
     "http://localhost:3000/api/products"
```

#### 4. Update Product
```http
PUT /api/products/:id
```

**Request Body (partial updates allowed):**
```json
{
  "name": "Updated Product Name",
  "price": 129.99,
  "inStock": false
}
```

**Example:**
```bash
curl -X PUT \
     -H "Content-Type: application/json" \
     -H "x-api-key: demo-api-key-12345" \
     -d '{"price": 89.99, "inStock": false}' \
     "http://localhost:3000/api/products/123e4567-e89b-12d3-a456-426614174000"
```

#### 5. Delete Product
```http
DELETE /api/products/:id
```

**Example:**
```bash
curl -X DELETE \
     -H "x-api-key: demo-api-key-12345" \
     "http://localhost:3000/api/products/123e4567-e89b-12d3-a456-426614174000"
```

#### 6. Search Products
```http
GET /api/products/search?name=<search-term>
```

**Example:**
```bash
curl -H "x-api-key: demo-api-key-12345" \
     "http://localhost:3000/api/products/search?name=laptop"
```

#### 7. Get Product Statistics
```http
GET /api/products/stats
```

**Example:**
```bash
curl -H "x-api-key: demo-api-key-12345" \
     "http://localhost:3000/api/products/stats"
```

**Response:**
```json
{
  "totalProducts": 25,
  "inStockCount": 20,
  "outOfStockCount": 5,
  "categoryStats": {
    "electronics": 10,
    "kitchen": 8,
    "furniture": 7
  },
  "averagePrice": 156.78
}
```

## 🏗️ Project Structure

```
├── server.js              # Main server file
├── package.json           # Dependencies and scripts
├── .env                   # Environment variables (not in repo)
├── .env.example          # Environment variables template
├── README.md             # This file
├── routes/
│   └── products.js       # Product routes and business logic
├── middleware/
│   ├── auth.js          # API key authentication
│   ├── logger.js        # Request logging
│   └── validate.js      # Input validation
└── errors/
    ├── NotFoundError.js # Custom 404 error
    └── ValidationError.js # Custom validation error
```

## 🔍 Product Schema

```javascript
{
  id: String,          // UUID (auto-generated)
  name: String,        // Required, max 100 characters
  description: String, // Required, max 500 characters
  price: Number,       // Required, positive number
  category: String,    // Required, lowercase
  inStock: Boolean     // Required
}
```

## ⚡ Middleware Features

### 1. Logger Middleware
- Logs HTTP method, URL, timestamp, and user agent
- Logs response status codes
- Located in `middleware/logger.js`

### 2. Authentication Middleware
- Validates API key from `x-api-key` header
- Skips authentication for root route
- Located in `middleware/auth.js`

### 3. Validation Middleware
- Validates required fields and data types
- Provides detailed error messages
- Supports both creation and update validation
- Located in `middleware/validate.js`

## 🚨 Error Handling

The API uses custom error classes for consistent error responses:

### NotFoundError (404)
```json
{
  "error": "NotFoundError",
  "message": "Product with ID xyz not found"
}
```

### ValidationError (400)
```json
{
  "error": "ValidationError",
  "message": "Product validation failed",
  "details": [
    "Name is required and must be a non-empty string",
    "Price must be a positive number"
  ]
}
```

### Authentication Error (401)
```json
{
  "error": "Unauthorized",
  "message": "API key is required. Please provide x-api-key header."
}
```

## 🧪 Testing the API

### Using curl:
```bash
# Get all products
curl -H "x-api-key: demo-api-key-12345" http://localhost:3000/api/products

# Create a product
curl -X POST \
     -H "Content-Type: application/json" \
     -H "x-api-key: demo-api-key-12345" \
     -d '{"name":"Test Product","description":"A test product","price":19.99,"category":"test","inStock":true}' \
     http://localhost:3000/api/products

# Search products
curl -H "x-api-key: demo-api-key-12345" \
     "http://localhost:3000/api/products/search?name=laptop"
```

### Using JavaScript/Fetch:
```javascript
// Set your API key
const API_KEY = 'demo-api-key-12345';
const BASE_URL = 'http://localhost:3000/api';

// Get all products
fetch(`${BASE_URL}/products`, {
  headers: { 'x-api-key': API_KEY }
})
.then(res => res.json())
.then(data => console.log(data));

// Create a product
fetch(`${BASE_URL}/products`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'x-api-key': API_KEY
  },
  body: JSON.stringify({
    name: 'New Product',
    description: 'Product description',
    price: 99.99,
    category: 'electronics',
    inStock: true
  })
})
.then(res => res.json())
.then(data => console.log(data));
```

## 🔧 Development

### Available Scripts
- `npm start` - Start the production server
- `npm run dev` - Start the development server with auto-restart

### Environment Variables
- `API_KEY` - Secret key for API authentication
- `PORT` - Server port (default: 3000)
- `NODE_ENV` - Environment mode (development/production)

## 🛡️ Security Notes

- Always use strong, unique API keys in production
- Consider implementing rate limiting for production use
- The current implementation uses in-memory storage - use a database for production
- Add HTTPS in production environments
- Consider implementing more sophisticated authentication (JWT, OAuth)

## 📝 Assignment Requirements Met

✅ Express.js server setup on port 3000  
✅ RESTful routes for products resource  
✅ Custom middleware (logger, auth, validation)  
✅ Error handling with custom error classes  
✅ Advanced features (search, pagination, stats)  
✅ Proper HTTP status codes  
✅ Modular code structure  
✅ Complete documentation  

## Resources

- [Express.js Documentation](https://expressjs.com/)
- [RESTful API Design Best Practices](https://restfulapi.net/)
- [HTTP Status Codes](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status) 