# Azure Static Website Deployment - Quick Reference

## Current Workflow File Location
`.github/workflows/azure-static-web-apps-deploy.yml`

## Workflow Overview

```
┌─────────────────────────────────────────────────────────────┐
│                   GitHub Actions Workflow                   │
└─────────────────────────────────────────────────────────────┘
                              │
                    Trigger: Push to main
                              │
                ┌─────────────┴─────────────┐
                │                           │
        ┌───────▼───────┐         ┌────────▼────────┐
        │ Build & Test  │         │ Install Node.js │
        └───────┬───────┘         └────────┬────────┘
                │                           │
        ┌───────▼───────────────────────────▼──────────┐
        │   npm ci (Install Dependencies)              │
        └─────────────────────────┬────────────────────┘
                                  │
        ┌─────────────────────────▼────────────────────┐
        │   npm run build (Create dist/ folder)       │
        └─────────────────────────┬────────────────────┘
                                  │
        ┌─────────────────────────▼────────────────────┐
        │   Verify build output exists                 │
        └─────────────────────────┬────────────────────┘
                                  │
        ┌─────────────────────────▼────────────────────┐
        │   Login to Azure (Service Principal)         │
        └─────────────────────────┬────────────────────┘
                                  │
        ┌─────────────────────────▼────────────────────┐
        │   Upload files to Storage $web container     │
        └─────────────────────────┬────────────────────┘
                                  │
        ┌─────────────────────────▼────────────────────┐
        │   Verify deployment                          │
        └─────────────────────────┬────────────────────┘
                                  │
        ┌─────────────────────────▼────────────────────┐
        │   (Optional) Purge CDN cache                 │
        └─────────────────────────┬────────────────────┘
                                  │
        ┌─────────────────────────▼────────────────────┐
        │   Display Deployment Summary                 │
        └──────────────────────────────────────────────┘
```

---

## Required GitHub Secrets

### ✅ Must Configure Before First Deploy

| Secret Name | Example Value | Where to Get |
|---|---|---|
| `AZURE_CREDENTIALS` | `{"appId":"xxx","password":"xxx","tenant":"xxx","subscriptionId":"xxx"}` | `az ad sp create-for-rbac` |
| `STORAGE_ACCOUNT_NAME` | `myappstg12345` | Azure Portal → Storage Account → Overview |
| `STORAGE_ACCOUNT_KEY` | `DefaultEndpointsProtocol=https;...` | Azure Portal → Storage Account → Access Keys |
| `AZURE_RESOURCE_GROUP` | `my-rg` | Azure Portal → Resource Group |

### ⚠️ Optional Secrets (for CDN cache purging)

| Secret Name | Example Value | Where to Get |
|---|---|---|
| `CDN_PROFILE_NAME` | `my-cdn-profile` | Azure Portal → CDN → Profile |
| `CDN_ENDPOINT_NAME` | `my-endpoint` | Azure Portal → CDN → Endpoints |

---

## GitHub Secrets Setup

### Via Web Interface:
1. Go to: **GitHub Repository** → **Settings** → **Secrets and variables** → **Actions**
2. Click **New repository secret**
3. Name: `AZURE_CREDENTIALS`
4. Value: Paste the full JSON output
5. Click **Add secret**
6. Repeat for remaining secrets

### Via GitHub CLI:
```bash
gh secret set AZURE_CREDENTIALS < credentials.json
gh secret set STORAGE_ACCOUNT_NAME -b "myappstg12345"
gh secret set STORAGE_ACCOUNT_KEY -b "your-access-key"
gh secret set AZURE_RESOURCE_GROUP -b "my-rg"
```

---

## Create Service Principal (AZURE_CREDENTIALS)

### Using Azure CLI:
```bash
# Login first
az login

# Create service principal for entire subscription
az ad sp create-for-rbac \
  --name github-actions-sp \
  --role contributor \
  --scopes /subscriptions/{subscription-id} \
  --json-auth
```

This outputs JSON like:
```json
{
  "appId": "12345678-1234-1234-1234-123456789012",
  "displayName": "github-actions-sp",
  "password": "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
  "tenant": "12345678-1234-1234-1234-123456789012",
  "subscriptionId": "12345678-1234-1234-1234-123456789012"
}
```

Copy this entire JSON as the `AZURE_CREDENTIALS` secret value.

---

## Create Storage Account

### Using Azure Portal:
1. **Home** → **+ Create a resource** → **Storage account**
2. Fill details:
   - **Resource Group**: Create new or select existing
   - **Storage account name**: `myappstg{random}` (globally unique)
   - **Region**: Select your region
   - **Performance**: Standard
   - **Redundancy**: LRS (cheapest)
3. **Create**
4. After creation, enable **Static website**:
   - Settings → **Static website**
   - Enable
   - Index document: `index.html`
   - Error document: `index.html`
   - Save

