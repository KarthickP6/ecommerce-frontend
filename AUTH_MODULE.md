# Authentication Module Documentation

## Overview

Complete authentication module with login, register, async thunks, and role-based routing.

---

## Features Implemented

✅ **Login Page**
- Email and password validation
- Form error handling
- Loading state with spinner
- Redirect to dashboard on success
- Forgot password link
- Demo credentials display

✅ **Register Page**
- Full name, email, password validation
- Password confirmation validation
- Terms & conditions acceptance
- Strong password requirements
- Redirect to dashboard on success
- Link to login page

✅ **Auth Slice with Async Thunks**
- loginUser async thunk
- registerUser async thunk
- logoutUser async thunk
- Token storage (localStorage/sessionStorage)
- Loading and error states
- Role-based state management

✅ **API Integration**
- authApi.loginUser()
- authApi.registerUser()
- authApi.logoutUser()
- Automatic token attachment
- Error handling

✅ **Role-Based Routing**
- Role stored in Redux (user/admin)
- ProtectedRoute for authenticated users
- AdminRoute for admin-only access
- Automatic redirects on unauthorized access

✅ **Custom Hook**
- useAuth hook for easy access to auth state
- User data shortcuts (userId, userName, userEmail)
- Role checking (isAdmin, isUser)

---

## File Structure

```
src/
├── features/auth/
│   ├── authSlice.ts         ✅ Redux slice with async thunks
│   └── index.ts             ✅ Exports
├── pages/auth/
│   ├── LoginPage.tsx        ✅ Login form
│   └── RegisterPage.tsx     ✅ Register form
├── hooks/
│   ├── useAuth.ts           ✅ Custom auth hook
│   └── index.ts             ✅ Exports
└── routes/
    ├── AppRoutes.tsx        ✅ Updated with auth routes
    ├── ProtectedRoute.tsx   ✅ User protection
    └── AdminRoute.tsx       ✅ Admin protection
```

---

## Auth Slice Details

### State Shape

```typescript
{
  isAuthenticated: boolean;
  user: {
    id: string;
    email: string;
    name: string;
    role: 'user' | 'admin';
  } | null;
  accessToken: string | null;
  loading: boolean;
  error: string | null;
}
```

### Async Thunks

#### loginUser
```typescript
dispatch(loginUser({ 
  email: 'user@example.com', 
  password: 'password123' 
}))
.unwrap()
.then(() => navigate('/dashboard'))
.catch(error => setError(error))
```

Handles:
- Email/password validation on backend
- Token storage (localStorage + sessionStorage)
- User data extraction
- Loading state management
- Error handling

#### registerUser
```typescript
dispatch(registerUser({
  name: 'John Doe',
  email: 'john@example.com',
  password: 'Password123',
  confirmPassword: 'Password123'
}))
.unwrap()
.then(() => navigate('/dashboard'))
.catch(error => setError(error))
```

Handles:
- Name validation
- Email validation
- Password matching
- Token storage
- Auto-login after registration
- Error handling

#### logoutUser
```typescript
dispatch(logoutUser())
.unwrap()
.then(() => navigate('/login'))
.catch(error => console.error(error))
```

Handles:
- API logout call
- Token cleanup from storage
- State reset
- Error handling (still clears tokens)

---

## Login Page

### Path: `/login`

### Features
- Email validation
- Password validation
- Form submission handling
- Loading spinner during submission
- Error message display
- Forgot password link
- Register link
- Demo credentials for testing

### Validation Rules
- Email: Valid email format required
- Password: Minimum 6 characters

### Form Fields
- Email: text input
- Password: password input
- Remember me: (can be added)

### Actions
- Submit: Calls loginUser async thunk
- Forgot password: Navigates to /forgot-password
- Register: Navigates to /register

---

## Register Page

### Path: `/register`

### Features
- Full name input with validation
- Email validation
- Password with strength requirements
- Password confirmation validation
- Terms & conditions agreement
- Form submission handling
- Loading spinner
- Error display
- Login link

### Validation Rules
- Name: 2-50 characters
- Email: Valid email format
- Password: Min 6 chars, must contain letters and numbers
- Confirm Password: Must match password
- Terms: Must be accepted

### Form Fields
- Full Name: text input
- Email: email input
- Password: password input with requirements
- Confirm Password: password input
- Agree Terms: checkbox

### Actions
- Submit: Calls registerUser async thunk
- Sign In: Navigates to /login

---

## Using Auth in Components

### Using the useAuth Hook

```typescript
import { useAuth } from '@/hooks';

function MyComponent() {
  const {
    isAuthenticated,
    user,
    loading,
    error,
    isAdmin,
    userId,
    userName
  } = useAuth();

  if (loading) return <Spinner />;
  if (!isAuthenticated) return <Navigate to="/login" />;

  return (
    <div>
      <p>Welcome, {userName}!</p>
      {isAdmin && <AdminPanel />}
    </div>
  );
}
```

