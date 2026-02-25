# Authentication Module - Quick Reference

## Quick Start

### Login Page
Navigate to: `http://localhost:5173/login`

Demo Credentials:
```
Email: demo@example.com
Password: password123
```

### Register Page
Navigate to: `http://localhost:5173/register`

---

## Using Auth in Your Components

### Import useAuth Hook
```typescript
import { useAuth } from '@/hooks';
```

### Access Auth State
```typescript
const {
  isAuthenticated,    // boolean
  user,              // { id, email, name, role }
  loading,           // boolean
  error,             // string | null
  accessToken,       // string | null
  isAdmin,           // boolean (user?.role === 'admin')
  isUser,            // boolean (user?.role === 'user')
  userId,            // string (user?.id)
  userEmail,         // string (user?.email)
  userName           // string (user?.name)
} = useAuth();
```

### Example: Show User Dashboard
```typescript
import { useAuth } from '@/hooks';
import { Navigate } from 'react-router-dom';

function Dashboard() {
  const { isAuthenticated, userName, isAdmin } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return (
    <div>
      <h1>Welcome, {userName}!</h1>
      {isAdmin && <AdminSection />}
    </div>
  );
}
```

---

## Dispatching Auth Actions

### Import Thunks
```typescript
import { loginUser, registerUser, logoutUser } from '@/features/auth/authSlice';
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '@/app/store';
```

### Login
```typescript
const dispatch = useDispatch<AppDispatch>();

const handleLogin = async (email: string, password: string) => {
  try {
    await dispatch(loginUser({ email, password })).unwrap();
    // Success - user is logged in
    // Component already redirects to /dashboard
  } catch (error) {
    // Error - show error message
    console.error(error);
  }
};
```

### Register
```typescript
const handleRegister = async (data: {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}) => {
  try {
    await dispatch(registerUser(data)).unwrap();
    // Success - user is logged in
  } catch (error) {
    console.error(error);
  }
};
```

### Logout
```typescript
const handleLogout = async () => {
  await dispatch(logoutUser()).unwrap();
  navigate('/login');
};
```

---

## Protected Routes

### User Route (Requires Login)
```typescript
<Route element={<ProtectedRoute />}>
  <Route path="/dashboard" element={<Dashboard />} />
  <Route path="/cart" element={<Cart />} />
</Route>
```

Automatically redirects to `/login` if not authenticated.

### Admin Route (Requires Admin Role)
```typescript
<Route element={<AdminRoute />}>
  <Route path="/admin" element={<AdminDashboard />} />
  <Route path="/admin/products" element={<ManageProducts />} />
</Route>
```

Redirects to `/login` if not authenticated, or to `/` if not admin.

---

## Form Validation Rules

### Login Form
| Field | Rules |
|-------|-------|
| Email | Required, valid email format |
| Password | Required, min 6 characters |

### Register Form
| Field | Rules |
|-------|-------|
| Name | Required, 2-50 characters |
| Email | Required, valid email format |
| Password | Required, min 6, letters + numbers |
| Confirm | Required, must match password |
| Terms | Must be checked |

---

## Redux State Selectors

### Get Auth State
```typescript
import { useSelector } from 'react-redux';
import type { RootState } from '@/app/store';

const auth = useSelector((state: RootState) => state.auth);
const isAuthenticated = auth.isAuthenticated;
const user = auth.user;
const loading = auth.loading;
const error = auth.error;
```

### Check if User is Admin
```typescript
const isAdmin = useSelector(
  (state: RootState) => state.auth.user?.role === 'admin'
);
```

### Get User Email
```typescript
const userEmail = useSelector(
  (state: RootState) => state.auth.user?.email
);
```

---

## Token Management

### Access Token
- Stored in: `localStorage`
- Key: `'accessToken'`
- Used: Automatically attached to all API requests
- Lifetime: Short (typically 1-2 hours)

### Refresh Token
- Stored in: `sessionStorage`
- Key: `'refreshToken'`
- Used: To refresh access token when expired
- Lifetime: Long (typically 7-30 days)

### Manual Token Access
```typescript
const accessToken = localStorage.getItem('accessToken');
const refreshToken = sessionStorage.getItem('refreshToken');
```

### Tokens are Automatically Attached
The axios interceptor automatically attaches the access token to all API requests:
```
Authorization: Bearer {accessToken}
```

No manual header management needed!

---

## Error Handling

### In Components
```typescript
import { useAuth } from '@/hooks';

function LoginForm() {
  const { error } = useAuth();

  if (error) {
    return <div className="error">{error}</div>;
  }

  return <form>{/* ... */}</form>;
}
```

### Common Errors
- `'Login failed'` - Invalid credentials
- `'Registration failed'` - Email exists or validation error
- `'Unauthorized'` - Token expired
- `'Forbidden'` - No permission
- `'Network error'` - Connection issue

---

## Flow Diagrams

### Login Flow
```
User fills form
    ↓
Submit button clicked
    ↓
Formik validation
    ↓
dispatch(loginUser)
    ↓
authApi.loginUser()
    ↓
Tokens stored
    ↓
Redux state updated
    ↓
Redirect to /dashboard
```

### Protected Route Flow
```
User navigates to protected route
    ↓
ProtectedRoute checks isAuthenticated
    ↓
If false → Redirect to /login
    ↓
If true → Render component
```

### Admin Route Flow
```
User navigates to /admin/*
    ↓
AdminRoute checks isAuthenticated
    ↓
If false → Redirect to /login
    ↓
If true → Check user.role === 'admin'
    ↓
If not admin → Redirect to /
    ↓
If admin → Render component
```

---

## Styling

Both pages use Tailwind CSS:
- Gradient background: `from-blue-50 to-indigo-100`
- Form card: White background with shadow
- Buttons: Blue with hover state
- Input fields: Gray border with focus ring
- Error text: Red color
- Spinner: Animated SVG

---

## File Locations

| File | Location |
|------|----------|
| Login Page | `src/pages/auth/LoginPage.tsx` |
| Register Page | `src/pages/auth/RegisterPage.tsx` |
| Auth Slice | `src/features/auth/authSlice.ts` |
| useAuth Hook | `src/hooks/useAuth.ts` |
| ProtectedRoute | `src/routes/ProtectedRoute.tsx` |
| AdminRoute | `src/routes/AdminRoute.tsx` |
| AppRoutes | `src/routes/AppRoutes.tsx` |

---

## Testing Checklist

Test these scenarios:

### Login
- [ ] Navigate to /login
- [ ] Submit empty form - should show validation errors
- [ ] Enter invalid email - should show error
- [ ] Enter short password - should show error
- [ ] Submit valid credentials - should redirect to /dashboard
- [ ] Check localStorage for accessToken
- [ ] Check sessionStorage for refreshToken

### Register
- [ ] Navigate to /register
- [ ] Submit empty form - should show validation errors
- [ ] Enter short name - should show error
- [ ] Enter invalid email - should show error
- [ ] Enter weak password - should show error
- [ ] Passwords don't match - should show error
- [ ] Don't check terms - should show error
- [ ] Submit valid form - should redirect to /dashboard

### Protected Routes
- [ ] Log out, then try /dashboard - should redirect to /login
- [ ] Access /admin as regular user - should redirect to /
- [ ] Access /admin as admin - should show admin page

---

## Next Steps

1. Test the login/register pages
2. Verify tokens are stored correctly
3. Implement product listing
4. Integrate with other modules

---

**Date:** February 25, 2026  
**Status:** Ready to Use

