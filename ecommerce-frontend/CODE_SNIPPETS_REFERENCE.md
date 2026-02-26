# Code Snippets Reference

## Quick Copy-Paste Guide for Role-Based Redirection

### 1. LoginResponse Type Definition
```typescript
interface LoginResponse {
  success: boolean;
  data: {
    accessToken: string;
    refreshToken: string;
    user: {
      id: string;
      email: string;
      roles: string[];
    };
  };
}
```

### 2. Component State Setup
```typescript
const [email, setEmail] = useState('');
const [password, setPassword] = useState('');
const [showPassword, setShowPassword] = useState(false);
const [isSubmitting, setIsSubmitting] = useState(false);

const dispatch = useDispatch<AppDispatch>();
const navigate = useNavigate();
const { loading, error } = useSelector((state: RootState) => state.auth);

// Ref to prevent double submissions during redirect
const navigationTimeoutRef = useRef<NodeJS.Timeout | null>(null);
```

### 3. Error Clearing Handler
```typescript
const handleClearError = useCallback(() => {
  if (error) {
    dispatch(clearError());
  }
}, [error, dispatch]);
```

### 4. Email Input Handler
```typescript
const handleEmailChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
  setEmail(e.target.value);
  handleClearError();
}, [handleClearError]);
```

### 5. Password Input Handler
```typescript
const handlePasswordChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
  setPassword(e.target.value);
  handleClearError();
}, [handlePasswordChange]);
```

### 6. Email Validation
```typescript
const isValidEmail = (emailValue: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(emailValue);
};
```

### 7. Role-Based Redirect Path Function
```typescript
const getRedirectPath = (response: LoginResponse): string => {
  try {
    const roles = response?.data?.user?.roles;

    // Validate roles is an array
    if (!Array.isArray(roles)) {
      console.warn('Roles is not an array, redirecting to dashboard');
      return '/dashboard';
    }

    // Check for ADMIN role
    return roles.includes('ADMIN') ? '/admin' : '/dashboard';
  } catch (err) {
    console.error('Error determining redirect path:', err);
    return '/dashboard';
  }
};
```

### 8. Complete Submit Handler
```typescript
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  // Prevent double submission
  if (isSubmitting || loading) {
    return;
  }

  // Validate inputs
  if (!email || !password) {
    toast.error('Please fill all fields');
    return;
  }

  if (!isValidEmail(email)) {
    toast.error('Please enter a valid email address');
    return;
  }

  if (password.length < 6) {
    toast.error('Password must be at least 6 characters');
    return;
  }

  setIsSubmitting(true);

  try {
    // Dispatch login action and unwrap the result
    const result = await dispatch(loginUser({ email, password })).unwrap() as LoginResponse;

    // Validate response structure
    if (!result?.success || !result?.data?.user) {
      toast.error('Invalid response from server');
      setIsSubmitting(false);
      return;
    }

    // Show success message
    toast.success('Login successful');

    // Determine redirect path based on roles
    const redirectPath = getRedirectPath(result);

    // Clear any previous timeout
    if (navigationTimeoutRef.current) {
      clearTimeout(navigationTimeoutRef.current);
    }

    // Navigate with replace to prevent back button returning to login
    navigationTimeoutRef.current = setTimeout(() => {
      navigate(redirectPath, { replace: true });
    }, 300);

  } catch (err) {
    // Redux slice handles error state - just ensure UI is responsive
    setIsSubmitting(false);
    console.error('Login error:', err);
  }
};
```

### 9. Cleanup Effect
```typescript
React.useEffect(() => {
  return () => {
    if (navigationTimeoutRef.current) {
      clearTimeout(navigationTimeoutRef.current);
    }
  };
}, []);
```

### 10. Email Input JSX
```typescript
<input
  type="email"
  placeholder="Enter your email"
  value={email}
  onChange={handleEmailChange}
  disabled={loading || isSubmitting}
  className="w-full px-6 py-3 rounded-xl bg-white/20 border border-white/30 text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 focus:bg-white/30 transition-all duration-200 backdrop-blur-sm disabled:opacity-50 disabled:cursor-not-allowed"
/>
```

