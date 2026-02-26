# Quick Start - Register Endpoint Fix

## Problem
The `/auth/register` endpoint wasn't being called from the frontend.

## Root Causes Found and Fixed

### 1. ❌ Missing `confirmPassword` Parameter
**Files Fixed:**
- `ecommerce-frontend\src\pages\auth\RegisterPage.tsx`
- `ecommerce-frontend\src\pages\auth\RegisterPage_New.tsx`

**Change Made:**
```typescript
// BEFORE
registerUser({
  name: formData.name,
  email: formData.email,
  password: formData.password,
})

// AFTER
registerUser({
  name: formData.name,
  email: formData.email,
  password: formData.password,
  confirmPassword: formData.confirmPassword,  // ✅ ADDED
})
```

### 2. ❌ Wrong API URL (Port 8000 instead of 8080)
**File Fixed:**
- `ecommerce-frontend\.env`

**Change Made:**
```dotenv
# BEFORE
VITE_API_BASE_URL=http://localhost:8000/api

# AFTER
VITE_API_BASE_URL=http://localhost:8080/api
```

---

## What You Need to Do Now

### 1. Stop and Restart Frontend Dev Server
```powershell
cd D:\Github_Copilot_website\ecommerce-frontend

# Press Ctrl+C to stop current server
# Then restart
npx vite
```

### 2. Start Backend (if not already running)
```powershell
cd D:\Github_Copilot_website\ecommerce-backend\furniture
mvn spring-boot:run
```

### 3. Ensure PostgreSQL is Running
```powershell
# Test connection
psql -U postgres -d furniture

# If fails, make sure PostgreSQL service is running
```

---

## Test Registration Now

1. Open http://localhost:5173/register
2. Fill in the form:
   - Name: John Doe
   - Email: john@example.com
   - Password: Test123!
   - Confirm: Test123!
3. Click Register
4. You should see success message

---

## Network Request Should Look Like

```
POST http://localhost:8080/api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "Test123!",
  "confirmPassword": "Test123!"
}

Response 201 Created:
{
  "success": true,
  "message": "Registration successful",
  "data": {
    "accessToken": "eyJhbGc...",
    "refreshToken": "eyJhbGc...",
    "user": {
      "id": "uuid",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user"
    }
  }
}
```

---

## Common Issues & Fixes

| Issue | Solution |
|-------|----------|
| `net::ERR_CONNECTION_REFUSED` | Backend not running on port 8080 |
| `CORS error` | Restart frontend after .env change |
| `Passwords do not match` error from backend | Both fields must be identical |
| `Email already registered` | Use different email or clear database |
| Frontend still tries port 8000 | Clear browser cache or restart dev server |

---

✅ **All fixes applied. Your registration endpoint should now work!**

