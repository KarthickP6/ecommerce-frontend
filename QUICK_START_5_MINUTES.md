# 🚀 QUICK START - Get Running in 5 Minutes

## Prerequisites Check ✅
- [ ] PostgreSQL running with `furniture` database
- [ ] Node.js installed (for frontend)
- [ ] Maven installed (for backend)
- [ ] Google account (for OAuth testing)

---

## Step 1: Get Google Client ID (3 minutes)

### 1.1 Go to Google Cloud Console
```
https://console.cloud.google.com/
```

### 1.2 Create OAuth Credentials
1. Create new project (or use existing)
2. Enable Google+ API
3. Create OAuth 2.0 Client ID (Web application)
4. Add `http://localhost:5173` to Authorized Redirect URIs
5. Copy your Client ID

**Example Client ID:** `123456789-abc123xyz.apps.googleusercontent.com`

---

## Step 2: Update Configuration (1 minute)

### Update Frontend .env File

File: `D:\Github_Copilot_website\ecommerce-frontend\.env`

**Replace this:**
```dotenv
VITE_GOOGLE_CLIENT_ID=YOUR_GOOGLE_CLIENT_ID_HERE
```

**With your actual Client ID:**
```dotenv
VITE_GOOGLE_CLIENT_ID=123456789-abc123xyz.apps.googleusercontent.com
```

---

## Step 3: Install Dependencies (1 minute)

```powershell
cd D:\Github_Copilot_website\ecommerce-frontend
npm install
```

---

## Step 4: Run the Application (2 minutes)

### Terminal 1: Start Backend
```powershell
cd D:\Github_Copilot_website\ecommerce-backend\furniture
mvn spring-boot:run

# Wait for: "Started FurnitureApplication in X.XXX seconds"
```

### Terminal 2: Start Frontend
```powershell
cd D:\Github_Copilot_website\ecommerce-frontend
npm run dev

# You'll see: "  ➜  Local:   http://localhost:5173/"
```

---

## Step 5: Test It! (Open Browser)

### Open in Browser:
```
http://localhost:5173/register
```

### Quick Test Flow:
1. **Register with Email**
   - Fill form
   - Submit
   - See "Registration successful! Please login to continue."
   - Redirected to login page ✅

2. **Google Sign Up**
   - Click "Google" button
   - Select Google account
   - Redirected to dashboard ✅
   - See your name in welcome message ✅

3. **Google Login**
   - Go to `/login`
   - Click "Google" button
   - See dashboard content ✅

4. **Dashboard Features**
   - See 6 feature cards
   - Click any card
   - Navigate to feature ✅

---

## ✅ Success Indicators

You'll see:
- ✅ Google popup opens when clicking Google button
- ✅ After OAuth, redirect to dashboard
- ✅ Dashboard shows your name and email
- ✅ 6 feature cards with clickable links
- ✅ No errors in browser console
- ✅ No errors in terminal

---

## 🐛 If Something Doesn't Work

### Issue: Google button doesn't work
```
Solution:
1. Check VITE_GOOGLE_CLIENT_ID in .env
2. Restart frontend: Ctrl+C, then npm run dev
3. Clear browser cache: Ctrl+Shift+Delete
```

### Issue: Cannot connect to backend
```
Solution:
1. Check backend is running: mvn spring-boot:run
2. Check port 8080 is available
3. Restart backend
```

### Issue: Database error
```
Solution:
1. Check PostgreSQL is running
2. Check furniture database exists
3. Check connection string in application.yml
```

### Issue: Blank dashboard
```
Solution:
1. Reload browser: Ctrl+F5 (hard refresh)
2. Clear localStorage: F12 → Application → Clear All
3. Login again
```

---

## 📚 Documentation Guide

| I want to... | Read this |
|---|---|
| Get overview | IMPLEMENTATION_SUMMARY_COMPLETE.md |
| Understand architecture | GOOGLE_OAUTH_IMPLEMENTATION_COMPLETE.md |
| Test thoroughly | COMPLETE_TESTING_GUIDE.md |
| Find quick reference | DEVELOPER_QUICK_REFERENCE.md |
| Setup Google credentials | GOOGLE_CLIENT_ID_SETUP.md |
| Navigation | DOCUMENTATION_INDEX_OAUTH.md |

---

## 🎯 What You Can Do Now

✅ Register with email
✅ Register with Google
✅ Login with email
✅ Login with Google
✅ See user dashboard
✅ Navigate all features
✅ Logout safely

---

## 🚀 Next Steps (When Ready)

1. **Customize Dashboard**
   - Edit UserDashboardPage.tsx
   - Add your branding
   - Change colors

2. **Add More Features**
   - Extend the dashboard cards
   - Add more OAuth providers
   - Implement more endpoints

3. **Deploy to Production**
   - Get production Google Client ID
   - Update domain in Google console
   - Update backend CORS
   - Build and deploy

---

## 💡 Pro Tips

### Tip 1: Test with Multiple Accounts
```
1. Register multiple users
2. Login with different accounts
3. Each gets their own dashboard
```

### Tip 2: Monitor Backend Logs
```
Watch terminal 1 for logs:
- User created messages
- OAuth token verification
- JWT generation
```

### Tip 3: Check Network Activity
```
F12 → Network tab
- See /api/auth/google POST request
- Check response status (200 = success)
- View response data
```

### Tip 4: Use Redux DevTools
```
F12 → Redux tab (if installed)
- View auth state
- See user object
- Check token storage
```

---

## ✨ That's It!

You now have:
✅ Full OAuth authentication
✅ Beautiful user dashboard
✅ Complete documentation
✅ Production-ready code

**Enjoy! 🎉**

---

## 📞 Need More Help?

See:
- **GOOGLE_OAUTH_IMPLEMENTATION_COMPLETE.md** - Full guide
- **COMPLETE_TESTING_GUIDE.md** - Test cases
- **DEVELOPER_QUICK_REFERENCE.md** - Quick lookup
- **DOCUMENTATION_INDEX_OAUTH.md** - All documentation

---

**Questions?** → Check the docs
**Something broken?** → Check Troubleshooting section above
**Want to customize?** → Edit source files (comments provided)

**You're all set! 🚀**