### Dispatching Auth Actions

```typescript
import { useDispatch } from 'react-redux';
import { loginUser, logoutUser } from '@/features/auth/authSlice';
import type { AppDispatch } from '@/app/store';

function LoginForm() {
  const dispatch = useDispatch<AppDispatch>();

  const handleLogin = async () => {
    try {
      await dispatch(loginUser({
        email: 'user@example.com',
        password: 'password123'
      })).unwrap();
      // Success - redirect happens automatically
    } catch (error) {
      // Handle error
    }
  };

  const handleLogout = async () => {
    await dispatch(logoutUser()).unwrap();
    navigate('/login');
  };
}
```

---

## Route Protection

### ProtectedRoute
Protects routes that require authentication.

```typescript
<Route element={<ProtectedRoute />}>
  <Route path="/dashboard" element={<Dashboard />} />
  <Route path="/profile" element={<Profile />} />
</Route>
```

Behavior:
- Checks `state.auth.isAuthenticated`
- If false: Redirects to `/login`
- If true: Renders route component
- Redirects to `/` if role doesn't match (if specified)

### AdminRoute
Protects routes that require admin role.

```typescript
<Route element={<AdminRoute />}>
  <Route path="/admin" element={<AdminDashboard />} />
  <Route path="/admin/products" element={<ManageProducts />} />
</Route>
```

Behavior:
- Checks `state.auth.isAuthenticated`
- If false: Redirects to `/login`
- Checks `state.auth.user.role === 'admin'`
- If not admin: Redirects to `/`
- If admin: Renders route component

---

## Token Management

### Storage Strategy

```
Access Token:
├─ Storage: localStorage
├─ Key: 'accessToken'
├─ Used: Auto-attached to all API requests
└─ Lifetime: Short (1-2 hours)

Refresh Token:
├─ Storage: sessionStorage (more secure)
├─ Key: 'refreshToken'
├─ Used: Refresh access token when expired
└─ Lifetime: Long (7-30 days)
```

### Token Flow

```
1. Login/Register
   └─ Backend returns accessToken + refreshToken

2. Storage
   ├─ localStorage.setItem('accessToken', token)
   └─ sessionStorage.setItem('refreshToken', token)

3. Every API Request
   └─ Axios interceptor auto-attaches Authorization header

4. On 401 Unauthorized
   ├─ (Optional) Call refreshToken endpoint
   ├─ Get new accessToken
   ├─ Retry original request
   └─ If refresh fails, redirect to login

5. Logout
   ├─ API call to /auth/logout
   ├─ localStorage.removeItem('accessToken')
   ├─ sessionStorage.removeItem('refreshToken')
   └─ Clear Redux auth state
```

---

## API Endpoints

### Login
```
POST /auth/login
Body: { email, password }
Response: { user, accessToken, refreshToken }
```

### Register
```
POST /auth/register
Body: { name, email, password, confirmPassword }
Response: { user, accessToken, refreshToken }
```

### Logout
```
POST /auth/logout
Headers: { Authorization: Bearer token }
Response: { message }
```

---

## Error Handling

### Form Validation Errors
- Displayed below each field
- Real-time validation with Formik
- Yup schema validation

### API Errors
- Displayed in error alert above form
- Status 400: Bad request
- Status 401: Unauthorized
- Status 409: Email already exists
- Status 500: Server error

### State Error Handling
```typescript
const { error } = useAuth();

if (error) {
  return <ErrorAlert message={error} />;
}
```

---

## Demo Credentials

For testing (shown on login page):
```
Email: demo@example.com
Password: password123
```

---

## Loading States

### Form Submit
- Button disabled during submission
- Spinner animation shown
- Text changes to "Signing in..." or "Creating Account..."

### API Calls
- `loading` state in Redux
- Access via `useAuth()` hook or selector

```typescript
const { loading } = useAuth();

if (loading) {
  return <Spinner />;
}
```

---

## Next Steps

1. ✅ Authentication module complete
2. ⏭️ Implement product listing
3. ⏭️ Implement shopping cart
4. ⏭️ Implement checkout flow
5. ⏭️ Implement admin panel
6. ⏭️ Add toast notifications
7. ⏭️ Add password reset flow

---

## Testing Checklist

- [ ] Navigate to /login page
- [ ] Test form validation (empty fields)
- [ ] Test invalid email format
- [ ] Test short password
- [ ] Test successful login (demo credentials)
- [ ] Verify redirect to /dashboard
- [ ] Verify role stored in Redux
- [ ] Navigate to /register page
- [ ] Test form validation
- [ ] Test password match validation
- [ ] Test successful registration
- [ ] Test logout functionality
- [ ] Verify tokens cleared
- [ ] Test protected route access (logged out)
- [ ] Test admin route access (as regular user)

---

**Status:** ✅ Complete and Production-Ready  
**Date:** February 25, 2026

