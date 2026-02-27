# Azure Static Website Deployment - Complete Solution

## 📋 What Was Updated

Your GitHub Actions workflow has been updated from **Azure Static Web Apps** to **Azure Storage Static Website** deployment.

### Files Modified:
- ✅ `.github/workflows/azure-static-web-apps-deploy.yml` - Updated workflow

### Files Created:
- ✅ `AZURE_STATIC_WEBSITE_SETUP.md` - Complete setup guide
- ✅ `AZURE_STATIC_WEBSITE_QUICK_REFERENCE.md` - Quick reference with commands
- ✅ `GITHUB_ACTIONS_STORAGE_WEBSITE_GUIDE.md` - Migration & troubleshooting
- ✅ `setup-azure-static-website.sh` - Automated setup script

---

## 🎯 Key Differences

| Feature | Before (Static Web Apps) | After (Storage Website) |
|---------|--------------------------|------------------------|
| GitHub Action | `Azure/static-web-apps-deploy@v1` | `azure/login@v1` + `az storage` CLI |
| Secret Token | `AZURE_STATIC_WEB_APPS_API_TOKEN` | `AZURE_CREDENTIALS` (Service Principal) |
| Deployment Target | Static Web Apps service | Blob Storage `$web` container |
| Cost | ~$1-10/month | ~$0.50-2/month |
| Setup Complexity | Very Easy | Easy |
| Customization | Limited | High |

---

## ⚡ Quick Start (5 Minutes)

### Option A: Automated Setup (Recommended)

```bash
# 1. Make script executable
chmod +x setup-azure-static-website.sh

# 2. Run the setup script
./setup-azure-static-website.sh

# The script will:
# ✅ Validate prerequisites
# ✅ Create resource group
# ✅ Create storage account
# ✅ Enable static website hosting
# ✅ Create service principal
# ✅ Add GitHub secrets
# ✅ Verify everything works
```

### Option B: Manual Setup

1. **Create Resource Group**
   ```bash
   az group create --name my-rg --location eastus
   ```

2. **Create Storage Account**
   ```bash
   az storage account create \
     --name myappstg12345 \
     --resource-group my-rg \
     --sku Standard_LRS \
     --kind StorageV2
   ```

3. **Enable Static Website**
   ```bash
   az storage blob service-properties update \
     --account-name myappstg12345 \
     --static-website \
     --index-document index.html \
     --404-document index.html
   ```

4. **Create Service Principal**
   ```bash
   az ad sp create-for-rbac \
     --name github-actions-sp \
     --role contributor \
     --scopes /subscriptions/{subscription-id} \
     --json-auth
   ```

5. **Add GitHub Secrets**
   - Go to: **Settings → Secrets and variables → Actions**
   - Add 4 secrets (see table below)

6. **Get Storage Key**
   ```bash
   az storage account keys list \
     --account-name myappstg12345 \
     --query "[0].value" -o tsv
   ```

---

## 🔐 Required GitHub Secrets

### Add these to your GitHub repository:

| Secret Name | Value | Command to Get |
|---|---|---|
| `AZURE_CREDENTIALS` | Service Principal JSON | From `az ad sp create-for-rbac --json-auth` |
| `STORAGE_ACCOUNT_NAME` | Storage account name | `echo myappstg12345` |
| `STORAGE_ACCOUNT_KEY` | Primary access key | `az storage account keys list --query "[0].value"` |
| `AZURE_RESOURCE_GROUP` | Resource group name | `echo my-rg` |

**Optional (for CDN cache purge):**
| `CDN_PROFILE_NAME` | CDN profile name | From Azure Portal |
| `CDN_ENDPOINT_NAME` | CDN endpoint name | From Azure Portal |

---

## 🚀 How It Works

### Workflow Trigger:
```
You push to main branch
        ↓
GitHub Actions workflow starts
        ↓
1. Checkout code
2. Setup Node.js 20
3. Install npm dependencies
4. Build React + Vite app → dist/
5. Verify build output
6. Login to Azure
7. Verify storage account exists
8. Upload all files from dist/ to $web container
9. Get website URL
10. Verify deployment
11. (Optional) Purge CDN cache
12. Display summary
        ↓
Website is live at: https://{storage}.z13.web.core.windows.net
```

---

## ✅ Verify It's Working

### Check deployment status:
```bash
# List uploaded files
az storage blob list \
  --account-name myappstg12345 \
  --account-key "{access-key}" \
  --container-name '$web' \
  -o table

# Get website URL
az storage account show \
  --name myappstg12345 \
  --query "primaryEndpoints.web" -o tsv
```

### Test the website:
```bash
# Visit: https://myappstg12345.z13.web.core.windows.net
# Or use curl:
curl -I https://myappstg12345.z13.web.core.windows.net
```

---

## 📊 Workflow Execution

### View workflow in GitHub:
1. Go to **Actions** tab
2. Click latest workflow run
3. Expand each step to see logs
4. Look for ✅ (success) or ❌ (failure)

### Expected output:
```
✅ Checkout repository
✅ Set up Node.js
✅ Install dependencies
✅ Build application
✅ Verify build output
✅ Login to Azure
✅ Verify Azure Storage Account
✅ Deploy to Azure Storage Static Website
✅ Get Static Website URL
✅ Verify deployment
✅ Deployment Summary

🌐 Static Website URL: https://myappstg12345.z13.web.core.windows.net
```

