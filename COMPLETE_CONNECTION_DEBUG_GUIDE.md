# 🎯 Complete Connection Debugging Guide

## The Real Problem

The `net::ERR_CONNECTION_REFUSED` error means your browser **cannot connect to the backend at all**. This is a **network-level error**, not a security error.

### Causes (In order of likelihood)

1. **🔴 Backend is not running** (95% chance)
   - You forgot to start `mvn spring-boot:run`
   - Backend crashed on startup
   - Backend is on a different port

2. **🟡 Wrong port** (3% chance)
   - Backend running on 8081 instead of 8080
   - Multiple backends running on different ports

3. **🟠 Firewall blocking** (1% chance)
   - Windows Firewall blocking port 8080
   - Antivirus blocking port 8080

4. **🟢 Security config** (1% chance)
   - But we just fixed this!

---

## Full Diagnostic Procedure

### Level 1: Is Backend Running?

```powershell
# Check what's running on port 8080
netstat -ano | findstr :8080

# This command will show:
# If listening: "TCP    127.0.0.1:8080    0.0.0.0:0    LISTENING    12345"
# If nothing:   (no output = not running)
```

**Result:**
- ✅ Shows LISTENING → Go to Level 2
- ❌ No output → Backend not running → Jump to "Starting Backend" section

---

### Level 2: Is Backend Responding?

```powershell
# Try to reach the backend
curl -v http://localhost:8080/api/auth/verify-token

# This will show connection details
```

**Look for:**
- ✅ `< HTTP/1.1 200 OK` or `< HTTP/1.1 401` → Backend is responding
- ❌ `Failed to connect` or `Connection refused` → Network issue
- ❌ `timeout` → Backend is not responding (might be stuck)

---

### Level 3: Check Backend Logs

When running `mvn spring-boot:run`, look for:

```
[Main] INFO  - Spring Boot application started successfully
[Main] INFO  - Tomcat started on port(s): 8080 (http) with context path '/api'
[Main] INFO  - Application startup completed in X.XXX seconds
```

**If you see instead:**

```
Failed to bind to port 8080: Address already in use
```
→ Another process is using port 8080 → Kill it and retry

```
hibernate.hbm2ddl.auto: validate failed
```
→ Database schema issue → Check PostgreSQL

```
Could not find the PostgreSQL driver
```
→ Dependencies not installed → Run `mvn clean install`

---

### Level 4: Test Database

```powershell
# Connect to PostgreSQL
psql -U postgres -d furniture

# If successful, you see: "furniture=>"
# If fails: Check PostgreSQL installation/service
```

**In PostgreSQL:**
```sql
-- Check if furniture database exists
\l

-- Check if users table exists
\dt

-- Exit
\q
```

---

## Starting Your Backend (Complete Steps)

### Step 1: Open New Terminal Window
```powershell
# Use PowerShell or Command Prompt
# Navigate to backend
cd D:\Github_Copilot_website\ecommerce-backend\furniture
```

### Step 2: Clean Build (First Time Only)
```powershell
# Clean previous build
mvn clean install -DskipTests

# This takes 2-3 minutes
```

### Step 3: Start Backend
```powershell
# Run the application
mvn spring-boot:run
```

### Step 4: Wait for Success Message
```
[Main] INFO  - Spring Boot application started successfully
[Main] INFO  - Tomcat started on port(s): 8080 (http) with context path '/api'
```

**Important:** Keep this terminal open!

### Step 5: Test in Another Terminal
```powershell
# Open NEW terminal (don't close the first one)
curl http://localhost:8080/api/auth/verify-token

# Should return:
# {"success":true,"message":"Token is valid"}
```

---

## Testing Registration Endpoint

### Test 1: CORS Preflight Request
```powershell
curl -X OPTIONS http://localhost:8080/api/auth/register `
  -H "Origin: http://localhost:5173" `
  -H "Access-Control-Request-Method: POST" `
  -H "Access-Control-Request-Headers: content-type" `
  -v
```

**Expected Response:**
```
< HTTP/1.1 200
< Access-Control-Allow-Origin: http://localhost:5173
< Access-Control-Allow-Methods: GET, POST, PUT, DELETE, PATCH, OPTIONS
```

### Test 2: Actual Registration
```powershell
curl -X POST http://localhost:8080/api/auth/register `
  -H "Content-Type: application/json" `
  -H "Origin: http://localhost:5173" `
  -d '{
    "name": "Test User",
    "email": "test123@example.com",
    "password": "TestPass123!",
    "confirmPassword": "TestPass123!"
  }' `
  -v
