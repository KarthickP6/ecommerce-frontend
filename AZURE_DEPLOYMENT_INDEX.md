# Azure Static Website Deployment - Documentation Index

## 📌 Start Here

You've transitioned from **Azure Static Web Apps** to **Azure Storage Static Website** hosting. This is a cost-effective alternative that gives you more control and saves ~80% on hosting costs.

---

## 📚 Documentation Files

### 1. **AZURE_STATIC_WEBSITE_COMPLETE_SOLUTION.md** ⭐ START HERE
   - Complete overview of what changed
   - 5-minute quick start guide
   - Workflow execution flow
   - Troubleshooting common issues
   - Cost breakdown
   - **Best for**: Getting started quickly

### 2. **AZURE_STATIC_WEBSITE_SETUP.md**
   - Detailed step-by-step setup guide
   - Create resources via Azure Portal
   - Create service principal
   - Add GitHub secrets
   - Configure custom domain
   - Configure CORS rules
   - **Best for**: Manual setup and detailed instructions

### 3. **AZURE_STATIC_WEBSITE_QUICK_REFERENCE.md**
   - Commands and secrets reference
   - Workflow overview diagram
   - GitHub secret setup instructions
   - Common issues & solutions
   - Production checklist
   - **Best for**: Quick lookup of commands

### 4. **GITHUB_ACTIONS_STORAGE_WEBSITE_GUIDE.md**
   - Difference between Static Web Apps vs Storage Website
   - Migration guide
   - Complete verification checklist
   - Setup script
   - **Best for**: Understanding the migration

### 5. **setup-azure-static-website.sh**
   - Automated setup script
   - Interactive configuration
   - Creates all Azure resources
   - Sets up GitHub secrets
   - Verifies everything works
   - **Best for**: One-command setup

---

## 🚀 Quick Start Paths

### Path 1: Automated Setup (Recommended - 5 minutes)
```bash
chmod +x setup-azure-static-website.sh
./setup-azure-static-website.sh
```
→ See: `AZURE_STATIC_WEBSITE_COMPLETE_SOLUTION.md`

### Path 2: Manual Setup (10 minutes)
1. Read: `AZURE_STATIC_WEBSITE_SETUP.md` (Step 1-5)
2. Copy commands from: `AZURE_STATIC_WEBSITE_QUICK_REFERENCE.md`
3. Add secrets manually to GitHub

### Path 3: Using Azure Portal (15 minutes)
1. Follow: `AZURE_STATIC_WEBSITE_SETUP.md` step-by-step
2. Reference: `AZURE_STATIC_WEBSITE_QUICK_REFERENCE.md` for commands
3. Monitor: GitHub Actions tab

---

## 📊 What You Have

### Files Modified:
- ✅ `.github/workflows/azure-static-web-apps-deploy.yml` - Updated with Azure Storage deployment

### New GitHub Workflow:
```
Triggers: Push to main / Manual dispatch
    ↓
1. Checkout code
2. Setup Node.js 20
3. Install npm dependencies
4. Build React app (npm run build)
5. Verify build output
6. Login to Azure
7. Verify storage account
8. Upload files to $web container
9. Verify deployment
10. Optional: Purge CDN cache
11. Display summary
    ↓
Website live at: https://{storage}.z13.web.core.windows.net
```

---

## 🔐 Required GitHub Secrets

Add these to your GitHub Repository → Settings → Secrets:

| Secret | Value |
|--------|-------|
| `AZURE_CREDENTIALS` | Service principal JSON (from `az ad sp create-for-rbac`) |
| `STORAGE_ACCOUNT_NAME` | Your storage account name |
| `STORAGE_ACCOUNT_KEY` | Storage account primary access key |
| `AZURE_RESOURCE_GROUP` | Your resource group name |

### Optional (for CDN):
| `CDN_PROFILE_NAME` | Your CDN profile name |
| `CDN_ENDPOINT_NAME` | Your CDN endpoint name |

---

## ✅ Setup Checklist

- [ ] Read: `AZURE_STATIC_WEBSITE_COMPLETE_SOLUTION.md` (5 min)
- [ ] Choose setup method (automated or manual)
- [ ] Create Azure resources (storage, service principal)
- [ ] Add 4 required GitHub secrets
- [ ] Push changes to main branch
- [ ] Monitor GitHub Actions workflow
- [ ] Verify website is live
- [ ] (Optional) Configure custom domain
- [ ] (Optional) Setup Azure CDN for HTTPS

---

## 🎯 Common Tasks

### Deploy your app:
```bash
git push origin main
# Workflow triggers automatically
# Check Actions tab to monitor
```

### Manual workflow trigger:
1. GitHub → Actions tab
2. Select: "Deploy React + Vite to Azure Static Website"
3. Click: "Run workflow" → "Run workflow"

### Check deployment status:
```bash
# View uploaded files
az storage blob list \
  --account-name myappstg12345 \
  --account-key "{key}" \
  --container-name '$web' \
  -o table

# Get website URL
az storage account show \
  --name myappstg12345 \
  --query "primaryEndpoints.web" -o tsv
```

