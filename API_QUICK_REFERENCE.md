# API Services Quick Reference

## Quick Import & Usage

### Import All API Services

```typescript
import * as authApi from '@/api/authApi';
import * as productApi from '@/api/productApi';
import * as cartApi from '@/api/cartApi';
import * as orderApi from '@/api/orderApi';
```

---

## Auth API Cheat Sheet

```typescript
// Login
const response = await authApi.loginUser('user@example.com', 'password');

// Register
const response = await authApi.registerUser('John', 'john@example.com', 'pass123', 'pass123');

// Logout
const response = await authApi.logoutUser();

// Verify token
const response = await authApi.verifyToken();

// Forgot password
const response = await authApi.forgotPassword('user@example.com');

// Reset password
const response = await authApi.resetPassword('reset_token', 'newpass', 'newpass');
```

---

## Product API Cheat Sheet

```typescript
// Get all products (with filters)
const response = await productApi.getAllProducts(
  1,                    // page
  12,                   // limit
  '',                   // search
  'electronics',        // category
  100,                  // minPrice
  5000,                 // maxPrice
  'newest'              // sort
);

// Get single product
const response = await productApi.getProductById('product-id-123');

// Search products
const response = await productApi.searchProducts('laptop');

// Get products by category
const response = await productApi.getProductsByCategory('electronics', 1, 12);

// Get all categories
const response = await productApi.getCategories();

// Rate product
const response = await productApi.rateProduct('product-id', 4.5);

// Add review
const response = await productApi.addProductReview('product-id', {
  title: 'Great product',
  comment: 'Very satisfied with this purchase',
  rating: 5
});

// Admin: Create product
const formData = new FormData();
formData.append('name', 'Product Name');
formData.append('image', fileInput.files[0]);
const response = await productApi.createProduct(formData);

// Admin: Update product
const response = await productApi.updateProduct('product-id', formData);

// Admin: Delete product
const response = await productApi.deleteProduct('product-id');
```

---

## Cart API Cheat Sheet

```typescript
// Get cart
const response = await cartApi.getCart();

// Add to cart
const response = await cartApi.addToCart('product-id', 2);

// Update quantity
const response = await cartApi.updateCartItem('cart-item-id', 3);

// Remove from cart
const response = await cartApi.removeFromCart('cart-item-id');

// Clear entire cart
const response = await cartApi.clearCart();

// Validate cart before checkout
const response = await cartApi.validateCart();
```

---

## Order API Cheat Sheet

```typescript
// Create order
const response = await orderApi.createOrder({
  items: [
    { productId: 'prod-1', quantity: 2 },
    { productId: 'prod-2', quantity: 1 }
  ],
  shippingAddressId: 'addr-123',
  paymentMethod: 'credit_card',
  notes: 'Handle with care'
});

// Get user's orders
const response = await orderApi.getOrders(1, 10, 'pending');

// Get single order
const response = await orderApi.getOrderById('order-id-123');

// Get order history
const response = await orderApi.getOrderHistory(1, 10);

// Admin: Update order status
const response = await orderApi.updateOrderStatus('order-id', 'shipped');

// Cancel order
const response = await orderApi.cancelOrder('order-id', 'Changed my mind');

// Process payment
const response = await orderApi.processPayment('order-id', {
  method: 'credit_card',
  cardDetails: { /* card info */ },
  transactionId: 'txn-123'
});

// Get payment methods
const response = await orderApi.getPaymentMethods();
```

---

## Error Handling

```typescript
try {
  const response = await productApi.getAllProducts();
  console.log('Success:', response);
} catch (error) {
  // Error is already formatted
  console.error('Status:', error.status);
  console.error('Message:', error.message);
  console.error('Data:', error.data);
  
  // Handle specific statuses
  if (error.status === 401) {
    // Redirect to login
  } else if (error.status === 403) {
    // Show permission error
  }
}
```

---

## Using with Redux Thunks

```typescript
import { createAsyncThunk } from '@reduxjs/toolkit';
import * as productApi from '@/api/productApi';

export const fetchProducts = createAsyncThunk(
  'product/fetchProducts',
  async (
    { page = 1, limit = 12, search = '' } = {},
    { rejectWithValue }
  ) => {
    try {
      const response = await productApi.getAllProducts(page, limit, search);
      return response; // response already contains data (not nested in .data)
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
```

---

## Using in Components with Async/Await

```typescript
import { useEffect, useState } from 'react';
import * as productApi from '@/api/productApi';

function ProductPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      try {
        const data = await productApi.getAllProducts();
        setProducts(data.products || []);
        setError(null);
      } catch (err) {
        setError(err.message);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  
  return (
    <div>
      {products.map(product => (
        <div key={product.id}>{product.name}</div>
      ))}
    </div>
  );
}
```

---

## Using with Redux Hooks

```typescript
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '@/features/product/productSlice';
import type { RootState } from '@/app/store';

function ProductList() {
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector(
    (state: RootState) => state.product
  );

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {products.map(product => (
        <div key={product.id}>{product.name}</div>
      ))}
    </div>
  );
}
```

---

## Response Format

All successful API responses return the data directly:

```typescript
// Single item
{
  id: 'prod-123',
  name: 'Product Name',
  price: 99.99,
  // ...
}

// List with pagination
{
  products: [/* array of products */],
  pagination: {
    page: 1,
    limit: 12,
    total: 50,
    pages: 5
  }
}

// Error
{
  status: 400,
  message: 'Bad Request',
  data: null
}
```

---

## Common Patterns

### Fetch & Cache in Redux

```typescript
const productSlice = createSlice({
  name: 'product',
  initialState: {
    products: [],
    loading: false,
    error: null,
    fetched: false
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.products = action.payload.products;
        state.loading = false;
        state.fetched = true;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      });
  }
});
```

### Invalidate Cache After Mutation

```typescript
const deleteProduct = createAsyncThunk(
  'product/delete',
  async (id, { rejectWithValue, dispatch }) => {
    try {
      await productApi.deleteProduct(id);
      // Refetch products after delete
      dispatch(fetchProducts());
      return id;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
```

---

## Environment Setup

Create `.env` file in project root:

```env
VITE_API_BASE_URL=http://localhost:8000/api
VITE_API_TIMEOUT=30000
```

For production in `.env.production`:

```env
VITE_API_BASE_URL=https://api.yourdomain.com
VITE_API_TIMEOUT=30000
```

---

## Debugging

Enable detailed logging:

```typescript
// In axiosInstance.ts request interceptor
console.log('API Request:', {
  method: config.method,
  url: config.url,
  headers: config.headers,
  data: config.data
});

// In response interceptor
console.log('API Response:', response);
```

---

## Status Codes Handled

| Code | Handling |
|------|----------|
| 2xx | Success - return data |
| 400 | Bad request - user error |
| 401 | Unauthorized - tokens cleared |
| 403 | Forbidden - no permission |
| 404 | Not found - item doesn't exist |
| 5xx | Server error - retry or show message |
| Network | Connection error - offline handling |

---

**Ready to use in components and Redux thunks!**

