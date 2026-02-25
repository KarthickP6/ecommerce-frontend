# 🗺️ Routing Architecture Diagram

## Application Flow

```
USER VISITS APP
    ↓
Browser Load: http://localhost:5173
    ↓
index.html loads React
    ↓
main.tsx renders <App />
    ↓
App.tsx
├── <Provider store={store}>          Redux State Management
│   └── <BrowserRouter>               Client-side Routing
│       └── <AppRoutes />             Route Definitions
│           ├── PUBLIC ROUTES (no guards)
│           ├── PROTECTED ROUTES (ProtectedRoute)
│           └── ADMIN ROUTES (AdminRoute)
```

---

## Route Decision Tree

```
                    ┌─────────────────────────────────┐
                    │   User navigates to route       │
                    └──────────────┬──────────────────┘
                                   ↓
                    ┌──────────────────────────────┐
                    │  Is it a public route?       │
                    │  (/,/products,/login,etc)    │
                    └──────────┬──────────────────┘
                    YES        │        NO
                    ↓          │        ↓
            ┌──────────────┐   │   ┌─────────────────────┐
            │ SHOW PAGE    │   │   │  Is it /admin*?     │
            └──────────────┘   │   │  (admin routes)     │
                               │   └─────────┬───────────┘
                               │   YES       │    NO
                               │   ↓        │    ↓
                               │ ┌──────────────────────────┐
                               │ │ AdminRoute Guard         │
                               │ │                          │
                               │ │ Check: isAuthenticated?  │
                               │ │        role == 'admin'?  │
                               │ └──────┬──────────────────┘
                               │   YES  │    NO
                               │   ↓   │    ↓
                               │ ┌──┐ │  ┌─────────────────┐
                               │ │✓ │ │  │ Redirect to /   │
                               │ │  │ │  └─────────────────┘
                               │ └──┘ │
                               │     │
                               │     └───────────────────────┐
                               │                             ↓
                               │      ┌────────────────────────────────┐
                               └──→   │ ProtectedRoute Guard           │
                                      │                                │
                                      │ Check: isAuthenticated?        │
                                      └────────┬─────────────────────┘
                                         YES   │    NO
                                         ↓    │    ↓
                                      ┌──┐   │  ┌─────────────────┐
                                      │✓ │   │  │ Redirect to     │
                                      │  │   │  │ /login          │
                                      └──┘   │  └─────────────────┘
                                             │
                                             └─→  SHOW PAGE
```

---

## Redux State Flow