### Using Azure CLI:
```bash
# Create storage account
az storage account create \
  --name myappstg12345 \
  --resource-group my-rg \
  --location eastus \
  --sku Standard_LRS \
  --kind StorageV2

# Enable static website
az storage blob service-properties update \
  --account-name myappstg12345 \
  --static-website \
  --index-document index.html \
  --404-document index.html

# Get storage key
az storage account keys list \
  --account-name myappstg12345 \
  --query "[0].value" -o tsv

# Get website URL
az storage account show \
  --name myappstg12345 \
  --query "primaryEndpoints.web" -o tsv
```

---

## Test Workflow Manually

### Trigger workflow via web:
1. Go to GitHub repo → **Actions**
2. Select **"Deploy React + Vite to Azure Static Website"**
3. Click **Run workflow** → **Run workflow**

### View workflow logs:
1. Go to **Actions** tab
2. Click the latest workflow run
3. Click job name to see full logs
4. Each step shows success (✅) or failure (❌)

### Troubleshoot failed steps:
- Click on the failed step to expand
- Look for error messages
- Common errors:
  - `BadRequest`: Invalid credentials
  - `ResourceNotFound`: Storage account doesn't exist
  - `AuthenticationFailed`: Access key expired or incorrect

---

## Verify Deployment

### Check if files uploaded:
```bash
az storage blob list \
  --account-name myappstg12345 \
  --account-key "{your-access-key}" \
  --container-name '$web' \
  --query "[].[name, properties.contentLength]" \
  -o table
```

### Test website URL:
```bash
# Get the URL
STORAGE_URL=$(az storage account show \
  --name myappstg12345 \
  --query "primaryEndpoints.web" \
  -o tsv)

echo "Testing: $STORAGE_URL"
curl -I $STORAGE_URL
```

### Verify via browser:
- Get your storage account name
- Visit: `https://{storage-account-name}.z{region-code}.web.core.windows.net`
- Example: `https://myappstg12345.z13.web.core.windows.net`

---

## Common Issues & Solutions

### ❌ Issue: "No matching Static Web App was found"
**Cause**: Using old Static Web Apps action instead of storage blob upload  
**Fix**: Ensure workflow uses `azure/login@v1` + `az storage blob upload-batch`

### ❌ Issue: "BadRequest - No matching storage account"
**Cause**: Wrong storage account name in secret  
**Fix**: 
```bash
# Verify account exists
az storage account show --name {your-name}
# Update GitHub secret if needed
```

### ❌ Issue: "AuthenticationFailed - Invalid access key"
**Cause**: Access key expired, revoked, or wrong  
**Fix**:
```bash
# Regenerate key
az storage account keys renew \
  --account-name myappstg12345 \
  --key primary

# Get new key
az storage account keys list \
  --account-name myappstg12345 \
  --query "[0].value" -o tsv

# Update GitHub secret
```

### ❌ Issue: Deployed but old files showing
**Cause**: Browser cache or CDN cache  
**Fix**:
- Hard refresh: Ctrl+Shift+R (Cmd+Shift+R on Mac)
- Clear browser cache
- Wait for CDN to expire (if using)
- Manually trigger CDN purge

### ❌ Issue: 404 errors on page refresh with React Router
**Cause**: Error document not set correctly  
**Fix**:
```bash
# Verify error document setting
az storage blob service-properties show \
  --account-name myappstg12345 \
  --query "staticWebsite"

# Should show: "errorDocument404Path": "index.html"
```

### ❌ Issue: CORS errors when calling backend API
**Cause**: Storage account CORS not configured  
**Fix**:
```bash
# Add CORS rule
az storage cors add \
  --account-name myappstg12345 \
  --origins "http://localhost:8080" "https://api.yourdomain.com" \
  --methods GET POST PUT DELETE OPTIONS \
  --allowed-headers "*" \
  --exposed-headers "*" \
  --max-age 3600
```

---

## Monitoring & Costs

### Check storage usage:
```bash
az storage account show-usage \
  --name myappstg12345 \
  -o table
```

### Estimate monthly cost:
- **Storage**: $0.024/GB × [your-size-in-GB]
- **Transactions**: $0.0004 per 10,000 operations
- **Bandwidth**: Variable (first 1GB free per month)

### Cost optimization:
- Use LRS redundancy (not GRS)
- Delete old versions regularly
- Consider CDN only if high traffic

---

## Production Checklist

- [ ] Storage account created
- [ ] Static website enabled with index & error docs set
- [ ] All GitHub secrets configured
- [ ] Workflow file validated (no SWA action)
- [ ] First deployment successful
- [ ] Website accessible at primary endpoint
- [ ] React Router working (hard refresh files load)
- [ ] API calls working (CORS configured if needed)
- [ ] Custom domain configured (optional)
- [ ] HTTPS enabled (via CDN or custom domain)
- [ ] Backups/versioning enabled (optional)
- [ ] Monitoring alerts set up (optional)

---

## Support & Documentation

- [Workflow Status](../../actions) - View runs
- [Azure Storage Docs](https://docs.microsoft.com/azure/storage/)
- [GitHub Actions Docs](https://docs.github.com/actions)
- [Troubleshooting Guide](./GITHUB_ACTIONS_STORAGE_WEBSITE_GUIDE.md)

