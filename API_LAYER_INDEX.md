# API Layer Documentation Index

## Quick Navigation

### Get Started Quickly
👉 **Start Here:** API_QUICK_REFERENCE.md (5-10 min)

### For Complete Understanding
- AXIOS_API_SETUP.md (15-20 min)
- AXIOS_COMPLETE.txt (5 min summary)
- AXIOS_VERIFICATION.txt (5 min verification)

---

## File Structure

```
src/api/
├── axiosInstance.ts      ← Core Axios configuration
├── authApi.ts            ← Authentication endpoints
├── productApi.ts         ← Product endpoints
├── cartApi.ts            ← Cart endpoints
└── orderApi.ts           ← Order endpoints

Root Config:
├── .env                  ← API configuration (NEVER commit)
├── .env.example          ← Reference configuration
└── .gitignore            ← Updated to exclude .env
```

---

## What's Implemented

### ✅ Axios Instance
- Base URL from environment variable (VITE_API_BASE_URL)
- Timeout configuration (VITE_API_TIMEOUT)
- Request interceptor (JWT token auto-attachment)
- Response interceptor (error handling)
- 401 Unauthorized handler (token cleanup)
- Consistent error response format

### ✅ API Services
- **Auth API:** 7 methods (login, register, password reset, etc.)
- **Product API:** 10 methods (CRUD, search, filters, reviews)
- **Cart API:** 6 methods (get, add, update, remove, clear, validate)
- **Order API:** 8 methods (create, get, update status, payment)

### ✅ Configuration
- Environment variables (.env, .env.example)
- .gitignore updated
- TypeScript types throughout

### ❌ NOT Implemented (As Requested)
- Token refresh logic (ready to add in future)

---

## Environment Setup

1. **Create .env file from .env.example:**
```bash
cp .env.example .env
```

2. **Configure for your environment:**
```env
VITE_API_BASE_URL=http://localhost:8000/api
VITE_API_TIMEOUT=30000
```

3. **For production, create .env.production:**
```env
VITE_API_BASE_URL=https://api.yourdomain.com
VITE_API_TIMEOUT=30000
```

---

## Quick Usage Examples

### Import Services
```typescript
import * as authApi from '@/api/authApi';
import * as productApi from '@/api/productApi';
```

### Call API Methods
```typescript
// Login
const response = await authApi.loginUser(email, password);

// Get products
const products = await productApi.getAllProducts(1, 12);

// Add to cart
await cartApi.addToCart(productId, quantity);
```

### Error Handling
```typescript
try {
  const response = await authApi.loginUser(email, password);
} catch (error) {
  console.error(error.status);    // HTTP status
  console.error(error.message);   // Error message
  console.error(error.data);      // Additional data
}
```

---

## API Services Summary

### Auth API
- `loginUser(email, password)`
- `registerUser(name, email, password, confirmPassword)`
- `logoutUser()`
- `forgotPassword(email)`
- `resetPassword(token, newPassword, confirmPassword)`
- `verifyToken()`
- `refreshToken(refreshToken)`

### Product API
- `getAllProducts(page, limit, search, category, minPrice, maxPrice, sort)`
- `getProductById(id)`
- `searchProducts(query, filters)`
- `getProductsByCategory(categoryId, page, limit)`
- `getCategories()`
- `createProduct(productData)` ← Admin
- `updateProduct(id, productData)` ← Admin
- `deleteProduct(id)` ← Admin
- `rateProduct(id, rating)`
- `addProductReview(id, reviewData)`

### Cart API
- `getCart()`
- `addToCart(productId, quantity)`
- `updateCartItem(itemId, quantity)`
- `removeFromCart(itemId)`
- `clearCart()`
- `validateCart()`

### Order API
- `createOrder(orderData)`
- `getOrders(page, limit, status)`
- `getOrderById(id)`
- `getOrderHistory(page, limit)`
- `updateOrderStatus(id, status)` ← Admin
- `cancelOrder(id, reason)`
- `processPayment(id, paymentData)`
- `getPaymentMethods()`

---

## Integration Patterns

### With Redux Async Thunks
```typescript
const fetchProducts = createAsyncThunk(
  'product/fetch',
  async (_, { rejectWithValue }) => {
    try {
      return await productApi.getAllProducts();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
```

