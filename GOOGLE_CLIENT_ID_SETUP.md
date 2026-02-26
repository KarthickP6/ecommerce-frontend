# 🔐 Google OAuth Client ID - Step-by-Step Setup Guide

## 🎯 Goal
Get your Google OAuth 2.0 Client ID to enable Google login/signup on your e-commerce platform.

---

## ⏱️ Time Required: 5-10 minutes

---

## Step 1: Create a Google Cloud Project

### 1.1 Go to Google Cloud Console
- Open: https://console.cloud.google.com/
- Click "Select a Project" at the top
- Click "NEW PROJECT"

### 1.2 Create Project
- **Project Name:** `Ecommerce Furniture` (or your preferred name)
- **Organization:** (Leave as default if you don't have one)
- Click "CREATE"

### 1.3 Wait for Project Creation
- Google will create the project (may take 1-2 minutes)
- You'll see a notification when complete
- New project will automatically be selected

---

## Step 2: Enable Google+ API

### 2.1 Go to APIs & Services
- In the left sidebar, click "APIs & Services"
- Click "Library"

### 2.2 Search for Google+ API
- In the search box, type `Google+ API` (or `googleapis`)
- Click on "Google+ API" from results

### 2.3 Enable the API
- Click the blue "ENABLE" button
- Wait for confirmation (should see checkmark)

---

## Step 3: Create OAuth 2.0 Credentials

### 3.1 Go to Credentials
- In the left sidebar, click "Credentials"
- Click "CREATE CREDENTIALS" button (blue button)
- Select "OAuth 2.0 Client ID"

### 3.2 Configure Consent Screen (First Time Only)

If prompted to configure the OAuth consent screen:

1. Click "CONFIGURE CONSENT SCREEN"
2. Select **User Type: External** (for development)
3. Click "CREATE"

#### Fill in the form:
- **App name:** `Ecommerce Furniture`
- **User support email:** your-email@gmail.com (required)
- **Developer contact info:** your-email@gmail.com (required)
- Click "SAVE AND CONTINUE"

#### On "Scopes" page:
- Click "SAVE AND CONTINUE" (defaults are fine)

#### On "Test users" page:
- Click "ADD USERS"
- Add your Google email address
- Click "SAVE AND CONTINUE"

#### Review and confirm
- Click "BACK TO DASHBOARD"

### 3.3 Create OAuth 2.0 Client ID (Again)
- Go back to "Credentials" page
- Click "CREATE CREDENTIALS"
- Select "OAuth 2.0 Client ID"

---

## Step 4: Configure Application Details

### 4.1 Select Application Type
- **Application type:** Select "Web application"

### 4.2 Add Application Name
- **Name:** `Ecommerce Furniture Web App` (or your name)

### 4.3 Add Authorized Redirect URIs (IMPORTANT!)

Under "Authorized redirect URIs", click "ADD URI" and add these:

**For Development:**
```
http://localhost:5173
http://localhost:5173/
```

**For Production (add later):**
```
https://yourdomain.com
https://yourdomain.com/
```

### 4.4 Create Credentials
- Click "CREATE"
- A popup will appear with your credentials

---

## Step 5: Copy Your Client ID

### 5.1 View Your Credentials
A dialog will show:
- **Client ID** (this is what you need!)
- **Client Secret** (keep this safe!)

### 5.2 Copy the Client ID
- Click the copy icon next to Client ID
- Or select and copy manually
- **Example format:** `123456789-abc123xyz.apps.googleusercontent.com`

### 5.3 Store Safely
- Save this in a text file for reference
- You'll need it in the next step

---

## Step 6: Configure Frontend with Client ID

### 6.1 Update Environment File
Navigate to your frontend folder:
```powershell
cd D:\Github_Copilot_website\ecommerce-frontend
```

### 6.2 Edit .env File
Open `.env` file in your editor and update:

**BEFORE:**
```dotenv
VITE_API_BASE_URL=http://localhost:8080/api
VITE_API_TIMEOUT=30000
VITE_GOOGLE_CLIENT_ID=YOUR_GOOGLE_CLIENT_ID_HERE
```

**AFTER:**
```dotenv
VITE_API_BASE_URL=http://localhost:8080/api
VITE_API_TIMEOUT=30000
VITE_GOOGLE_CLIENT_ID=123456789-abc123xyz.apps.googleusercontent.com
```

Replace `123456789-abc123xyz.apps.googleusercontent.com` with YOUR actual Client ID.

### 6.3 Save the File
- Use Ctrl+S to save
- Make sure there are no extra spaces

---

## Step 7: Verify Setup

### 7.1 Install Dependencies (if not done)
```powershell
cd D:\Github_Copilot_website\ecommerce-frontend
npm install
```

### 7.2 Run Frontend
```powershell
npm run dev
```

### 7.3 Test Google Login
- Open `http://localhost:5173/login`
- Click the "Google" button
- If Google popup appears → ✅ Setup successful!

---

## ✅ Verification Checklist

- [ ] Created Google Cloud Project
- [ ] Enabled Google+ API
- [ ] Created OAuth 2.0 Client ID
- [ ] Added `http://localhost:5173` to Authorized Redirect URIs
- [ ] Copied Client ID
- [ ] Updated `.env` file with Client ID
- [ ] Restarted frontend dev server
- [ ] Google login button works

---

## 🔄 If You Need to Regenerate

If something goes wrong:

### Option 1: Update Redirect URIs
1. Go to https://console.cloud.google.com/
2. Select your project
3. Go to "Credentials"
4. Click on your OAuth 2.0 Client ID
5. Under "Authorized redirect URIs", add/remove URIs as needed
6. Click "SAVE"

### Option 2: Create New Client ID
1. Go to Credentials
2. Delete the old Client ID (⋮ menu → Delete)
3. Create a new one following steps 4-6 above

### Option 3: Reset Everything
1. Delete the project
2. Create a new one from Step 1
3. Repeat all steps

---

## 🚨 Common Issues & Solutions

### Issue: "Google login button doesn't work"
**Solution:**
1. Check `.env` file has the correct Client ID
2. Check `http://localhost:5173` is in Google's Authorized URIs
3. Restart frontend: `npm run dev`
4. Clear browser cache (Ctrl+Shift+Delete)

### Issue: "Popup blocked"
**Solution:**
- Browser may be blocking popups
- Check browser's popup settings
- Whitelist localhost

### Issue: "Invalid Client ID"
**Solution:**
1. Double-check you copied the full Client ID
2. No extra spaces before/after
3. Wrong project selected? Check Google Cloud console

### Issue: "Redirect URI mismatch"
**Solution:**
- Make sure `http://localhost:5173` is in Google console
- Check spelling and port number (5173, not 5000 or 3000)
- Restart dev server after updating `.env`

### Issue: "First time login hangs"
**Solution:**
- Normal behavior - consent screen may appear
- Allow access when prompted
- May take 30 seconds first time

---

## 📝 Security Best Practices

### Do's ✅
- ✅ Keep Client ID in `.env` file
- ✅ Add `http://localhost:5173` for development
- ✅ Use HTTPS in production
- ✅ Add production domain to Authorized URIs before deploying
- ✅ Keep Client Secret safe (don't expose in frontend code)

### Don'ts ❌
- ❌ Don't commit `.env` file to Git
- ❌ Don't share Client Secret publicly
- ❌ Don't add unauthorized URIs
- ❌ Don't use same credentials across projects

---

## 🌍 For Production Deployment

When deploying to production:

### 1. Update Google Console
- Add your production domain to Authorized URIs:
  ```
  https://yourdomain.com
  https://yourdomain.com/
  ```

### 2. Update Environment
- Create production `.env`:
  ```dotenv
  VITE_API_BASE_URL=https://api.yourdomain.com
  VITE_GOOGLE_CLIENT_ID=same-client-id-or-new-one
  ```

### 3. Build & Deploy
```powershell
npm run build
# Deploy dist folder to your server
```

---

## 📚 Additional Resources

- Google OAuth Documentation: https://developers.google.com/identity
- Google Cloud Console: https://console.cloud.google.com/
- Sign-In Button Customization: https://developers.google.com/identity/gsi/web
- Troubleshooting: https://developers.google.com/identity/sign-in/web/troubleshooting

---

## ✨ You're All Set!

Once you've completed all steps:
1. ✅ Google Client ID is configured
2. ✅ Frontend can use Google OAuth
3. ✅ Users can login/signup with Google
4. ✅ Dashboard shows user information

**Enjoy hassle-free Google authentication! 🎉**

---

**Questions?** Check the main documentation files:
- `GOOGLE_OAUTH_IMPLEMENTATION_COMPLETE.md`
- `COMPLETE_TESTING_GUIDE.md`
- `IMPLEMENTATION_SUMMARY_COMPLETE.md`

