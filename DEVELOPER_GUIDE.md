# 🚀 Quick Reference Guide - React Router v6 & Redux Setup

## For Developers Working on This Project

---

## 📝 Important Files Location

```
ecommerce-frontend/src/
├── routes/
│   ├── AppRoutes.tsx        ← All route definitions
│   ├── ProtectedRoute.tsx   ← User authentication guard
│   └── AdminRoute.tsx       ← Admin role guard
│
├── app/
│   ├── store.ts             ← Redux store config
│   └── rootReducer.ts       ← Combine all reducers
│
├── features/
│   ├── auth/                ← Authentication state
│   ├── user/                ← User profile & addresses
│   ├── product/             ← Products & search
│   ├── cart/                ← Shopping cart
│   ├── order/               ← Orders & history
│   └── admin/               ← Admin dashboard
│
└── App.tsx                  ← Provider & Router setup
```

---

## 🔐 Route Protection Rules

### Public Routes (No Guards)
Access: **ANYONE**
- `/` Home
- `/products` Product listing
- `/login` Login page
- `/register` Register page

### Protected User Routes
Access: **AUTHENTICATED USERS ONLY**
```tsx
// Automatically protected by ProtectedRoute
<Route element={<ProtectedRoute />}>
  <Route path="/dashboard" element={<Dashboard />} />
  <Route path="/cart" element={<Cart />} />
</Route>
```

### Protected Admin Routes
Access: **AUTHENTICATED + ADMIN ROLE ONLY**
```tsx
// Automatically protected by AdminRoute
<Route element={<AdminRoute />}>
  <Route path="/admin" element={<AdminDashboard />} />
  <Route path="/admin/products" element={<ManageProducts />} />
</Route>
```

---

## 📦 Using Redux in Components

### Accessing State
```tsx
import { useSelector } from 'react-redux';
import type { RootState } from '@/app/store';

function MyComponent() {
  // Type-safe state access
  const user = useSelector((state: RootState) => state.auth.user);
  const products = useSelector((state: RootState) => state.product.products);
  
  return <div>{user?.name}</div>;
}
```

### Dispatching Actions
```tsx
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '@/app/store';
import { loginSuccess, logout } from '@/features/auth/authSlice';

function LoginForm() {
  const dispatch = useDispatch<AppDispatch>();
  
  const handleLogin = () => {
    // Dispatch with proper typing
    dispatch(loginSuccess({ 
      user: { id: '1', email: 'user@example.com', name: 'John', role: 'user' },
      accessToken: 'token_here'
    }));
  };
  
  return <button onClick={handleLogin}>Login</button>;
}
```

---

## 🛣️ Adding a New Route

### Step 1: Create Page Component
```tsx
// src/pages/public/NewPage.tsx
export const NewPage = () => {
  return <div><h1>New Page</h1></div>;
};
```

### Step 2: Add Route in AppRoutes.tsx
```tsx
import { NewPage } from '@/pages/public/NewPage';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Add your route */}
      <Route path="/new-page" element={<NewPage />} />
      
      {/* Or if protected */}
      <Route element={<ProtectedRoute />}>
        <Route path="/user-new-page" element={<NewPage />} />
      </Route>
    </Routes>
  );
};
```

---

## 🎯 Adding a New Redux Slice

### Step 1: Create Slice File
```tsx
// src/features/reviews/reviewSlice.ts
import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

interface ReviewState {
  reviews: Review[];
  loading: boolean;
  error: string | null;
}

const initialState: ReviewState = {
  reviews: [],
  loading: false,
  error: null,
};

const reviewSlice = createSlice({
  name: 'review',
  initialState,
  reducers: {
    setReviews: (state, action: PayloadAction<Review[]>) => {
      state.reviews = action.payload;
    },
    // ... more reducers
  },
});

export const { setReviews } = reviewSlice.actions;
export default reviewSlice.reducer;
```

### Step 2: Create Index File
```tsx
// src/features/reviews/index.ts
export * from './reviewSlice';
export { default as reviewReducer } from './reviewSlice';
```

### Step 3: Update Root Reducer
```tsx
// src/app/rootReducer.ts
import { reviewReducer } from '../features/reviews';

export const rootReducer = combineReducers({
  // ...existing slices...
  review: reviewReducer, // Add new slice
});
```

---

## 🔄 Redux Action Patterns

### Simple Synchronous Action
```tsx
const cartSlice = createSlice({
  reducers: {
    addToCart: (state, action: PayloadAction<CartItem>) => {
      state.items.push(action.payload);
    },
  },
});
```

### Action with Payload
```tsx
const productSlice = createSlice({
  reducers: {
    setFilters: (state, action: PayloadAction<Partial<Filters>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
  },
});

// Usage
dispatch(setFilters({ category: 'electronics', priceMax: 500 }));
```

### Loading and Error Handling
```tsx
const productSlice = createSlice({
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
});
```