### 11. Password Input with Toggle JSX
```typescript
<div className="relative">
  <input
    type={showPassword ? 'text' : 'password'}
    placeholder="Enter your password"
    value={password}
    onChange={handlePasswordChange}
    disabled={loading || isSubmitting}
    className="w-full px-6 py-3 rounded-xl bg-white/20 border border-white/30 text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 focus:bg-white/30 transition-all duration-200 backdrop-blur-sm disabled:opacity-50 disabled:cursor-not-allowed"
  />
  <button
    type="button"
    onClick={() => setShowPassword(!showPassword)}
    disabled={loading || isSubmitting}
    className="absolute right-4 top-3.5 text-gray-400 hover:text-gray-200 transition-colors disabled:opacity-50"
  >
    {showPassword ? '🔓' : '🔒'}
  </button>
</div>
```

### 12. Submit Button JSX
```typescript
<button
  type="submit"
  disabled={loading || isSubmitting}
  className="w-full py-3 px-6 mt-8 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold rounded-xl hover:from-cyan-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 shadow-lg"
>
  {loading || isSubmitting ? 'Signing in...' : 'Sign In'}
</button>
```

### 13. Disabled Inputs During Submission
```typescript
// All inputs should have: disabled={loading || isSubmitting}
<input disabled={loading || isSubmitting} />
<button disabled={loading || isSubmitting} />
<checkbox disabled={loading || isSubmitting} />
```

### 14. Social Buttons Example
```typescript
<button 
  type="button" 
  disabled={loading || isSubmitting} 
  className="w-full py-2.5 px-4 border border-white/30 rounded-xl text-gray-200 font-medium hover:bg-white/10 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
>
  Continue with Google
</button>
```

---

## Testing Code Snippets

### Test Admin Login
```typescript
// Input
const testAdminLogin = {
  email: 'admin@example.com',
  password: 'admin123'
};

// Expected Response
const expectedResponse: LoginResponse = {
  success: true,
  data: {
    accessToken: 'eyJhbGc...',
    refreshToken: 'eyJhbGc...',
    user: {
      id: '123',
      email: 'admin@example.com',
      roles: ['ADMIN']
    }
  }
};

// Expected Redirect
// navigate('/admin', { replace: true })
```

### Test User Login
```typescript
// Input
const testUserLogin = {
  email: 'user@example.com',
  password: 'user123'
};

// Expected Response
const expectedResponse: LoginResponse = {
  success: true,
  data: {
    accessToken: 'eyJhbGc...',
    refreshToken: 'eyJhbGc...',
    user: {
      id: '456',
      email: 'user@example.com',
      roles: ['USER']
    }
  }
};

// Expected Redirect
// navigate('/dashboard', { replace: true })
```

### Test Role Determination
```typescript
// Should redirect to /admin
getRedirectPath({
  success: true,
  data: {
    accessToken: 'token',
    refreshToken: 'token',
    user: {
      id: '1',
      email: 'admin@test.com',
      roles: ['ADMIN']
    }
  }
}); // Returns '/admin'

// Should redirect to /dashboard
getRedirectPath({
  success: true,
  data: {
    accessToken: 'token',
    refreshToken: 'token',
    user: {
      id: '2',
      email: 'user@test.com',
      roles: ['USER']
    }
  }
}); // Returns '/dashboard'

// Should redirect to /admin (multiple roles)
getRedirectPath({
  success: true,
  data: {
    accessToken: 'token',
    refreshToken: 'token',
    user: {
      id: '3',
      email: 'admin@test.com',
      roles: ['ADMIN', 'USER']
    }
  }
}); // Returns '/admin'
```

---

## Common Patterns

### Pattern 1: Disable Input During Submission
```typescript
// Bad - only checks loading
<input disabled={loading} />

// Good - checks both loading and isSubmitting
<input disabled={loading || isSubmitting} />
```

### Pattern 2: Handle Response Type Safely
```typescript
// Bad - no type checking
const result = await dispatch(loginUser(...)).unwrap();
const roles = result.data.user.roles; // Could crash if structure is wrong

// Good - with type casting and validation
const result = await dispatch(loginUser(...)).unwrap() as LoginResponse;
if (!result?.success || !result?.data?.user) {
  toast.error('Invalid response');
  return;
}
const roles = result.data.user.roles; // Type-safe
```