```
┌──────────────────────────────────────────────────────────┐
│                   Redux Store State                      │
├──────────────────────────────────────────────────────────┤
│                                                          │
│  ┌────────────────────────────────────────────────┐     │
│  │ AUTH SLICE                                     │     │
│  │ ├─ isAuthenticated: boolean                   │     │
│  │ ├─ user: User | null                          │     │
│  │ ├─ accessToken: string | null                 │     │
│  │ ├─ loading: boolean                           │     │
│  │ └─ error: string | null                       │     │
│  └────────────────────────────────────────────────┘     │
│                          ↕                               │
│  ┌────────────────────────────────────────────────┐     │
│  │ USER SLICE                                     │     │
│  │ ├─ profile: UserProfile | null                │     │
│  │ ├─ addresses: Address[]                       │     │
│  │ ├─ loading: boolean                           │     │
│  │ └─ error: string | null                       │     │
│  └────────────────────────────────────────────────┘     │
│                          ↕                               │
│  ┌────────────────────────────────────────────────┐     │
│  │ PRODUCT SLICE                                  │     │
│  │ ├─ products: Product[]                        │     │
│  │ ├─ selectedProduct: Product | null            │     │
│  │ ├─ filters: { search, category, ... }        │     │
│  │ ├─ pagination: { page, limit, total }        │     │
│  │ ├─ loading: boolean                           │     │
│  │ └─ error: string | null                       │     │
│  └────────────────────────────────────────────────┘     │
│                          ↕                               │
│  ┌────────────────────────────────────────────────┐     │
│  │ CART SLICE                                     │     │
│  │ ├─ items: CartItem[]                          │     │
│  │ ├─ total: number                              │     │
│  │ ├─ itemCount: number                          │     │
│  │ ├─ loading: boolean                           │     │
│  │ └─ error: string | null                       │     │
│  └────────────────────────────────────────────────┘     │
│                          ↕                               │
│  ┌────────────────────────────────────────────────┐     │
│  │ ORDER SLICE                                    │     │
│  │ ├─ orders: Order[]                            │     │
│  │ ├─ selectedOrder: Order | null                │     │
│  │ ├─ currentOrder: Partial<Order> | null       │     │
│  │ ├─ loading: boolean                           │     │
│  │ └─ error: string | null                       │     │
│  └────────────────────────────────────────────────┘     │
│                          ↕                               │
│  ┌────────────────────────────────────────────────┐     │
│  │ ADMIN SLICE                                    │     │
│  │ ├─ analytics: Analytics | null                │     │
│  │ ├─ selectedUserId: string | null              │     │
│  │ ├─ selectedProductId: string | null           │     │
│  │ ├─ filters: { dateRange, status }            │     │
│  │ ├─ loading: boolean                           │     │
│  │ └─ error: string | null                       │     │
│  └────────────────────────────────────────────────┘     │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

---

## Component Hierarchy

```
<App>
  <Provider store={store}>
    <BrowserRouter>
      <AppRoutes>
        <Routes>
          {/* PUBLIC ROUTES */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          ...40+ other routes...

          {/* PROTECTED USER ROUTES */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/cart" element={<Cart />} />
            ...10+ routes...
          </Route>

          {/* PROTECTED ADMIN ROUTES */}
          <Route element={<AdminRoute />}>
            <Route path="/admin" element={<AdminDash />} />
            <Route path="/admin/products" element={<Products />} />
            ...10+ routes...
          </Route>

          {/* FALLBACK */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </AppRoutes>
    </BrowserRouter>
  </Provider>
</App>
```

---

## Authentication Flow

```
┌─────────────────────────────────────────────────────┐
│               User Login Flow                       │
└─────────────────────────────────────────────────────┘

1. User navigates to /login
   └─ LoginPage component renders

2. User enters credentials & clicks submit
   └─ dispatch(loginAction) to auth slice

3. Auth slice updates state
   ├─ setLoading(true)
   ├─ API call to backend /api/auth/login
   │  └─ Returns: { user, accessToken }
   ├─ Store in Redux + localStorage
   │  ├─ state.auth.user = user
   │  ├─ state.auth.accessToken = accessToken
   │  └─ state.auth.isAuthenticated = true
   └─ setLoading(false)

4. App redirects to /dashboard
   └─ ProtectedRoute grants access

5. Protected routes now accessible
   ├─ /dashboard ✓
   ├─ /profile ✓
   ├─ /cart ✓
   └─ etc...

6. On logout
   ├─ dispatch(logout) action
   ├─ Clear state
   │  ├─ state.auth.isAuthenticated = false
   │  ├─ state.auth.user = null
   │  └─ state.auth.accessToken = null
   ├─ Clear localStorage
   └─ Redirect to /login
```

---

## Admin Route Access Flow

```
┌─────────────────────────────────────────────────────┐
│           Admin Route Access Control                │
└─────────────────────────────────────────────────────┘

User navigates to /admin/products
    ↓
AdminRoute Guard Executes
    ├─ const { isAuthenticated, user } = useSelector(...)
    │
    ├─ Check 1: isAuthenticated?
    │  └─ NO → Navigate to /login ❌
    │
    └─ Check 2: user.role === 'admin'?
       ├─ NO → Navigate to / ❌
       └─ YES → <Outlet /> renders ✓

ADMIN CAN ACCESS:
├─ /admin
├─ /admin/users
├─ /admin/products
├─ /admin/categories
├─ /admin/orders
├─ /admin/analytics
└─ ... etc

REGULAR USER ACCESSING /admin:
├─ Passes Check 1 (authenticated)
├─ Fails Check 2 (not admin)
└─ Redirected to home page /
```

---

## File Dependencies

```
App.tsx
  ├─ imports BrowserRouter, Provider
  └─ renders AppRoutes
       │
       ├─ routes/AppRoutes.tsx
       │  ├─ imports ProtectedRoute
       │  ├─ imports AdminRoute
       │  └─ defines 40+ routes
       │
       ├─ routes/ProtectedRoute.tsx
       │  └─ imports from app/store (RootState)
       │
       ├─ routes/AdminRoute.tsx
       │  └─ imports from app/store (RootState)
       │
       └─ app/store.ts
          ├─ imports rootReducer
          │  └─ app/rootReducer.ts
          │     ├─ imports authReducer
          │     ├─ imports userReducer
          │     ├─ imports productReducer
          │     ├─ imports cartReducer
          │     ├─ imports orderReducer
          │     └─ imports adminReducer
          │
          └─ exports RootState, AppDispatch
             └─ Used in ProtectedRoute & AdminRoute
```

---

## State Update Lifecycle

```
┌──────────────────────────────────────────┐
│   Component User Interaction             │
└──────────────────────────────────────────┘
           ↓
┌──────────────────────────────────────────┐
│   useDispatch hook                       │
│   dispatch(action)                       │
└──────────────────────────────────────────┘
           ↓
┌──────────────────────────────────────────┐
│   Redux Store receives action            │
│   Reducer processes action               │
│   New state created (Immer)              │
└──────────────────────────────────────────┘
           ↓
┌──────────────────────────────────────────┐
│   useSelector detects state change       │
│   Component re-renders                   │
└──────────────────────────────────────────┘
           ↓
┌──────────────────────────────────────────┐
│   UI updates with new data               │
└──────────────────────────────────────────┘
```

---

## Type Safety Chain

```
store.ts
  ├─ export RootState
  │  └─ Represents entire Redux state shape
  │
  └─ export AppDispatch
     └─ Typed dispatch function

ProtectedRoute.tsx
  ├─ import type RootState
  ├─ useSelector((state: RootState) => ...)
  └─ Type-safe state access

Components
  ├─ import type RootState
  ├─ useSelector((state: RootState) => state.auth)
  ├─ useDispatch<AppDispatch>()
  └─ dispatch(action) ← Type-checked
```

---

## Scalability Architecture

```
CURRENT STRUCTURE (Ready for Growth)

features/
├── auth/        ← Domain 1
├── user/        ← Domain 2
├── product/     ← Domain 3
├── cart/        ← Domain 4
├── order/       ← Domain 5
└── admin/       ← Domain 6

NEW DOMAINS CAN BE ADDED:

features/
├── ...existing...
├── reviews/     ← Domain 7 (New)
│   ├── reviewSlice.ts
│   └── index.ts
├── wishlist/    ← Domain 8 (New)
│   ├── wishlistSlice.ts
│   └── index.ts
└── notifications/ ← Domain 9 (New)
    ├── notificationSlice.ts
    └── index.ts

Then update rootReducer.ts:
export const rootReducer = combineReducers({
  ...existing slices...
  reviews: reviewReducer,    ← Add new
  wishlist: wishlistReducer, ← Add new
  notifications: notificationReducer, ← Add new
});
```

---

## Performance Considerations

```
✅ Code Splitting
   - Routes loaded on demand with React.lazy()
   - Can be added to page components

✅ Redux DevTools Integration
   - Store configured for time-travel debugging
   - Easy to track state changes

✅ Serialization Checks
   - JWT tokens ignored in serialization check
   - Better performance for async actions

✅ Immer Optimization
   - Draft-based immutability
   - Automatic structural sharing
   - Better memory efficiency

✅ Selector Optimization
   - Reselect can be added for complex selectors
   - Prevents unnecessary re-renders
```

---

## Deployment Architecture

```
Development
├─ npm run dev
├─ Vite dev server at localhost:5173
├─ HMR enabled
└─ Source maps available

Production
├─ npm run build
├─ Optimized bundle
├─ Tree-shaking enabled
└─ Minified output
    ├─ HTML: 0.46 kB
    ├─ CSS: 1.55 kB (gzipped: 0.74 kB)
    └─ JS: 270.41 kB (gzipped: 85.27 kB)

Server
├─ Static file serving from /dist
├─ SPA fallback to index.html
├─ Gzip compression enabled
└─ Cache busting via hash filenames
```

---

This architecture is **production-ready** and **highly scalable**! 🚀

