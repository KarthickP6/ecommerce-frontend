# 🧪 Complete Testing Guide - Google OAuth & User Dashboard

## Prerequisites

Before testing, ensure you have:
- ✅ PostgreSQL running with `furniture` database
- ✅ Backend running on `http://localhost:8080`
- ✅ Frontend running on `http://localhost:5173`
- ✅ Google Client ID configured in `.env`

---

## Test Case 1: Registration with Email & Redirect to Login

### Steps:
1. Open browser to `http://localhost:5173/register`
2. Fill in the registration form:
   - Name: `John Doe`
   - Email: `john@example.com`
   - Password: `SecurePass123!`
   - Confirm Password: `SecurePass123!`
3. Click "Create Account" button

### Expected Results:
✅ Toast message appears: "Registration successful! Please login to continue."
✅ User is redirected to `/login` page
✅ URL changes from `/register` to `/login`
✅ User can now login with email & password

### Backend Verification:
```powershell
# Check PostgreSQL for new user
psql -U postgres -d furniture
SELECT * FROM users WHERE email = 'john@example.com';
SELECT * FROM carts WHERE user_id = (SELECT id FROM users WHERE email = 'john@example.com');
```

### What Should Happen:
- User record created in `users` table
- Cart automatically created for user
- User role set to `USER`
- Email is verified

---

## Test Case 2: Email Login (After Registration)

### Steps:
1. Go to `http://localhost:5173/login`
2. Enter credentials:
   - Email: `john@example.com`
   - Password: `SecurePass123!`
3. Click "Sign In" button

### Expected Results:
✅ Toast message: "Login successful"
✅ Redirected to dashboard (`/dashboard`)
✅ URL shows `http://localhost:5173/dashboard`
✅ User's name displayed in welcome message

### Browser Console Check (F12):
```javascript
// Check Redux state
console.log(store.getState().auth);
// Should show:
// isAuthenticated: true
// user: { id: "...", email: "john@example.com", name: "John Doe", role: "user" }
// accessToken: "eyJ..."
```

---

## Test Case 3: User Dashboard Content & Links

### Steps:
1. Login to application
2. Navigate to `http://localhost:5173/dashboard`
3. Observe the page content

### Expected Results - Welcome Section:
✅ Title: "Welcome, John Doe! 👋"
✅ Email displayed: "john@example.com"
✅ Account type shown: "User"

### Expected Results - Feature Cards:
✅ 6 interactive cards visible:
   1. 🛍️ Browse Products → `/products`
   2. 📦 My Orders → `/orders`
   3. 🛒 Shopping Cart → `/cart`
   4. ❤️ Wishlist → `/wishlist`
   5. 👤 Profile Settings → `/profile`
   6. 📍 Addresses → `/address`

### Expected Results - Additional Sections:
✅ Quick stats section with 4 cards (Orders, Spent, Wishlist, Cart)
✅ Help section with 3 information boxes
✅ Navigation bar at top with links

### Test Navigation:
```
Click "Browse Products" → Should go to /products
Click "My Orders" → Should go to /orders
Click "Shopping Cart" → Should go to /cart
Click "Wishlist" → Should go to /wishlist
Click "Profile Settings" → Should go to /profile
Click "Addresses" → Should go to /address
```

---

## Test Case 4: Google OAuth Registration (New User)

### Prerequisites:
- Valid Google Client ID in `.env`
- Browser account/Google account ready
- Clear localStorage first: Open DevTools → Application → Clear localStorage

### Steps:
1. Go to `http://localhost:5173/register`
2. Click the "Google" button
3. A Google popup appears
4. Select or login with your Google account
5. Authorize the application

### Expected Results:
✅ Google popup opens
✅ After authorization, popup closes
✅ Toast message: "Registration with Google successful!"
✅ Redirected to `/dashboard`
✅ User's Google name and email displayed

### Verify User Created:
```powershell
# Check PostgreSQL
psql -U postgres -d furniture
SELECT * FROM users WHERE email = 'your-google-email@gmail.com';
```

### What Should Be in Database:
```
id: [auto-generated]
email: your-google-email@gmail.com
name: Your Google Name
password: [empty string]
profile_image: [Google profile picture URL]
email_verified: true
active: true
role: USER
```