---

## 🔧 Common Tasks

### Deploy manually (without pushing code):
```bash
# In GitHub Actions tab:
# 1. Click "Deploy React + Vite to Azure Static Website"
# 2. Click "Run workflow" dropdown
# 3. Click "Run workflow" button
```

### Clear deployed files:
```bash
az storage blob delete-batch \
  --account-name myappstg12345 \
  --account-key "{access-key}" \
  --source '$web'
```

### Set custom domain:
1. Add CNAME record: `app.yourdomain.com` → `myappstg12345.z13.web.core.windows.net`
2. In Azure Portal → Storage Account → Custom domain
3. Enter: `app.yourdomain.com`

### Enable HTTPS (via CDN):
```bash
# Create CDN profile
az cdn profile create \
  --resource-group my-rg \
  --name my-cdn \
  --sku Standard_Microsoft

# Create CDN endpoint
az cdn endpoint create \
  --resource-group my-rg \
  --profile-name my-cdn \
  --name my-endpoint \
  --origin myappstg12345.z13.web.core.windows.net
```

---

## 🐛 Troubleshooting

### Issue: "BadRequest - No matching Static Web App"
**Solution**: You're using the old Static Web Apps action. The workflow has been updated - just push your changes.

### Issue: "AuthenticationFailed - Invalid access key"
**Solution**: 
```bash
# Regenerate key
az storage account keys renew --account-name myappstg12345 --key primary

# Get new key and update GitHub secret
az storage account keys list --account-name myappstg12345 --query "[0].value" -o tsv
```

### Issue: Website shows old files
**Solution**:
- Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
- Clear browser cache
- Wait 5 minutes for CDN to refresh

### Issue: React Router not working (404 on refresh)
**Solution**: Already configured! Both index and error documents are set to `index.html`. If still having issues:
```bash
# Verify configuration
az storage blob service-properties show \
  --account-name myappstg12345 \
  --query "staticWebsite"

# Should show both index and error as "index.html"
```

### Issue: Build fails but I don't know why
**Solution**:
1. Go to GitHub Actions tab
2. Click the failed workflow
3. Expand the "Build application" step
4. Look for error messages in npm output

---

## 💰 Cost Breakdown

### Monthly costs (estimate):

| Service | Cost | Notes |
|---------|------|-------|
| Storage | ~$0.024/GB | First 50TB tier |
| Transactions | ~$0.0004 per 10K | GET, PUT operations |
| Data Egress | ~$0.087/GB | Beyond 1GB free/month |
| **Total (10GB site)** | ~$0.50-1.00/month | With minimal traffic |
| **Optional CDN** | ~$0.087/GB | If using for HTTPS |

---

## 📚 Documentation Files

| File | Purpose |
|------|---------|
| `AZURE_STATIC_WEBSITE_SETUP.md` | Detailed step-by-step setup |
| `AZURE_STATIC_WEBSITE_QUICK_REFERENCE.md` | Commands and secrets reference |
| `GITHUB_ACTIONS_STORAGE_WEBSITE_GUIDE.md` | SWA vs Storage Website comparison |
| `setup-azure-static-website.sh` | Automated setup script |

---

## 🎓 What You Learned

### Workflow has:
- ✅ Node.js setup with npm caching
- ✅ Build verification step
- ✅ Azure authentication via service principal
- ✅ Storage account verification
- ✅ Blob storage upload with overwrite
- ✅ Deployment verification
- ✅ Optional CDN purge
- ✅ Detailed summary output

### Security:
- ✅ Uses service principal (not storage key directly in code)
- ✅ Secrets stored securely in GitHub
- ✅ No credentials in workflow file
- ✅ Can be audited via GitHub Actions logs

---

## 🚀 Next Steps

1. **Run the setup script**
   ```bash
   chmod +x setup-azure-static-website.sh
   ./setup-azure-static-website.sh
   ```

2. **Push to main branch**
   ```bash
   git add .github/workflows/azure-static-web-apps-deploy.yml
   git commit -m "Update: Deploy to Azure Static Website instead of SWA"
   git push origin main
   ```

3. **Monitor workflow**
   - Go to Actions tab
   - Watch the deployment complete
   - Click the workflow run to see details

4. **Visit your website**
   ```bash
   # Get URL from workflow logs or:
   az storage account show --name myappstg12345 \
     --query "primaryEndpoints.web" -o tsv
   ```

---

## 📞 Support

If you encounter issues:

1. **Check the troubleshooting guide**: `GITHUB_ACTIONS_STORAGE_WEBSITE_GUIDE.md`
2. **Review GitHub Actions logs** for detailed error messages
3. **Verify Azure resources exist**: `az storage account show --name {account}`
4. **Check GitHub secrets** are correctly set

---

## 🎉 Summary

You now have:
- ✅ Automated deployment to Azure Storage Static Website
- ✅ Cost-effective hosting (~$0.50-2/month)
- ✅ Fast builds and deployments
- ✅ Full control over your infrastructure
- ✅ React Router support
- ✅ CORS configuration ready
- ✅ Optional CDN integration

**Your website is production-ready!** 🚀

