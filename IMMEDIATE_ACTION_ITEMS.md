# 📋 Action Items - Get Your App Running Now

## ✅ What Has Been Fixed

- [x] **RegisterPage.tsx** - Added missing `confirmPassword` field
- [x] **RegisterPage_New.tsx** - Added missing `confirmPassword` field
- [x] **.env** - Changed API URL from 8000 to 8080

All code changes have been applied. No manual code editing needed!

---

## 🚀 Next Steps (What YOU Need to Do)

### Step 1️⃣: Restart Frontend Dev Server
```powershell
# Stop current server
# Press Ctrl+C in the terminal running Vite

# Restart it
cd D:\Github_Copilot_website\ecommerce-frontend
npx vite
```

**Why:** To load the updated `.env` file with correct API URL

**Expected:** Server should start on http://localhost:5173

---

### Step 2️⃣: Ensure Backend is Running
```powershell
# In a separate terminal
cd D:\Github_Copilot_website\ecommerce-backend\furniture
mvn spring-boot:run
```

**Why:** Backend must be running on port 8080 for frontend to connect

**Expected:** You should see "Tomcat started on port(s): 8080"

---

### Step 3️⃣: Verify PostgreSQL is Running
```powershell
# Test database connection
psql -U postgres -d furniture
```

**Why:** Backend needs the database to function

**Expected:** Should connect without errors (type `\q` to exit)

---

### Step 4️⃣: Test Registration
1. Open browser to http://localhost:5173/register
2. Fill in the form:
   - **Name:** John Doe (or any name)
   - **Email:** john@example.com (unique email)
   - **Password:** TestPassword123! (strong password)
   - **Confirm:** TestPassword123! (must match)
3. Click **Register** button
4. Should see success message ✅

---

### Step 5️⃣: Verify the Fix (Optional but Recommended)

#### In Browser DevTools (F12):
1. Open Network tab
2. Click Register button
3. Look for request to:
   - **URL:** `http://localhost:8080/api/auth/register` ✅
   - **Method:** POST ✅
   - **Status:** 201 Created ✅
4. Click on request → Response tab
5. Should see:
   ```json
   {
     "success": true,
     "data": {
       "accessToken": "...",
       "user": { "name": "John Doe", ... }
     }
   }
   ```

---

## 📊 Services Status Checklist

Before testing, ensure all services are running:

- [ ] **Backend** running on http://localhost:8080
  ```powershell
  cd ecommerce-backend/furniture && mvn spring-boot:run
  ```

- [ ] **Frontend** running on http://localhost:5173
  ```powershell
  cd ecommerce-frontend && npx vite
  ```

- [ ] **PostgreSQL** running and database exists
  ```powershell
  psql -U postgres -d furniture
  ```

---

## 🎯 Expected Results

### Success Indicators ✅
- ✅ No connection errors
- ✅ Form submits without errors
- ✅ See "Registration successful" message
- ✅ Redirected to dashboard
- ✅ User email appears in user menu

### What Happens Behind the Scenes
1. Frontend sends complete data to backend
2. Backend validates all fields
3. Backend checks email not already used
4. Backend creates user with hashed password
5. Backend creates shopping cart for user
6. Backend generates JWT tokens
7. Frontend stores tokens
8. User is logged in automatically
9. App redirects to dashboard

---

## 🆘 If Something Goes Wrong

### Error: `net::ERR_CONNECTION_REFUSED`
```powershell
# Solution: Backend not running
cd ecommerce-backend/furniture
mvn spring-boot:run
```

### Error: `CORS error`
```powershell
# Solution: Restart frontend to load new .env
# Press Ctrl+C to stop
# Then: npx vite
```

### Error: `Email already registered`
```
# Use a different email address
# Or clear database and restart
```

### Error: `Passwords do not match`
```
# Make sure both password fields are identical
# No typos or extra spaces
```

### Backend shows `User role not found`
```sql
-- Connect to database and check roles
psql -U postgres -d furniture

-- Insert default roles if missing
INSERT INTO roles (name) VALUES ('USER');
INSERT INTO roles (name) VALUES ('ADMIN');
```

---

## 📞 Quick Reference

| Service | URL | Port | Status |
|---------|-----|------|--------|
| **Frontend** | http://localhost:5173 | 5173 | Should be running |
| **Backend API** | http://localhost:8080/api | 8080 | Should be running |
| **PostgreSQL** | localhost | 5432 | Should be running |
| **Swagger API Docs** | http://localhost:8080/api/swagger-ui.html | 8080 | Available when backend running |

---

## 📝 Summary of Changes

| File | Change | Reason |
|------|--------|--------|
| RegisterPage.tsx | + `confirmPassword` field | Backend requires it |
| RegisterPage_New.tsx | + `confirmPassword` field | Backend requires it |
| .env | URL: 8000 → 8080 | Backend port is 8080 |

---

## ✨ You're All Set!

All technical fixes have been applied. Now just:
1. Restart frontend dev server
2. Ensure backend is running
3. Test registration

**That's it! Your registration endpoint should work now.** 🚀

---

## 💡 Pro Tips

**Tip 1:** Keep three terminal windows open
- One for backend
- One for frontend
- One for occasional database queries

**Tip 2:** Use browser DevTools to monitor requests
- Press F12 to open DevTools
- Go to Network tab
- See exactly what's being sent and received

**Tip 3:** Check backend logs for errors
- Backend logs will show what went wrong
- Copy-paste error messages into terminal for debugging

**Tip 4:** Clear browser cache if issues persist
- Ctrl+Shift+Delete in most browsers
- Select "All time"
- Check "Cookies and cached images"

---

**Ready to go? Start with Step 1 above!** ✅