```

**Expected Response:**
```
< HTTP/1.1 201
< Access-Control-Allow-Origin: http://localhost:5173
{
  "success": true,
  "message": "Registration successful",
  "data": {
    "accessToken": "eyJhbGc...",
    "refreshToken": "eyJhbGc...",
    "user": {...}
  }
}
```

---

## Frontend Testing

### Test in Browser

1. **Open Developer Tools:** F12
2. **Go to Network Tab**
3. **Clear Network Log:** (Trash icon)
4. **Navigate to:** `http://localhost:5173/register`
5. **Fill Form:**
   - Name: Test User
   - Email: test@example.com
   - Password: TestPass123!
   - Confirm: TestPass123!
6. **Click Register**
7. **Watch Network Tab:**

**You should see:**
1. First request: `OPTIONS register` → Status 200
2. Second request: `POST register` → Status 201
3. Response contains `accessToken`

**If you see:**
- ❌ `register` → (pending, never completes)
  - Backend not running
- ❌ `register` → Status `(failed)`
  - Check backend logs for error
- ❌ No requests at all
  - Frontend form has validation error

---

## Troubleshooting by Symptom

### Symptom 1: Browser shows "Connection refused"
```
Your fix:
1. Check: netstat -ano | findstr :8080
2. If not listening: mvn spring-boot:run
3. If can't start: Check PostgreSQL and logs
```

### Symptom 2: Backend starts but returns 500 error
```
Your fix:
1. Check backend logs for exception
2. Usually database issue
3. Verify PostgreSQL is running: psql -U postgres -d furniture
```

### Symptom 3: Preflight succeeds but POST fails
```
Your fix:
1. Check the actual POST response in DevTools
2. Read the error message
3. Common: "Email already registered" - use different email
```

### Symptom 4: Everything works once, then fails
```
Your fix:
1. Database might have constraint issue
2. Try with different email address
3. Check PostgreSQL for duplicate emails
```

---

## Configuration Summary

### Backend (Already Configured ✅)
- **Port:** 8080
- **Context Path:** `/api`
- **CORS:** Allows `http://localhost:5173`
- **Security:** `/api/auth/**` endpoints public
- **Database:** PostgreSQL on `localhost:5432`

### Frontend (Already Configured ✅)
- **API URL:** `http://localhost:8080/api`
- **Port:** 5173
- **Register endpoint:** POST `/auth/register`

### What We Fixed ✅
1. **RegisterPage.tsx:** Added `confirmPassword` field
2. **RegisterPage_New.tsx:** Added `confirmPassword` field
3. **.env:** Changed URL from 8000 to 8080
4. **SecurityConfig.java:** Added explicit OPTIONS method matcher

---

## Terminal Commands Cheat Sheet

```powershell
# Start Backend
cd D:\Github_Copilot_website\ecommerce-backend\furniture
mvn spring-boot:run

# Start Frontend (in another terminal)
cd D:\Github_Copilot_website\ecommerce-frontend
npx vite

# Test Backend Connectivity
curl http://localhost:8080/api/auth/verify-token

# Test Registration
curl -X POST http://localhost:8080/api/auth/register ^
  -H "Content-Type: application/json" ^
  -d "{\"name\":\"Test\",\"email\":\"test@example.com\",\"password\":\"Test123!\",\"confirmPassword\":\"Test123!\"}"

# Check Port 8080
netstat -ano | findstr :8080

# Kill Process on Port 8080
taskkill /PID <PID> /F

# Connect to Database
psql -U postgres -d furniture
```

---

## Expected Network Flow

```
1. User clicks Register button
   ↓
2. Browser sends OPTIONS /api/auth/register
   ↓ (CORS preflight)
   ↓
3. Backend responds with 200 + CORS headers
   ↓
4. Browser sees "OK", sends POST /api/auth/register
   ↓ (Actual request)
   ↓
5. Backend receives POST
   ↓
6. AuthController.register() processes it
   ↓
7. User is created, tokens generated
   ↓
8. Backend responds with 201 + tokens
   ↓
9. Frontend receives response
   ↓
10. Frontend stores tokens, shows success
    ↓
11. User redirected to dashboard
```

---

## ✅ What You Should Do Now

1. **Check if backend is running:**
   ```
   netstat -ano | findstr :8080
   ```

2. **If not running, start it:**
   ```
   mvn spring-boot:run
   ```

3. **If can't start, check PostgreSQL:**
   ```
   psql -U postgres -d furniture
   ```

4. **Once backend is running, test registration at:**
   ```
   http://localhost:5173/register
   ```

---

## Still Having Issues?

Provide these details:

1. **What terminal output do you see?**
   - When running `mvn spring-boot:run`

2. **What curl output do you get?**
   ```
   curl http://localhost:8080/api/auth/verify-token
   ```

3. **What's on port 8080?**
   ```
   netstat -ano | findstr :8080
   ```

4. **Is PostgreSQL running?**
   ```
   psql -U postgres -d furniture
   ```

5. **What's in browser DevTools Network tab?**
   - Screenshot of the request that fails

---

**Status:** All code fixes applied. Backend now needs to be running.

