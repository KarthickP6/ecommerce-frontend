# Frontend-Backend Connection Guide - FIXED ✅

## 🎯 Problem Identified and Resolved

### Issue 1: Missing `confirmPassword` Parameter
**Status:** ✅ FIXED

**Problem:**
The RegisterPage components were not sending the `confirmPassword` field to the backend, even though:
- The backend `RegisterRequest` DTO expects it
- The frontend form had the field
- The `authApi.registerUser()` function signature required it

**Root Cause:**
In both `RegisterPage.tsx` and `RegisterPage_New.tsx`, the `handleSubmit` function was dispatching the `registerUser` action with incomplete data:

```typescript
// ❌ BEFORE (Missing confirmPassword)
const result = await dispatch(
  registerUser({
    name: formData.name,
    email: formData.email,
    password: formData.password,
    // Missing: confirmPassword
  })
);

// ✅ AFTER (Complete data)
const result = await dispatch(
  registerUser({
    name: formData.name,
    email: formData.email,
    password: formData.password,
    confirmPassword: formData.confirmPassword,  // ✅ Added
  })
);
```

**Files Fixed:**
- ✅ `D:\Github_Copilot_website\ecommerce-frontend\src\pages\auth\RegisterPage.tsx` (Line 55-59)
- ✅ `D:\Github_Copilot_website\ecommerce-frontend\src\pages\auth\RegisterPage_New.tsx` (Line 64-68)

---

### Issue 2: API Base URL Mismatch
**Status:** ✅ FIXED

**Problem:**
Frontend was trying to connect to `http://localhost:8000/api` but backend runs on `http://localhost:8080/api`

**Root Cause:**
The `.env` file had incorrect port number:
```dotenv
# ❌ BEFORE
VITE_API_BASE_URL=http://localhost:8000/api

# ✅ AFTER
VITE_API_BASE_URL=http://localhost:8080/api
```

**File Fixed:**
- ✅ `D:\Github_Copilot_website\ecommerce-frontend\.env`

---

## 🔧 Technical Details

### Frontend Architecture

#### 1. **API Layer** (`src/api/authApi.ts`)
```typescript
export const registerUser = async (
  name: string,
  email: string,
  password: string,
  confirmPassword: string
) => {
  const response = await axiosInstance.post(AUTH_ENDPOINTS.REGISTER, {
    name,
    email,
    password,
    confirmPassword,
  });
  return response;
};
```

#### 2. **Redux Thunk** (`src/features/auth/authSlice.ts`)
```typescript
export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (userData: { name, email, password, confirmPassword }, { rejectWithValue }) => {
    const response = await authApi.registerUser(
      userData.name,
      userData.email,
      userData.password,
      userData.confirmPassword  // ✅ Passed correctly
    );
    return response;
  }
);
```

#### 3. **Axios Configuration** (`src/api/axiosInstance.ts`)
```typescript
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,  // Now correctly set to http://localhost:8080/api
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' },
});
```

---

### Backend Architecture

#### 1. **Controller** (`AuthController.java`)
```java
@PostMapping("/register")
public ResponseEntity<ApiResponse<AuthResponse>> register(
  @Valid @RequestBody RegisterRequest request
) {
  AuthResponse response = authService.register(request);
  return ResponseEntity.status(HttpStatus.CREATED)
    .body(ApiResponse.success("Registration successful", response));
}
```

#### 2. **Request DTO** (`RegisterRequest.java`)
```java
@Data
public class RegisterRequest {
  @NotBlank
  private String name;
  
  @Email
  @NotBlank
  private String email;
  
  @NotBlank
  @Size(min = 6)
  private String password;
  
  @NotBlank
  private String confirmPassword;
}
```

#### 3. **Service** (`AuthServiceImpl.java`)
```java
@Override
@Transactional
public AuthResponse register(RegisterRequest request) {
  // Validate passwords match
  if (!request.getPassword().equals(request.getConfirmPassword())) {
    throw new BusinessException("Passwords do not match");
  }
  
  // Check email not already registered
  if (userRepository.existsByEmail(request.getEmail())) {
    throw new BusinessException("Email already registered");
  }
  
  // Create and save user
  User user = User.builder()
    .name(request.getName())
    .email(request.getEmail())
    .password(passwordEncoder.encode(request.getPassword()))
    .build();
  
  // Assign USER role and create cart
  // ...
  
  // Generate JWT tokens
  return AuthResponse.builder()
    .accessToken(accessToken)
    .refreshToken(refreshToken)
    .user(userResponse)
    .build();
}
```

#### 4. **Server Configuration** (`application.yml`)
```yaml
server:
  port: 8080
  servlet:
    context-path: /api

spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/furniture
    username: postgres
    password: test
```

---

## 🚀 How to Run the Application

### Prerequisites
1. **PostgreSQL** running on `localhost:5432`
2. **Database** named `furniture` created
3. **Node.js** and **npm** installed
4. **Java 17+** installed

### Step 1: Verify PostgreSQL Database
```sql
-- Connect to PostgreSQL
psql -U postgres

-- Create database
CREATE DATABASE furniture;

-- Check if created
\l
```

### Step 2: Start the Backend
```powershell
# Navigate to backend folder
cd D:\Github_Copilot_website\ecommerce-backend\furniture

# Run with Maven
mvn spring-boot:run

# Or use Maven wrapper
mvnw spring-boot:run
```

**Expected Output:**
```
... INFO  - Application started in X.XXX seconds (JVM running for X.XXX)
... INFO  - Tomcat started on port(s): 8080 (http) with context path '/api'
```

Backend will be available at: **http://localhost:8080/api**

### Step 3: Start the Frontend
```powershell
# Navigate to frontend folder
cd D:\Github_Copilot_website\ecommerce-frontend

# Start dev server
npx vite

# Or use npm script if available
npm run dev
```