### In Components with Hooks
```typescript
const [products, setProducts] = useState([]);
const [loading, setLoading] = useState(false);

useEffect(() => {
  setLoading(true);
  productApi.getAllProducts()
    .then(setProducts)
    .catch(console.error)
    .finally(() => setLoading(false));
}, []);
```

---

## Token Management

### How It Works
1. User logs in → receives accessToken & refreshToken
2. accessToken stored in localStorage
3. Every request → token auto-attached in Authorization header
4. 401 Unauthorized → tokens cleared automatically
5. Token refresh logic → to be implemented

### Token Flow
```
Login → Get Token → Store Token → 
Auto-Attach to Requests → Handle 401
```

---

## Error Response Format

All API errors follow this format:
```typescript
{
  status: number,      // HTTP status code (400, 401, 404, 500, etc.)
  message: string,     // Error description
  data: any | null     // Additional error data
}
```

### Status Code Handling
| Status | Meaning | Handling |
|--------|---------|----------|
| 400 | Bad Request | User input error |
| 401 | Unauthorized | Token expired/invalid → clear & redirect |
| 403 | Forbidden | Permission denied |
| 404 | Not Found | Resource doesn't exist |
| 500-504 | Server Error | Retry or show message |
| 0 | Network Error | Connection issue |

---

## Common Scenarios

### Login Flow
```typescript
// 1. Call login API
const response = await authApi.loginUser(email, password);

// 2. Store tokens
localStorage.setItem('accessToken', response.accessToken);
sessionStorage.setItem('refreshToken', response.refreshToken);

// 3. Tokens auto-attached to all future requests
```

### Product Fetch with Filters
```typescript
const products = await productApi.getAllProducts(
  1,              // page
  12,             // limit per page
  'laptop',       // search query
  'electronics',  // category
  100,            // min price
  5000            // max price
);
```

### Cart Operations
```typescript
// Add item
await cartApi.addToCart('product-id', 2);

// Update quantity
await cartApi.updateCartItem('cart-item-id', 5);

// Remove item
await cartApi.removeFromCart('cart-item-id');

// Get cart
const cart = await cartApi.getCart();
```

### Order Creation
```typescript
const order = await orderApi.createOrder({
  items: [{ productId: 'prod-1', quantity: 2 }],
  shippingAddressId: 'addr-123',
  paymentMethod: 'credit_card',
  notes: 'Handle with care'
});
```

---

## Debugging

### Enable Detailed Logging
Add this to axiosInstance.ts request interceptor:
```typescript
console.log('API Request:', {
  method: config.method,
  url: config.url,
  headers: config.headers
});
```

### Check Token
```typescript
const token = localStorage.getItem('accessToken');
console.log('Current token:', token);
```

### Verify Requests
Open browser DevTools → Network tab to see:
- Request headers (Authorization)
- Response status
- Response data

---

## Next Steps

1. **Implement Redux Async Thunks** - Use these API services
2. **Create Login Page** - Use auth API
3. **Implement Loading States** - Show spinners
4. **Add Error Handling** - Display error messages
5. **Create Product Pages** - Use product API
6. **Implement Cart Flow** - Use cart API
7. **Implement Checkout** - Use order API
8. **Add Token Refresh** - Implement in 401 handler

---

## Documentation Files

| File | Purpose | Read Time |
|------|---------|-----------|
| API_QUICK_REFERENCE.md | Quick usage guide | 5-10 min |
| AXIOS_API_SETUP.md | Complete setup guide | 15-20 min |
| AXIOS_COMPLETE.txt | Summary of delivery | 5 min |
| AXIOS_VERIFICATION.txt | Verification report | 5 min |
| API_LAYER_INDEX.md | This file | 10 min |

---

## Support & Questions

- **Where to add API services?** → src/api/ directory
- **How to handle errors?** → Use try/catch or .catch()
- **How are tokens managed?** → Auto-attached to all requests
- **Where to implement refresh?** → 401 handler in axiosInstance
- **How to add new API endpoints?** → Create service method in appropriate file

---

**Status:** ✅ Complete and Production-Ready  
**Last Updated:** February 25, 2026  

Start with API_QUICK_REFERENCE.md for immediate usage!

