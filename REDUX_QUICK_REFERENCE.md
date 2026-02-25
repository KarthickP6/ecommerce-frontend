# Redux Usage Quick Reference

## Redux Store Structure

```typescript
{
  auth: {
    isAuthenticated: boolean;
    user: User | null;
    accessToken: string | null;
    loading: boolean;
    error: string | null;
  },
  user: {
    profile: { phone?, dateOfBirth?, addresses[] } | null;
    loading: boolean;
    error: string | null;
  },
  product: {
    products: Product[];
    selectedProduct: Product | null;
    filters: { search, category, priceMin, priceMax, rating };
    pagination: { page, limit, total };
    loading: boolean;
    error: string | null;
  },
  cart: {
    items: CartItem[];
    total: number;
    itemCount: number;
    loading: boolean;
    error: string | null;
  },
  order: {
    orders: Order[];
    selectedOrder: Order | null;
    currentOrder: Partial<Order> | null;
    loading: boolean;
    error: string | null;
  },
  admin: {
    analytics: Analytics | null;
    selectedUserId: string | null;
    selectedProductId: string | null;
    filters: { dateRange, status };
    loading: boolean;
    error: string | null;
  }
}
```

## Basic Usage in Components

### Import Hooks
```typescript
import { useSelector, useDispatch } from 'react-redux';
import type { RootState, AppDispatch } from '@/app/store';
import { loginSuccess, logout } from '@/features/auth';
```

### Read State
```typescript
const user = useSelector((state: RootState) => state.auth.user);
const isLoading = useSelector((state: RootState) => state.auth.loading);
const error = useSelector((state: RootState) => state.auth.error);
```

### Dispatch Actions
```typescript
const dispatch = useDispatch<AppDispatch>();

// Login
dispatch(loginSuccess({
  user: { id: '1', email: 'user@example.com', name: 'John', role: 'user' },
  accessToken: 'token'
}));

// Logout
dispatch(logout());

// Set loading
dispatch(setLoading(true));

// Clear error
dispatch(clearError());
```

## Auth Slice Actions

```typescript
// From features/auth/authSlice
import {
  setLoading,
  loginSuccess,
  loginFailure,
  logout,
  setAccessToken,
  clearError,
  restoreAuth,
} from '@/features/auth';
```

## User Slice Actions

```typescript
// From features/user/userSlice
import {
  setLoading,
  setProfile,
  setError,
  addAddress,
  updateAddress,
  deleteAddress,
  clearProfile,
} from '@/features/user';
```

## Product Slice Actions

```typescript
// From features/product/productSlice
import {
  setLoading,
  setProducts,
  setSelectedProduct,
  setError,
  setFilters,
  setPagination,
  resetFilters,
  clearError,
} from '@/features/product';
```

## Cart Slice Actions

```typescript
// From features/cart/cartSlice
import {
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
  setLoading,
  setError,
  clearError,
} from '@/features/cart';
```

## Order Slice Actions

```typescript
// From features/order/orderSlice
import {
  setLoading,
  setOrders,
  setSelectedOrder,
  createOrderStart,
  createOrderSuccess,
  createOrderFailure,
  updateOrderStatus,
  setError,
  clearError,
  clearCurrentOrder,
} from '@/features/order';
```

## Admin Slice Actions

```typescript
// From features/admin/adminSlice
import {
  setLoading,
  setAnalytics,
  setSelectedUserId,
  setSelectedProductId,
  setFilters,
  resetFilters,
  setError,
  clearError,
  clearSelectedItems,
} from '@/features/admin';
```

## Common Patterns

### Check Authentication
```typescript
const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);

if (!isAuthenticated) {
  return <Navigate to="/login" replace />;
}
```

### Check User Role
```typescript
const userRole = useSelector((state: RootState) => state.auth.user?.role);

if (userRole !== 'admin') {
  return <Navigate to="/" replace />;
}
```

### Get User Data
```typescript
const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);

return (
  <div>
    {isAuthenticated && <p>Welcome, {user?.name}</p>}
  </div>
);
```

### Handle Loading State
```typescript
const { products, loading, error } = useSelector((state: RootState) => state.product);

if (loading) return <Spinner />;
if (error) return <Error message={error} />;

return <ProductList products={products} />;
```

### Update Cart
```typescript
const dispatch = useDispatch<AppDispatch>();

const handleAddToCart = (product: Product) => {
  dispatch(addToCart({ product, quantity: 1 }));
};

const handleRemoveFromCart = (productId: string) => {
  dispatch(removeFromCart(productId));
};

const handleUpdateQuantity = (productId: string, quantity: number) => {
  dispatch(updateQuantity({ productId, quantity }));
};
```

### Get Cart Info
```typescript
const { items, total, itemCount } = useSelector((state: RootState) => state.cart);

return (
  <div>
    <p>Items: {itemCount}</p>
    <p>Total: ${total.toFixed(2)}</p>
  </div>
);
```

## Next Steps

1. Import required actions in your components
2. Use useSelector to read state
3. Use useDispatch to dispatch actions
4. Handle loading and error states
5. Add async thunks when API is ready

