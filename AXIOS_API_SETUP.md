# Axios Configuration & API Services

## Overview

This document describes the Axios instance and API service layer for the e-commerce frontend.

---

## Axios Instance Configuration

**File:** `src/api/axiosInstance.ts`

### Features

✅ **Environment Variable Configuration**
- Base URL from `VITE_API_BASE_URL`
- Timeout from `VITE_API_TIMEOUT`
- Default timeout: 30 seconds

✅ **Request Interceptor**
- Automatically attaches JWT token to all requests
- Retrieves token from localStorage or sessionStorage
- Adds `Authorization: Bearer {token}` header

✅ **Response Interceptor**
- Handles successful responses
- Global error handling
- Status code specific error handling
- 401 Unauthorized handling (token cleanup)
- Consistent error response format

### Error Handling

The response interceptor handles:

| Status | Action |
|--------|--------|
| 400 | Bad Request |
| 401 | Unauthorized (clears tokens) |
| 403 | Forbidden |
| 404 | Not Found |
| 500-504 | Server Errors |
| Network | Connection Error |

---

## Environment Variables

**File:** `.env` (create from `.env.example`)

```env
VITE_API_BASE_URL=http://localhost:8000/api
VITE_API_TIMEOUT=30000
```

**Note:** In production, update `VITE_API_BASE_URL` to your production API endpoint.

---

## API Services

### 1. Authentication API

**File:** `src/api/authApi.ts`

**Available Methods:**

```typescript
// Login
loginUser(email: string, password: string)

// Register
registerUser(name: string, email: string, password: string, confirmPassword: string)

// Logout
logoutUser()

// Refresh Token (for future implementation)
refreshToken(refreshToken: string)

// Forgot Password
forgotPassword(email: string)

// Reset Password
resetPassword(token: string, newPassword: string, confirmPassword: string)

// Verify Token
verifyToken()
```

**Endpoints:**
- POST `/auth/login`
- POST `/auth/register`
- POST `/auth/logout`
- POST `/auth/refresh-token`
- POST `/auth/forgot-password`
- POST `/auth/reset-password`
- GET `/auth/verify-token`

---

### 2. Product API

**File:** `src/api/productApi.ts`

**Available Methods:**

```typescript
// Get all products with filters
getAllProducts(page?, limit?, search?, category?, minPrice?, maxPrice?, sort?)

// Get single product
getProductById(id: string)

// Search products
searchProducts(query: string, filters?: object)

// Get products by category
getProductsByCategory(categoryId: string, page?, limit?)

// Get all categories
getCategories()

// Create product (Admin)
createProduct(productData: FormData)

// Update product (Admin)
updateProduct(id: string, productData: FormData)

// Delete product (Admin)
deleteProduct(id: string)

// Rate product
rateProduct(id: string, rating: number)

// Add review
addProductReview(id: string, reviewData: {title, comment, rating})
```

**Endpoints:**
- GET `/products`
- GET `/products/:id`
- GET `/products/search?q=...`
- GET `/products/category/:categoryId`
- GET `/categories`
- POST `/products` (Admin)
- PUT `/products/:id` (Admin)
- DELETE `/products/:id` (Admin)
- POST `/products/:id/rate`
- POST `/products/:id/reviews`

---

### 3. Cart API

**File:** `src/api/cartApi.ts`

**Available Methods:**

```typescript
// Get cart
getCart()

// Add item to cart
addToCart(productId: string, quantity: number)

// Update item quantity
updateCartItem(itemId: string, quantity: number)

// Remove item from cart
removeFromCart(itemId: string)

// Clear entire cart
clearCart()

// Validate cart before checkout
validateCart()
```

**Endpoints:**
- GET `/cart`
- POST `/cart/items`
- PUT `/cart/items/:itemId`
- DELETE `/cart/items/:itemId`
- POST `/cart/clear`
- POST `/cart/validate`

---

### 4. Order API

**File:** `src/api/orderApi.ts`

**Available Methods:**

```typescript
// Create order
createOrder(orderData: {items, shippingAddressId, paymentMethod, notes?})

// Get orders
getOrders(page?, limit?, status?)

// Get single order
getOrderById(id: string)

// Get order history
getOrderHistory(page?, limit?)

// Update order status (Admin)
updateOrderStatus(id: string, status: 'pending'|'processing'|'shipped'|'delivered'|'cancelled')

// Cancel order
cancelOrder(id: string, reason?: string)

// Process payment
processPayment(id: string, paymentData: {method, cardDetails?, transactionId?})

// Get payment methods
getPaymentMethods()
```

**Endpoints:**
- POST `/orders`
- GET `/orders`
- GET `/orders/:id`
- PUT `/orders/:id/status` (Admin)
- POST `/orders/:id/cancel`
- GET `/orders/user/history`
- POST `/orders/:id/payment`
- GET `/payment-methods`

---

## Usage Examples

### Using in Redux Thunk (Async Action)

```typescript
import { createAsyncThunk } from '@reduxjs/toolkit';
import * as authApi from '@/api/authApi';

export const loginAsync = createAsyncThunk(
  'auth/loginAsync',
  async (credentials: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await authApi.loginUser(credentials.email, credentials.password);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);
```

### Using in Components

```typescript
import { useDispatch, useSelector } from 'react-redux';
import * as productApi from '@/api/productApi';
import { useEffect, useState } from 'react';

function ProductList() {
  const dispatch = useDispatch();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const data = await productApi.getAllProducts(1, 12);
        setProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) return <div>Loading...</div>;
  return <div>{/* render products */}</div>;
}
```

---

## Token Management

### How It Works

1. **Login**: User credentials are sent to backend
2. **Response**: Backend returns `accessToken` and `refreshToken`
3. **Storage**: 
   - `accessToken` → localStorage (short-lived)
   - `refreshToken` → sessionStorage or secure storage

4. **Request**: Token is automatically attached to all requests
5. **401 Response**: Tokens are cleared (refresh logic to be implemented)

### Token Storage

```typescript
// After successful login
localStorage.setItem('accessToken', response.accessToken);
sessionStorage.setItem('refreshToken', response.refreshToken);

// On 401 error, tokens are cleared automatically
```

---

## Error Response Format

All API services return errors in consistent format:

```typescript
{
  status: number,        // HTTP status code
  message: string,       // Error message
  data: any | null       // Additional error data
}
```

---

## TODO: Token Refresh Logic

The following needs to be implemented in the axios interceptor's 401 handler:

```typescript
// When 401 Unauthorized is received:
// 1. Get refresh token from storage
// 2. Call refreshToken endpoint
// 3. Update access token in storage
// 4. Retry original request
// 5. If refresh fails, redirect to login
```

---

## API Integration Checklist

- [x] Axios instance configured
- [x] Environment variables setup
- [x] Request interceptor (token attachment)
- [x] Response interceptor (error handling)
- [x] Auth API service
- [x] Product API service
- [x] Cart API service
- [x] Order API service
- [ ] Token refresh logic (to implement)
- [ ] Redux async thunks (to implement)
- [ ] Component integration (to implement)

---

## Next Steps

1. **Implement Redux Async Thunks** - Connect API calls to Redux
2. **Implement Token Refresh** - Auto-refresh expired tokens
3. **Create Login Page** - Use auth API
4. **Create Product Pages** - Use product API
5. **Implement Cart Flow** - Use cart API
6. **Implement Order Flow** - Use order API

---

**Status:** ✅ Axios & API Services Ready  
**Date:** February 25, 2026

