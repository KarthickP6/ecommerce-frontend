# Spring Boot Backend Implementation - Complete Endpoint Guide

## 📋 Frontend Endpoint Analysis

Based on frontend API analysis, here are all the endpoints that need to be implemented in Spring Boot:

---

## 🔐 **AUTH ENDPOINTS**

### POST /auth/login
```json
Request:
{
  "email": "user@example.com",
  "password": "password123"
}

Response:
{
  "success": true,
  "message": "Login successful",
  "data": {
    "accessToken": "jwt_token",
    "refreshToken": "refresh_token",
    "user": {
      "id": "uuid",
      "name": "John Doe",
      "email": "user@example.com",
      "role": "USER"
    }
  }
}
```

### POST /auth/register
```json
Request:
{
  "name": "John Doe",
  "email": "user@example.com",
  "password": "password123",
  "confirmPassword": "password123"
}

Response:
{
  "success": true,
  "message": "Registration successful",
  "data": {
    "accessToken": "jwt_token",
    "refreshToken": "refresh_token",
    "user": {...}
  }
}
```

### POST /auth/logout
Request: Empty (JWT from header)
Response: { "success": true, "message": "Logout successful" }

### POST /auth/refresh-token
```json
Request:
{
  "refreshToken": "refresh_token"
}

Response:
{
  "success": true,
  "data": {
    "accessToken": "new_jwt_token"
  }
}
```

### POST /auth/forgot-password
```json
Request:
{
  "email": "user@example.com"
}

Response:
{
  "success": true,
  "message": "Password reset link sent to email"
}
```

### POST /auth/reset-password
```json
Request:
{
  "token": "reset_token",
  "newPassword": "newpassword123",
  "confirmPassword": "newpassword123"
}

Response:
{
  "success": true,
  "message": "Password reset successful"
}
```

### GET /auth/verify-token
Response: { "success": true, "message": "Token is valid" }

---

## 📦 **PRODUCT ENDPOINTS**

### GET /products
```
Query Parameters:
- page=1
- limit=12
- search=sofa
- category=living-room
- minPrice=100
- maxPrice=5000
- sort=newest (or oldest, price-asc, price-desc, rating)

Response:
{
  "success": true,
  "data": {
    "products": [...],
    "pagination": {
      "currentPage": 1,
      "totalPages": 5,
      "totalItems": 60,
      "itemsPerPage": 12
    }
  }
}
```

### GET /products/:id
Response: { "success": true, "data": { product object } }

### GET /products/search
```
Query Parameters:
- q=sofa
- filters=...

Response: { "success": true, "data": { "products": [...] } }
```

### GET /categories
Response: { "success": true, "data": { "categories": [...] } }

### GET /products/category/:categoryId
```
Query Parameters:
- page=1
- limit=12

Response: { paginated products }
```

### POST /products (Admin Only)
```json
Request: FormData with:
- name
- description
- price
- categoryId
- stock
- images (multipart)

Response: { "success": true, "data": { created product } }
```

### PUT /products/:id (Admin Only)
FormData with updated fields
Response: { updated product }

### DELETE /products/:id (Admin Only)
Response: { "success": true, "message": "Product deleted" }

### POST /products/:id/rate
```json
Request:
{
  "rating": 4
}

Response:
{
  "success": true,
  "data": { "averageRating": 4.2 }
}
```

### POST /products/:id/reviews
```json
Request:
{
  "title": "Great product",
  "comment": "Very comfortable",
  "rating": 5
}

Response: { "success": true, "data": { review object } }
```

---

## 🛒 **CART ENDPOINTS**

### GET /cart
Response:
```json
{
  "success": true,
  "data": {
    "cartId": "uuid",
    "items": [
      {
        "cartItemId": "uuid",
        "productId": "uuid",
        "productName": "Sofa",
        "price": 1500,
        "quantity": 2,
        "totalPrice": 3000
      }
    ],
    "subtotal": 3000,
    "tax": 300,
    "total": 3300
  }
}
```

### POST /cart/items
```json
Request:
{
  "productId": "uuid",
  "quantity": 2
}

Response: { updated cart object }
```

### PUT /cart/items/:itemId
```json
Request:
{
  "quantity": 3
}

Response: { updated cart object }
```

### DELETE /cart/items/:itemId
Response: { updated cart object }

### POST /cart/clear
Response: { "success": true, "message": "Cart cleared" }

### POST /cart/validate
Response:
```json
{
  "success": true,
  "data": {
    "isValid": true,
    "invalidItems": []
  }
}
```

---

## 📦 **ORDER ENDPOINTS**