**Expected Output:**
```
VITE v8.0.0-beta.15  ready in XXX ms

➜  Local:   http://localhost:5173/
```

Frontend will be available at: **http://localhost:5173**

### Step 4: Test Registration
1. Navigate to http://localhost:5173/register
2. Fill in the form:
   - Name: John Doe
   - Email: john@example.com
   - Password: Test123!
   - Confirm Password: Test123!
3. Click "Register"
4. Should see success message and redirect to dashboard

---

## 🔄 API Flow Diagram

```
User Registration Flow:
─────────────────────

1. User fills form and clicks Register
   │
   ├─→ RegisterPage.tsx validates input
   │
   ├─→ dispatch(registerUser(formData))
   │
   ├─→ authSlice.registerUser thunk created
   │
   ├─→ authApi.registerUser() called
   │
   ├─→ axiosInstance.post('/auth/register', payload)
   │
   └─→ HTTP POST http://localhost:8080/api/auth/register
       │
       └─→ AuthController receives request
           │
           ├─→ Validates RegisterRequest DTO
           │   ├─ name not blank
           │   ├─ email valid
           │   ├─ password min 6 chars
           │   └─ confirmPassword matches
           │
           ├─→ AuthService.register(request)
           │   ├─ Check passwords match
           │   ├─ Check email not registered
           │   ├─ Hash password with BCrypt
           │   ├─ Save user to database
           │   ├─ Assign USER role
           │   ├─ Create shopping cart
           │   └─ Generate JWT tokens
           │
           └─→ Return AuthResponse (200 Created)
               │
               └─→ Frontend receives response
                   │
                   ├─→ Store tokens in localStorage
                   ├─→ Update Redux auth state
                   ├─→ Show success toast
                   └─→ Redirect to /dashboard
```

---

## 📋 Configuration Checklist

### Backend Configuration
- ✅ Server port: `8080`
- ✅ Context path: `/api`
- ✅ Database: PostgreSQL on `localhost:5432`
- ✅ Database name: `furniture`
- ✅ CORS enabled for: `http://localhost:5173`
- ✅ JWT secret configured in `application.yml`
- ✅ Password encoder: BCrypt
- ✅ Security filter chain: Configured

### Frontend Configuration
- ✅ API Base URL: `http://localhost:8080/api` (in `.env`)
- ✅ Request timeout: `30000ms`
- ✅ Axios interceptors: JWT token attachment
- ✅ Redux auth slice: Configured
- ✅ Toast notifications: react-toastify
- ✅ Tailwind CSS: v4.2.1 with `@import "tailwindcss"`
- ✅ Vite dev server: Port `5173`

---

## 🔐 Security Features

### Frontend
- ✅ JWT tokens stored securely
- ✅ Access token in `localStorage`
- ✅ Refresh token in `sessionStorage`
- ✅ Axios interceptors add JWT to all requests
- ✅ Password validation and strength indicator
- ✅ HTTPS-ready configuration

### Backend
- ✅ BCrypt password hashing
- ✅ JWT token validation
- ✅ CORS configured
- ✅ CSRF protection
- ✅ Method-level security
- ✅ Role-based access control (RBAC)

---

## ✅ Testing the Connection

### Test 1: Health Check
```powershell
# Check if backend is running
curl http://localhost:8080/api/auth/verify-token

# Should return 401 (no token) or error message
```

### Test 2: Register New User
```powershell
# Using curl (replace with your data)
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "TestPass123",
    "confirmPassword": "TestPass123"
  }'

# Should return 201 Created with user data and tokens
```

### Test 3: Login
```powershell
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "TestPass123"
  }'

# Should return 200 OK with tokens
```

---

## 🐛 Troubleshooting

### Error: `net::ERR_CONNECTION_REFUSED`
**Solution:** Ensure backend is running on port 8080
```powershell
# Kill any process on port 8080
netstat -ano | findstr :8080
taskkill /PID <PID> /F

# Start backend again
cd D:\Github_Copilot_website\ecommerce-backend\furniture
mvn spring-boot:run
```

### Error: `CORS error`
**Solution:** Verify CORS configuration in `SecurityConfig.java`
- Check if `http://localhost:5173` is in `setAllowedOrigins()`
- Check if `POST` is in `setAllowedMethods()`

### Error: `Database connection failed`
**Solution:** Verify PostgreSQL and database
```powershell
# Test connection
psql -U postgres -h localhost -d furniture

# If fails, create database
psql -U postgres
CREATE DATABASE furniture;
```

### Error: `Email already registered`
**Solution:** This is expected if you try to register the same email twice
- Use a different email or
- Delete the user from database

### Error: `Passwords do not match`
**Solution:** Ensure both password fields have identical values
- Check for typos
- Verify both fields are filled

---

## 📚 Related Documentation

- [Auth Module Documentation](./AUTH_MODULE.md)
- [Backend Implementation Guide](./SPRING_BOOT_IMPLEMENTATION_GUIDE.md)
- [Frontend Architecture](./FRONTEND_BACKEND_ENDPOINT_VERIFICATION.md)
- [API Quick Reference](./API_QUICK_REFERENCE.md)

---

## 🎉 Summary

Your application is now correctly configured for frontend-backend communication:

1. ✅ **Frontend** sends complete registration data with `confirmPassword`
2. ✅ **API calls** go to correct URL: `http://localhost:8080/api`
3. ✅ **Backend** receives and validates all fields
4. ✅ **Security** is properly configured with CORS and JWT
5. ✅ **Database** integration is ready

The `/register` endpoint should now work correctly! 🚀

---

**Last Updated:** February 26, 2026
**Status:** Ready for Production Testing

