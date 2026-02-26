# ⚡ Quick Action Guide - Login Fix

## Problem ❌
```
Login fails with: "Network Error"
Backend logs show: "LocalDateTime not supported by default"
```

## Solution ✅
Added `jackson-datatype-jsr310` dependency to backend

## What Was Done

| Action | Status | File |
|--------|--------|------|
| Add dependency to pom.xml | ✅ DONE | `ecommerce-backend/furniture/pom.xml` |
| Build backend with Maven | ✅ DONE | `mvn clean package -DskipTests` |
| Create new JAR | ✅ DONE | `furniture-0.0.1-SNAPSHOT.jar` |

## Start Backend

### Terminal 1 - Backend
```powershell
cd D:\Github_Copilot_website\ecommerce-backend\furniture
java -jar target/furniture-0.0.1-SNAPSHOT.jar
```

Wait for:
```
Tomcat started on port(s): 8080 (http)
Started FurnitureApplication in X.XXX seconds
```

### Terminal 2 - Frontend
```powershell
cd D:\Github_Copilot_website\ecommerce-frontend
npm run dev
```

## Test the Fix

1. Go to: `http://localhost:5173/login`
2. Enter credentials: `jaikarthick3@gmail.com` / `password`
3. Should see: ✅ Successful login → Dashboard
4. Should NOT see: ❌ Network Error

## Expected Result

**Before:**
```
❌ Login clicked
❌ "Network Error" message
❌ Network tab shows 500 error
```

**After:**
```
✅ Login clicked
✅ "Redirecting to dashboard" or similar
✅ Network tab shows 200 OK
```

## Verify Response Structure

The login response now includes timestamps:

```json
{
  "success": true,
  "message": "Login successful",
  "timestamp": "2026-02-26T22:46:54.123456",
  "data": {
    "token": "eyJ...",
    "user": {
      "id": 1,
      "email": "jaikarthick3@gmail.com",
      "createdAt": "2026-01-15T10:30:00",
      "roles": ["USER"]
    }
  }
}
```

## Change Made

```xml
<!-- Added to pom.xml -->
<dependency>
    <groupId>com.fasterxml.jackson.datatype</groupId>
    <artifactId>jackson-datatype-jsr310</artifactId>
</dependency>
```

That's it! This single dependency enables JSON serialization of Java date/time types.

---

## Troubleshooting

### Backend won't start?
- Ensure PostgreSQL is running
- Check port 8080 is free: `netstat -ano | findstr :8080`

### Still getting Network Error?
- Hard refresh browser: `Ctrl + Shift + Delete`
- Rebuild frontend: `npm cache clean --force && npm run dev`

### Need to rebuild backend?
```powershell
cd D:\Github_Copilot_website\ecommerce-backend\furniture
mvn clean package -DskipTests
java -jar target/furniture-0.0.1-SNAPSHOT.jar
```

---

**Status:** Ready to test ✅

