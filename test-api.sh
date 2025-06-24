#!/bin/bash

# API Testing Script for Products API
# Make sure the server is running on port 3001

API_KEY="demo-api-key-12345"
BASE_URL="http://localhost:3001"

echo "🧪 Testing Products API"
echo "======================="

echo ""
echo "1. Testing Root Endpoint (No Auth Required)"
echo "-------------------------------------------"
curl -s ${BASE_URL}/ | jq '.'

echo ""
echo "2. Testing Authentication - No API Key (Should Fail)"
echo "---------------------------------------------------"
curl -s ${BASE_URL}/api/products | jq '.'

echo ""
echo "3. Getting All Products"
echo "----------------------"
curl -s -H "x-api-key: ${API_KEY}" ${BASE_URL}/api/products | jq '.'

echo ""
echo "4. Getting Product Statistics"
echo "----------------------------"
curl -s -H "x-api-key: ${API_KEY}" ${BASE_URL}/api/products/stats | jq '.'

echo ""
echo "5. Searching Products (searching for 'phone')"
echo "--------------------------------------------"
curl -s -H "x-api-key: ${API_KEY}" "${BASE_URL}/api/products/search?name=phone" | jq '.'

echo ""
echo "6. Filtering Products by Category (electronics)"
echo "----------------------------------------------"
curl -s -H "x-api-key: ${API_KEY}" "${BASE_URL}/api/products?category=electronics" | jq '.'

echo ""
echo "7. Creating a New Product"
echo "------------------------"
NEW_PRODUCT='{"name":"Gaming Keyboard","description":"Mechanical gaming keyboard with RGB backlighting","price":159.99,"category":"electronics","inStock":true}'
curl -s -X POST -H "Content-Type: application/json" -H "x-api-key: ${API_KEY}" -d "${NEW_PRODUCT}" ${BASE_URL}/api/products | jq '.'

echo ""
echo "8. Testing Validation Error (Invalid Product Data)"
echo "-------------------------------------------------"
INVALID_PRODUCT='{"name":"","price":-10,"inStock":"not_boolean"}'
curl -s -X POST -H "Content-Type: application/json" -H "x-api-key: ${API_KEY}" -d "${INVALID_PRODUCT}" ${BASE_URL}/api/products | jq '.'

echo ""
echo "9. Testing Pagination"
echo "-------------------"
curl -s -H "x-api-key: ${API_KEY}" "${BASE_URL}/api/products?page=1&limit=2" | jq '.'

echo ""
echo "✅ API Testing Complete!"
echo ""
echo "📝 Note: Make sure 'jq' is installed for pretty JSON formatting"
echo "   If not available, remove '| jq \".\"' from the commands above"