---

## 🔑 Key Redux Selectors

### Auth State
```tsx
const auth = useSelector((state: RootState) => state.auth);
const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
const user = useSelector((state: RootState) => state.auth.user);
const userRole = useSelector((state: RootState) => state.auth.user?.role);
```

### Cart State
```tsx
const cart = useSelector((state: RootState) => state.cart);
const cartItems = useSelector((state: RootState) => state.cart.items);
const cartTotal = useSelector((state: RootState) => state.cart.total);
```

### Product State
```tsx
const products = useSelector((state: RootState) => state.product.products);
const filters = useSelector((state: RootState) => state.product.filters);
const pagination = useSelector((state: RootState) => state.product.pagination);
```

---

## 🛡️ Route Protection Examples

### Protected User Route
```tsx
// User must be authenticated to access
<Route element={<ProtectedRoute />}>
  <Route path="/cart" element={<CartPage />} />
  <Route path="/orders" element={<OrderHistory />} />
</Route>
```

### Protected Admin Route
```tsx
// User must be authenticated AND have admin role
<Route element={<AdminRoute />}>
  <Route path="/admin/users" element={<ManageUsers />} />
  <Route path="/admin/products" element={<ManageProducts />} />
</Route>
```

### Redirect Based on Auth
```tsx
// In a component
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

function Dashboard() {
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <div>Dashboard Content</div>;
}
```

---

## 📋 State Update Checklist

When updating Redux state:

- [ ] Import `createSlice` from '@reduxjs/toolkit'
- [ ] Import `PayloadAction` as type-only import
- [ ] Define state interface
- [ ] Create initial state
- [ ] Define reducers with proper typing
- [ ] Export actions and reducer
- [ ] Add to rootReducer
- [ ] Use type-safe selectors in components
- [ ] Test with Redux DevTools

---

## 🧪 Testing Components with Redux

```tsx
import { Provider } from 'react-redux';
import store from '@/app/store';
import { render } from '@testing-library/react';

// Wrap component in Provider for testing
render(
  <Provider store={store}>
    <MyComponent />
  </Provider>
);
```

---

## 📊 Redux DevTools

Enable Redux DevTools for time-travel debugging:

1. Install Redux DevTools browser extension
2. Open component in browser
3. Open Redux DevTools (usually in developer console)
4. See all dispatched actions and state changes
5. Time-travel by clicking actions
6. Export/import action history

---

## 🚨 Common Mistakes to Avoid

❌ **Don't:** Import types without `type` keyword
```tsx
// Wrong
import { PayloadAction } from '@reduxjs/toolkit';

// Correct
import type { PayloadAction } from '@reduxjs/toolkit';
```

❌ **Don't:** Mutate state directly outside reducers
```tsx
// Wrong
state.user = newUser; // Won't work properly

// Correct (use reducer action)
dispatch(setUser(newUser));
```

❌ **Don't:** Forget to export reducer
```tsx
// Wrong - missing export
const mySlice = createSlice({...});

// Correct
export default mySlice.reducer;
```

❌ **Don't:** Direct state access without useSelector
```tsx
// Wrong
const state = store.getState(); // Causes issues

// Correct
const data = useSelector((state: RootState) => state.someSlice);
```

---

## ✅ Best Practices

✅ **Do:** Use Redux for global state only
✅ **Do:** Keep component state for UI-only data
✅ **Do:** Use type-safe selectors
✅ **Do:** Document complex selectors
✅ **Do:** Use descriptive action names
✅ **Do:** Handle loading and error states
✅ **Do:** Test redux slices separately
✅ **Do:** Use Redux DevTools for debugging

---

## 📚 Documentation Reference

- **ROUTING_SETUP.md** - Detailed routing documentation
- **IMPLEMENTATION_REPORT.md** - Full implementation details
- **ARCHITECTURE_DIAGRAM.md** - Visual architecture diagrams

---

## 🆘 Troubleshooting

### Route not working?
- Check path spelling in AppRoutes.tsx
- Verify component export
- Check nested route structure
- Clear browser cache

### Redux state not updating?
- Verify action is dispatched
- Check reducer logic
- Use Redux DevTools to see actions
- Verify state path in selector

### Type errors?
- Use `type` keyword for type-only imports
- Check RootState typing
- Verify PayloadAction generic type
- Run TypeScript compiler: `npm run build`

### Build failing?
- Run `npm run build` to check errors
- Fix TypeScript errors first
- Check import paths
- Verify all exports exist

---

## 📞 Quick Commands

```bash
# Development
npm run dev              # Start dev server

# Building
npm run build            # Production build
npm run lint             # Check code quality

# Debugging
npm run build -- --sourcemap  # Build with source maps

# Type Checking
npx tsc --noEmit        # Check types without building
```

---

**Happy Coding! 🚀**

For questions, refer to the documentation files or check the implementation comments in the code.