### Cart Verification:
```sql
SELECT * FROM carts 
WHERE user_id = (SELECT id FROM users WHERE email = 'your-google-email@gmail.com');
```
✅ Cart should exist for new Google user

---

## Test Case 5: Google OAuth Login (Existing User)

### Prerequisites:
- Must have registered via Google in Test Case 4
- Browser cookies may auto-fill, clear them if needed

### Steps:
1. Go to `http://localhost:5173/login`
2. Click the "Google" button
3. Google popup appears
4. Select the same Google account as Test Case 4
5. May auto-authorize if you already authorized

### Expected Results:
✅ Toast message: "Login with Google successful!"
✅ Redirected to `/dashboard`
✅ Same user data displayed (name, email)
✅ No new user created (uses existing account)

### Verify No Duplicate User:
```sql
SELECT COUNT(*) FROM users WHERE email = 'your-google-email@gmail.com';
-- Should return: 1 (only one record)
```

---

## Test Case 6: Token Verification

### Steps:
1. Login via any method (email or Google)
2. Open DevTools (F12)
3. Go to Application tab → Local Storage
4. Check for `accessToken`

### Expected Results:
✅ Token exists in localStorage
✅ Token starts with "eyJ" (JWT format)
✅ Token can be decoded (JWT.io)

### Token Inspection:
```javascript
// In browser console
const token = localStorage.getItem('accessToken');
console.log(token);

// Decode at https://jwt.io (for testing only)
// Should show:
// Header: { "alg": "HS512", "typ": "JWT" }
// Payload: { "id": "...", "email": "...", "role": "..." }
```

---

## Test Case 7: Session Persistence

### Steps:
1. Login to application
2. Close the browser tab
3. Open new tab and go to `http://localhost:5173`

### Expected Results:
✅ App automatically redirects to `/dashboard`
✅ User still logged in
✅ No need to login again
✅ User data still visible

### Why This Works:
- Token stored in localStorage
- Redux persists on app load
- ProtectedRoute checks authentication

---

## Test Case 8: Logout Functionality

### Steps:
1. Login to application
2. Go to dashboard
3. Look for logout button (in navbar/profile)
4. Click logout

### Expected Results:
✅ Token removed from localStorage
✅ User redirected to `/login`
✅ User cannot access `/dashboard` without logging in

---

## Test Case 9: Error Handling

### Test Invalid Google Token:
1. Open DevTools Console
2. Manually call logout
3. Try to access protected routes
4. Should redirect to login

### Test Network Error:
1. Turn off backend while logged in
2. Try to navigate to protected routes
3. Should show error and redirect to login

### Test Invalid Credentials:
1. Go to login page
2. Enter wrong email/password
3. Click Sign In
4. Should show error message

---

## Test Case 10: Responsive Design

### Desktop (1920x1080):
```
✅ Dashboard layout optimized
✅ 3 columns for feature cards
✅ All content visible
✅ Navigation bar aligned
```

### Tablet (768x1024):
```
✅ Dashboard responsive
✅ 2 columns for feature cards
✅ Navigation adjusted
```

### Mobile (375x667):
```
✅ Dashboard mobile-friendly
✅ 1 column for feature cards
✅ Navigation hamburger menu
✅ All content readable
```

---

## API Testing with cURL

### Test Google OAuth Endpoint:

```powershell
# Get a token from Google first (manually from browser)
# Then call backend API

$token = "YOUR_GOOGLE_ID_TOKEN_HERE"

curl -X POST http://localhost:8080/api/auth/google `
  -H "Content-Type: application/json" `
  -d "{`"idToken`":`"$token`"}"

# Expected response (200 OK):
{
  "success": true,
  "message": "Google authentication successful",
  "data": {
    "accessToken": "eyJ...",
    "user": { "id": "...", "email": "...", "name": "..." },
    "tokenType": "Bearer",
    "expiresIn": 900
  }
}
```

### Test Regular Registration:

```powershell
curl -X POST http://localhost:8080/api/auth/register `
  -H "Content-Type: application/json" `
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "TestPass123!",
    "confirmPassword": "TestPass123!"
  }'

# Expected response (201 Created):
{
  "success": true,
  "message": "Registration successful",
  "data": {
    "accessToken": "eyJ...",
    "user": { "id": "...", "email": "test@example.com", "name": "Test User" }
  }
}
```