### Pattern 3: Prevent Redirect Loops
```typescript
// Bad - user can go back to login
navigate(redirectPath); // or navigate(redirectPath, {})

// Good - replaces history entry
navigate(redirectPath, { replace: true });
```

### Pattern 4: Cleanup Timeouts
```typescript
// Bad - timeout is never cleaned up
setTimeout(() => navigate(...), 300);

// Good - properly cleaned up
const timeoutRef = useRef<NodeJS.Timeout | null>(null);

timeoutRef.current = setTimeout(() => navigate(...), 300);

useEffect(() => {
  return () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };
}, []);
```

### Pattern 5: Memoize Handlers
```typescript
// Bad - recreates function on every render
const handleChange = (e) => setEmail(e.target.value);

// Good - memoized, only recreates when dependencies change
const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
  setEmail(e.target.value);
}, []);
```

---

## Error Handling Examples

### Handle Empty Fields
```typescript
if (!email || !password) {
  toast.error('Please fill all fields');
  return;
}
```

### Handle Invalid Email
```typescript
if (!isValidEmail(email)) {
  toast.error('Please enter a valid email address');
  return;
}
```

### Handle Short Password
```typescript
if (password.length < 6) {
  toast.error('Password must be at least 6 characters');
  return;
}
```

### Handle Invalid Response
```typescript
if (!result?.success || !result?.data?.user) {
  toast.error('Invalid response from server');
  setIsSubmitting(false);
  return;
}
```

### Handle API Errors
```typescript
try {
  const result = await dispatch(loginUser(...)).unwrap();
  // ... rest of code
} catch (err) {
  setIsSubmitting(false);
  console.error('Login error:', err);
  // Redux slice handles setting error state
}
```

---

## TypeScript Types Reference

### LoginResponse Interface
```typescript
interface LoginResponse {
  success: boolean;
  data: {
    accessToken: string;
    refreshToken: string;
    user: {
      id: string;
      email: string;
      roles: string[];
    };
  };
}
```

### React Event Types
```typescript
// Email/Password Input Change
e: React.ChangeEvent<HTMLInputElement>

// Form Submit
e: React.FormEvent

// Button Click
onClick: React.MouseEvent<HTMLButtonElement>
```

### Redux Types
```typescript
// Dispatch with Type
const dispatch = useDispatch<AppDispatch>();

// Selector with State Type
const { loading, error } = useSelector((state: RootState) => state.auth);
```

---

## Keyboard Shortcuts for Common Tasks

```typescript
// Toggle password visibility
{showPassword ? '🔓' : '🔒'}

// Check for ADMIN role
roles.includes('ADMIN')

// Redirect conditionally
roles.includes('ADMIN') ? '/admin' : '/dashboard'

// Validate array
Array.isArray(roles)

// Safe navigation with optional chaining
response?.data?.user?.roles

// Timeout management
navigationTimeoutRef.current = setTimeout(..., 300);
```

---

## Common Mistakes to Avoid

❌ **Wrong**: Not checking if roles is an array
```typescript
return roles.includes('ADMIN') ? '/admin' : '/dashboard'; // Could crash
```

✅ **Right**: Check the type first
```typescript
if (!Array.isArray(roles)) return '/dashboard';
return roles.includes('ADMIN') ? '/admin' : '/dashboard';
```

---

❌ **Wrong**: Not preventing double submission
```typescript
const handleSubmit = async (e) => {
  const result = await dispatch(loginUser(...)).unwrap();
  navigate(...);
};
```

✅ **Right**: Check isSubmitting state
```typescript
if (isSubmitting || loading) return;
setIsSubmitting(true);
```

---

❌ **Wrong**: Not cleaning up timeouts
```typescript
setTimeout(() => navigate(...), 300);
```

✅ **Right**: Clean up in useEffect
```typescript
navigationTimeoutRef.current = setTimeout(() => navigate(...), 300);
useEffect(() => {
  return () => clearTimeout(navigationTimeoutRef.current);
}, []);
```

---

## Questions?

Refer to the full documentation files:
- `LOGIN_PAGE_IMPLEMENTATION.md` - Detailed explanation
- `ROLE_BASED_REDIRECTION_QUICK_GUIDE.md` - Quick reference
- `IMPLEMENTATION_COMPLETE.md` - Complete overview