### Configure custom domain:
1. Add CNAME: `yourdomain.com` → `{storage}.z13.web.core.windows.net`
2. Azure Portal → Storage Account → Custom domain
3. Enter domain name
4. (Optional) Use Azure CDN for HTTPS

---

## 🐛 Troubleshooting

### Issue: Workflow fails with secret error
- **Solution**: Check GitHub secret values (no extra spaces)
- **Reference**: `AZURE_STATIC_WEBSITE_QUICK_REFERENCE.md` → Secrets Setup

### Issue: Website shows old files
- **Solution**: Hard refresh (Ctrl+Shift+R) or clear browser cache
- **Reference**: `GITHUB_ACTIONS_STORAGE_WEBSITE_GUIDE.md` → Common Issues

### Issue: React Router not working
- **Solution**: Already configured! Both index and error documents are `index.html`
- **Reference**: `AZURE_STATIC_WEBSITE_SETUP.md` → Step 2

### Issue: "BadRequest - No matching Static Web App"
- **Solution**: This was the old error. Workflow is now updated for Storage Website
- **Reference**: `GITHUB_ACTIONS_STORAGE_WEBSITE_GUIDE.md` → Migration Guide

### Issue: CORS errors when calling API
- **Solution**: Configure CORS rules in storage account
- **Reference**: `AZURE_STATIC_WEBSITE_SETUP.md` → Step 6

See full troubleshooting: `AZURE_STATIC_WEBSITE_QUICK_REFERENCE.md`

---

## 💡 Key Concepts

### Azure Storage Static Website
- Simple blob storage with index.html support
- No need for separate Static Web Apps service
- Deploy via `az storage blob upload-batch`
- Cost: ~$0.50-2/month vs ~$1-10/month for Static Web Apps

### Service Principal
- Credentials for GitHub Actions to authenticate with Azure
- Safely stored as GitHub secrets
- Can be revoked/regenerated anytime
- Alternative to using storage account keys directly

### GitHub Workflow
- Triggers automatically on push to main
- Builds your React app (npm run build)
- Uploads files to Azure Storage
- Can be manually triggered anytime

### $web Container
- Special blob storage container for static websites
- Automatically created when you enable static website
- Files accessible via primary endpoint URL

---

## 📈 Monitoring

### GitHub Actions
- Go to: **Actions** tab in your repository
- See all workflow runs with status
- Click run for detailed logs
- Each step shows success/failure

### Azure Portal
- Storage Account → Blobs → $web container
- See all uploaded files
- Monitor storage usage
- Check access logs (optional)

### Website Health
```bash
# Simple test
curl -I https://{storage}.z13.web.core.windows.net

# Check file
curl https://{storage}.z13.web.core.windows.net/index.html
```

---

## 🔗 Related Resources

### Azure Documentation
- [Static Website Hosting](https://docs.microsoft.com/azure/storage/blobs/static-website-how-to-configure)
- [Storage Blob CLI Commands](https://docs.microsoft.com/cli/azure/storage)
- [Service Principals](https://docs.microsoft.com/azure/active-directory/develop/app-objects-and-service-principals)

### GitHub Documentation
- [GitHub Actions Secrets](https://docs.github.com/actions/security-guides/encrypted-secrets)
- [Azure Login Action](https://github.com/azure/login)
- [Actions Workflow Syntax](https://docs.github.com/actions/using-workflows/workflow-syntax-for-github-actions)

### Your Project
- **Frontend**: `/ecommerce-frontend` (React + Vite)
- **Backend**: `/ecommerce-backend` (Spring Boot)
- **Workflow**: `.github/workflows/azure-static-web-apps-deploy.yml`

---

## 🎓 What You Get

✅ **Cost Savings**: ~80% cheaper than Static Web Apps  
✅ **Reliability**: Azure Storage SLA 99.9%  
✅ **Speed**: CDN optional for further optimization  
✅ **Flexibility**: Full control over resources  
✅ **Automation**: GitHub Actions handles deployments  
✅ **Scalability**: Auto-scales with Azure Storage  
✅ **Security**: Service principal authentication  

---

## 📞 Need Help?

1. **Quick answer**: Check `AZURE_STATIC_WEBSITE_QUICK_REFERENCE.md`
2. **Setup help**: See `AZURE_STATIC_WEBSITE_SETUP.md`
3. **Troubleshooting**: Review `GITHUB_ACTIONS_STORAGE_WEBSITE_GUIDE.md`
4. **Automated setup**: Run `setup-azure-static-website.sh`
5. **GitHub Actions logs**: Check Actions tab for detailed error messages

---

## 🚀 Next Step

**Choose one:**

```bash
# Option 1: Automated (Recommended)
chmod +x setup-azure-static-website.sh
./setup-azure-static-website.sh

# Option 2: Manual
# Read: AZURE_STATIC_WEBSITE_SETUP.md
# Follow steps 1-5
# Add GitHub secrets
```

**Then:**
```bash
# Push to deploy
git push origin main

# Monitor in GitHub Actions tab
```

---

**Everything is ready to go! Your deployment pipeline is production-ready.** 🎉