---

## Performance Testing

### Check Loading Time:
1. Open DevTools → Network tab
2. Clear cache
3. Reload page
4. Check metrics:
   - Dashboard load: < 2 seconds
   - Assets load: < 500ms
   - API calls: < 1 second

### Check Bundle Size:
```powershell
cd ecommerce-frontend
npm run build

# Check dist folder size
# Should be < 500KB gzipped
```

---

## Security Testing

### Test Token Expiration:
```javascript
// In console, modify token to expired time
localStorage.setItem('accessToken', 'invalid_token');
// Try to access protected route
// Should redirect to login
```

### Test CORS:
```javascript
// Frontend should access backend only from http://localhost:5173
// Other origins should be blocked
```

### Test HTTPS (Production):
- Ensure all API calls use HTTPS
- Check browser shows lock icon

---

## Browser Compatibility Testing

Test on:
- ✅ Chrome (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Edge (latest)

### Expected Results:
- All features work
- OAuth buttons functional
- Dashboard renders properly
- Responsive design works

---

## Database Integrity Testing

### Check User Creation:
```sql
SELECT id, email, name, active, role, created_at FROM users ORDER BY created_at DESC LIMIT 5;
```

### Check Cart Creation:
```sql
SELECT u.email, c.id as cart_id, COUNT(ci.id) as items_count 
FROM users u 
LEFT JOIN carts c ON u.id = c.user_id 
LEFT JOIN cart_items ci ON c.id = ci.cart_id
GROUP BY u.id, c.id;
```

### Check Data Consistency:
```sql
-- Every user should have a cart
SELECT COUNT(*) as users_without_cart 
FROM users u 
WHERE NOT EXISTS (SELECT 1 FROM carts c WHERE c.user_id = u.id);
-- Should return: 0
```

---

## Success Criteria Checklist

### Feature 1: Registration Redirect ✅
- [ ] Register with email shows success message
- [ ] User redirected to login page
- [ ] Can login after registration
- [ ] User exists in database

### Feature 2: User Dashboard ✅
- [ ] Dashboard displays user's name
- [ ] Shows 6 feature cards
- [ ] All cards have correct links
- [ ] Quick stats section visible
- [ ] Navigation bar working
- [ ] Responsive on mobile/tablet

### Feature 3: Google OAuth ✅
- [ ] Google button visible on login
- [ ] Google button visible on register
- [ ] OAuth popup opens and works
- [ ] New user created via Google
- [ ] Existing user can login via Google
- [ ] User data displays correctly
- [ ] Profile picture shows (if available)

---

## Troubleshooting During Testing

| Issue | Solution |
|-------|----------|
| Google button doesn't work | Check VITE_GOOGLE_CLIENT_ID in .env |
| User not created | Check PostgreSQL is running |
| Token not saving | Check localStorage is enabled |
| Dashboard shows blank | Clear cache and reload |
| CORS error | Check backend CORS config |
| 401 Unauthorized | Token might be expired, login again |
| Cannot decode token at jwt.io | Token format might be different in dev |

---

## Test Results Log

Use this template to document your testing:

```
Test Date: ___________
Tester: ___________
Browser: ___________
Environment: Development

Test Results:
[✅/❌] Test Case 1: Registration with Email
[✅/❌] Test Case 2: Email Login
[✅/❌] Test Case 3: User Dashboard
[✅/❌] Test Case 4: Google OAuth Registration
[✅/❌] Test Case 5: Google OAuth Login
[✅/❌] Test Case 6: Token Verification
[✅/❌] Test Case 7: Session Persistence
[✅/❌] Test Case 8: Logout
[✅/❌] Test Case 9: Error Handling
[✅/❌] Test Case 10: Responsive Design

Issues Found:
- [None / List here]

Overall Status: PASSED / FAILED
```

---

**All tests completed successfully? 🎉 You're ready for production!**