### POST /orders
```json
Request:
{
  "items": [
    {
      "productId": "uuid",
      "quantity": 2
    }
  ],
  "shippingAddressId": "uuid",
  "paymentMethod": "credit_card",
  "notes": "Optional delivery notes"
}

Response:
{
  "success": true,
  "data": {
    "orderId": "uuid",
    "orderNumber": "ORD-2024-001",
    "status": "pending",
    "total": 3300,
    "createdAt": "2024-02-25T..."
  }
}
```

### GET /orders
```
Query Parameters:
- page=1
- limit=10
- status=pending (pending, processing, shipped, delivered, cancelled)

Response:
{
  "success": true,
  "data": {
    "orders": [...],
    "pagination": {...}
  }
}
```

### GET /orders/:id
Response: { "success": true, "data": { complete order details } }

### GET /orders/user/history
```
Query Parameters:
- page=1
- limit=10

Response: { paginated orders }
```

### PUT /orders/:id/status (Admin Only)
```json
Request:
{
  "status": "shipped"
}

Response: { updated order }
```

### POST /orders/:id/cancel
```json
Request:
{
  "reason": "Changed my mind"
}

Response:
{
  "success": true,
  "data": { updated order with cancelled status }
}
```

### POST /orders/:id/payment
```json
Request:
{
  "paymentMethod": "credit_card",
  "amount": 3300
}

Response:
{
  "success": true,
  "data": {
    "paymentId": "uuid",
    "status": "completed"
  }
}
```

### GET /payment-methods
Response:
```json
{
  "success": true,
  "data": {
    "paymentMethods": [
      "credit_card",
      "debit_card",
      "bank_transfer",
      "upi"
    ]
  }
}
```

---

## 👤 **USER ENDPOINTS**

### GET /users/profile
Response: { current logged-in user data }

### PUT /users/profile
```json
Request:
{
  "name": "Updated Name",
  "phone": "+1234567890"
}

Response: { updated user }
```

### POST /users/addresses
```json
Request:
{
  "type": "home",
  "street": "123 Main St",
  "city": "New York",
  "state": "NY",
  "zipCode": "10001",
  "country": "USA",
  "isDefault": true
}

Response: { created address }
```

### GET /users/addresses
Response: { list of user addresses }

### PUT /users/addresses/:id
Request: Updated address fields
Response: { updated address }

### DELETE /users/addresses/:id
Response: { "success": true, "message": "Address deleted" }

### GET /users/wishlist
Response: { wishlist items }

### POST /users/wishlist
```json
Request:
{
  "productId": "uuid"
}

Response: { updated wishlist }
```

### DELETE /users/wishlist/:productId
Response: { updated wishlist }

---

## 👨‍💼 **ADMIN ENDPOINTS**

### GET /admin/dashboard
Response:
```json
{
  "success": true,
  "data": {
    "totalUsers": 1000,
    "totalOrders": 5000,
    "totalRevenue": 500000,
    "pendingOrders": 50,
    "chartData": {...}
  }
}
```

### GET /admin/users
```
Query Parameters:
- page=1
- limit=20
- search=name
- status=active

Response: { paginated users }
```

### PUT /admin/users/:id/block
```json
Request:
{
  "blocked": true,
  "reason": "Suspicious activity"
}

Response: { updated user }
```

### GET /admin/orders
```
Query Parameters:
- page=1
- limit=20
- status=pending
- dateFrom=2024-01-01
- dateTo=2024-02-25

Response: { paginated orders }
```

### GET /admin/analytics/sales
```
Query Parameters:
- period=monthly (daily, weekly, monthly, yearly)
- from=2024-01-01
- to=2024-02-25

Response:
{
  "success": true,
  "data": {
    "totalSales": 500000,
    "totalOrders": 5000,
    "chartData": {...},
    "topProducts": [...]
  }
}
```

---

## 📊 Summary of All Endpoints

**Total: 50+ Endpoints**

| Module | Count | Methods |
|--------|-------|---------|
| Authentication | 7 | POST, GET |
| Products | 8 | GET, POST, PUT, DELETE |
| Cart | 6 | GET, POST, PUT, DELETE |
| Orders | 8 | GET, POST, PUT |
| Users | 8 | GET, POST, PUT, DELETE |
| Admin | 5 | GET, PUT |
| **Total** | **42** | - |

---

## 🛠️ Implementation Phases

1. **Phase 1**: Auth endpoints
2. **Phase 2**: Product & Category endpoints
3. **Phase 3**: Cart endpoints
4. **Phase 4**: Order endpoints
5. **Phase 5**: User endpoints
6. **Phase 6**: Admin endpoints


