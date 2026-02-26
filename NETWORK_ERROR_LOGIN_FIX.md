# 🔧 Network Error Fix - Login API Connection Issue

## ❌ Problem
```
Network Error: Network Error
POST http://localhost:8080/api/auth/login net::ERR_FAILED
```

## 🔍 Root Causes (Check in Order)

### 1. **Backend is NOT Running** (Most Common)
**Symptom:** `net::ERR_FAILED` error in console
**Solution:** Start the backend server

### 2. **Wrong Port**
**Check:** Is backend running on port 8080?

### 3. **CORS Issues**
**Check:** Backend CORS configuration allows localhost:5173

### 4. **Firewall/Network**
**Check:** Network connectivity between frontend and backend

---

## ✅ Quick Fix Steps

### Step 1: Start the Backend

Open **NEW Terminal** (don't close frontend):

```powershell
cd D:\Github_Copilot_website\ecommerce-backend\furniture

# Option A: Run with Maven (if not built)
mvn spring-boot:run

# Option B: Run JAR (if built)
java -jar target/furniture-0.0.1-SNAPSHOT.jar
```

**Expected Output:**
```
...
Tomcat started on port(s): 8080 (http)
Started FurnitureApplication in X.XXX seconds
```

### Step 2: Verify Backend is Running

In a NEW terminal, test the API:

```powershell
# Test if backend is responding
curl -X GET http://localhost:8080/api/auth/verify-token

# Or in PowerShell
Invoke-WebRequest -Uri "http://localhost:8080/api/auth/verify-token" -Method GET
```

**Expected:** Response (even if 401 Unauthorized is okay - it means server is up)

### Step 3: Verify Frontend Configuration

Check that `.env` has correct URL:

```dotenv
VITE_API_BASE_URL=http://localhost:8080/api
```

### Step 4: Reload Frontend

In browser:
```
1. Hard refresh: Ctrl + Shift + Delete (clear cache)
2. Go to http://localhost:5173/login
3. Try login again
```

---

## 🚀 Complete Startup Sequence

**Terminal 1 - Backend:**
```powershell
cd D:\Github_Copilot_website\ecommerce-backend\furniture

# Check if JAR exists
ls target\furniture-0.0.1-SNAPSHOT.jar

# If JAR doesn't exist, build it first:
mvn clean package -DskipTests

# Run the JAR
java -jar target\furniture-0.0.1-SNAPSHOT.jar
```

**Wait for output:**
```
...
Tomcat started on port(s): 8080 (http)
Started FurnitureApplication in 15.234 seconds
```

**Terminal 2 - Frontend:**
```powershell
cd D:\Github_Copilot_website\ecommerce-frontend

# Clear node_modules cache (optional but recommended)
npm cache clean --force

# Start dev server
npm run dev
```

**Wait for output:**
```
  ➜  Local:   http://localhost:5173/
```

**Terminal 3 - Verify Connection:**
```powershell
# Test backend is reachable
Invoke-WebRequest -Uri "http://localhost:8080/api/auth/verify-token" -Method GET -Headers @{"Authorization"="Bearer test"}
```

---

## 📋 Troubleshooting Checklist

### Backend Issues

- [ ] Backend JAR exists: `D:\Github_Copilot_website\ecommerce-backend\furniture\target\furniture-0.0.1-SNAPSHOT.jar`
  - If not, run: `mvn clean package -DskipTests`
  
- [ ] Backend is running: Port 8080 is listening
  - Check: `netstat -ano | findstr :8080` (Windows)
  
- [ ] Database is accessible: PostgreSQL running
  - Check: Test connection to furniture database
  
- [ ] Correct startup command
  ```powershell
  java -jar target/furniture-0.0.1-SNAPSHOT.jar
  ```

### Frontend Issues

- [ ] Correct API URL in .env
  ```dotenv
  VITE_API_BASE_URL=http://localhost:8080/api
  ```

- [ ] Frontend dev server running on port 5173
  - Check: `http://localhost:5173` opens in browser
  
- [ ] Browser cache cleared
  - Use: Ctrl + Shift + Delete

### Network Issues

- [ ] No VPN blocking localhost connections
- [ ] Firewall not blocking port 8080
- [ ] No other service using port 8080
  ```powershell
  netstat -ano | findstr :8080
  ```

---

## 🔍 Common Error Messages & Solutions

### Error: "Cannot connect to database"
```
Caused by: java.sql.SQLException: Connection refused
```
**Solution:** 
```powershell
# Start PostgreSQL
pg_ctl start -D "C:\Program Files\PostgreSQL\15\data"
# Or restart PostgreSQL service
```

### Error: "Address already in use: bind"
```
java.net.BindException: Address already in use
```
**Solution:**
```powershell
# Kill process using port 8080
netstat -ano | findstr :8080
taskkill /PID <PID> /F

# OR use different port
java -jar target/furniture-0.0.1-SNAPSHOT.jar --server.port=8081
```

### Error: "404 Not Found"
```
POST http://localhost:8080/api/auth/login 404 (Not Found)
```
**Solution:**
- Check URL spelling: `/api/auth/login` not `/api/auth/Login`
- Check endpoint exists in AuthController.java
- Check application.properties for context path

### Error: "CORS error"
```
Access to XMLHttpRequest blocked by CORS policy
```
**Solution:** Check SecurityConfig.java has:
```java
.cors(withDefaults())
configuration.setAllowedOrigins(Arrays.asList("http://localhost:5173"));
```

---

## ✅ Verify Everything Works

### Test 1: Backend is Running
```powershell
# Should return 401 (unauthorized) - but server responds
curl -X GET http://localhost:8080/api/auth/verify-token
```

### Test 2: Frontend Can Call Backend
Open browser DevTools (F12) → Network tab:
1. Go to http://localhost:5173/login
2. Enter any email/password
3. Look at Network tab
4. Should see POST to `http://localhost:8080/api/auth/login`
5. Should see Response (even if error)

### Test 3: Login Works
```
Email: admin@example.com
Password: admin123
```
(Use any registered user credentials)

---

## 📝 Full Setup Instructions

### First Time Setup

```powershell
# 1. Build Backend
cd D:\Github_Copilot_website\ecommerce-backend\furniture
mvn clean package -DskipTests

# 2. Install Frontend Dependencies
cd D:\Github_Copilot_website\ecommerce-frontend
npm install

# 3. Ensure Database is Running
# (PostgreSQL should be running with 'furniture' database)
```

### Daily Startup (3 Terminals)

**Terminal 1:**
```powershell
cd D:\Github_Copilot_website\ecommerce-backend\furniture
java -jar target/furniture-0.0.1-SNAPSHOT.jar
```

**Terminal 2:**
```powershell
cd D:\Github_Copilot_website\ecommerce-frontend
npm run dev
```

**Terminal 3:**
```powershell
# Just for testing/monitoring
# Leave empty or use for debugging
```

---

## 🎯 Expected Behavior After Fix

### Before Fix
```
❌ Network Error when clicking login
❌ API call fails with net::ERR_FAILED
```

### After Fix
```
✅ Click login button
✅ Loading spinner appears
✅ API call succeeds or returns proper error
✅ Shows appropriate message (success or validation error)
```

---

## 💡 Pro Tips

1. **Check logs in real-time:**
   - Backend logs show request details
   - Frontend DevTools → Console shows errors

2. **Use Postman to test API:**
   - Test POST /api/auth/login
   - Without frontend complexity

3. **Keep terminals open:**
   - Backend Terminal: Check for errors
   - Frontend Terminal: Check for build errors
   - One more for debugging

---

## 📞 If Still Not Working

1. **Check Backend Console:**
   - Are there any error messages?
   - Is it waiting for database?
   - Is port 8080 actually bound?

2. **Check Frontend Console (F12):**
   - What's the exact error?
   - Is the API URL correct?
   - Are there CORS errors?

3. **Test API Directly:**
   ```powershell
   curl -X POST http://localhost:8080/api/auth/login `
     -H "Content-Type: application/json" `
     -d '{"email":"test@example.com","password":"test123"}'
   ```

4. **Check Network Tab:**
   - Is request being sent?
   - Is it reaching backend?
   - What's the response?

---

**Status:** Follow steps above to fix the network error ✅
**Time:** Should take 2-5 minutes to fix
**Next:** After fixing, you can login and test the application

