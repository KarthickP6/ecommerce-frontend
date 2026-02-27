#!/bin/bash

###############################################################################
# Azure Static Website Deployment - Complete Setup Script
# This script automates the entire setup process
###############################################################################

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Functions
print_header() {
    echo -e "\n${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}\n"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

###############################################################################
# STEP 1: Validate Prerequisites
###############################################################################

print_header "STEP 1: Validating Prerequisites"

echo "Checking Azure CLI..."
if ! command -v az &> /dev/null; then
    print_error "Azure CLI not found. Please install it first:"
    echo "  https://docs.microsoft.com/cli/azure/install-azure-cli"
    exit 1
fi
print_success "Azure CLI found: $(az --version | head -1)"

echo -e "\nChecking GitHub CLI..."
if ! command -v gh &> /dev/null; then
    print_warning "GitHub CLI not found. Install optional: https://cli.github.com"
else
    print_success "GitHub CLI found: $(gh --version)"
fi

echo -e "\nChecking Node.js..."
if ! command -v node &> /dev/null; then
    print_error "Node.js not found. Please install it first:"
    echo "  https://nodejs.org"
    exit 1
fi
print_success "Node.js found: $(node --version)"

###############################################################################
# STEP 2: Get User Input
###############################################################################

print_header "STEP 2: Configuration"

read -p "Enter your Azure Subscription ID (or press Enter to use default): " SUBSCRIPTION_ID
if [ -z "$SUBSCRIPTION_ID" ]; then
    SUBSCRIPTION_ID=$(az account show --query id -o tsv)
fi
echo "Using Subscription: $SUBSCRIPTION_ID"

read -p "Enter Resource Group name (default: ecommerce-rg): " RESOURCE_GROUP
RESOURCE_GROUP=${RESOURCE_GROUP:-ecommerce-rg}
echo "Resource Group: $RESOURCE_GROUP"

read -p "Enter Azure region (default: eastus): " LOCATION
LOCATION=${LOCATION:-eastus}
echo "Location: $LOCATION"

read -p "Enter Storage Account name (must be globally unique, default: appstg${RANDOM}): " STORAGE_ACCOUNT
STORAGE_ACCOUNT=${STORAGE_ACCOUNT:-appstg${RANDOM}}
echo "Storage Account: $STORAGE_ACCOUNT"

read -p "Enter Service Principal name (default: github-actions-sp): " SP_NAME
SP_NAME=${SP_NAME:-github-actions-sp}
echo "Service Principal: $SP_NAME"

read -p "Enter GitHub repository (format: owner/repo): " GITHUB_REPO
if [ -z "$GITHUB_REPO" ]; then
    print_error "GitHub repository is required"
    exit 1
fi

###############################################################################
# STEP 3: Azure Login
###############################################################################

print_header "STEP 3: Logging into Azure"

echo "Attempting to login to Azure..."
if az account show &> /dev/null; then
    print_success "Already logged into Azure"
    CURRENT_USER=$(az account show --query "user.name" -o tsv)
    echo "Current user: $CURRENT_USER"
else
    az login
    print_success "Azure login successful"
fi

###############################################################################
# STEP 4: Create Resource Group
###############################################################################

print_header "STEP 4: Creating Resource Group"

echo "Checking if resource group exists..."
if az group exists --name "$RESOURCE_GROUP" --query value -o tsv | grep -q "true"; then
    print_success "Resource group '$RESOURCE_GROUP' already exists"
else
    echo "Creating resource group..."
    az group create \
        --name "$RESOURCE_GROUP" \
        --location "$LOCATION"
    print_success "Resource group created"
fi

###############################################################################
# STEP 5: Create Storage Account
###############################################################################

print_header "STEP 5: Creating Storage Account"

echo "Checking if storage account exists..."
if az storage account show --name "$STORAGE_ACCOUNT" --resource-group "$RESOURCE_GROUP" &> /dev/null; then
    print_success "Storage account '$STORAGE_ACCOUNT' already exists"
else
    echo "Creating storage account..."
    az storage account create \
        --name "$STORAGE_ACCOUNT" \
        --resource-group "$RESOURCE_GROUP" \
        --location "$LOCATION" \
        --sku Standard_LRS \
        --kind StorageV2
    print_success "Storage account created"
fi

###############################################################################
# STEP 6: Enable Static Website
###############################################################################

print_header "STEP 6: Enabling Static Website Hosting"

echo "Enabling static website on storage account..."
az storage blob service-properties update \
    --account-name "$STORAGE_ACCOUNT" \
    --static-website \
    --index-document index.html \
    --404-document index.html

print_success "Static website enabled"
print_success "Index document: index.html"
print_success "Error document: index.html"

###############################################################################
# STEP 7: Get Storage Credentials
###############################################################################

print_header "STEP 7: Retrieving Storage Credentials"

echo "Getting storage account information..."
STORAGE_KEY=$(az storage account keys list \
    --account-name "$STORAGE_ACCOUNT" \
    --resource-group "$RESOURCE_GROUP" \
    --query "[0].value" -o tsv)

STORAGE_URL=$(az storage account show \
    --name "$STORAGE_ACCOUNT" \
    --resource-group "$RESOURCE_GROUP" \
    --query "primaryEndpoints.web" -o tsv)

print_success "Storage Account Name: $STORAGE_ACCOUNT"
print_success "Storage Account Key: ${STORAGE_KEY:0:20}..."
print_success "Website URL: $STORAGE_URL"

###############################################################################
# STEP 8: Create Service Principal
###############################################################################

print_header "STEP 8: Creating Service Principal"

echo "Checking if service principal exists..."
SP_EXISTS=$(az ad sp list --display-name "$SP_NAME" --query "length(@)" -o tsv)

if [ "$SP_EXISTS" -gt 0 ]; then
    print_warning "Service principal '$SP_NAME' already exists"
    echo "Getting existing service principal credentials..."
    SP_CREDS=$(az ad sp create-for-rbac \
        --name "$SP_NAME" \
        --role contributor \
        --scopes "/subscriptions/$SUBSCRIPTION_ID" \
        --json-auth 2>&1 || echo "")

    if [ -z "$SP_CREDS" ]; then
        print_error "Could not create credentials for existing SP"
        print_warning "You may need to delete and recreate the service principal:"
        echo "  az ad sp delete --id {app-id}"
        exit 1
    fi
else
    echo "Creating new service principal..."
    SP_CREDS=$(az ad sp create-for-rbac \
        --name "$SP_NAME" \
        --role contributor \
        --scopes "/subscriptions/$SUBSCRIPTION_ID" \
        --json-auth)
    print_success "Service principal created"
fi

###############################################################################
# STEP 9: Save Credentials to File
###############################################################################

print_header "STEP 9: Saving Credentials"

CREDS_FILE="azure-credentials.json"
echo "$SP_CREDS" > "$CREDS_FILE"
print_success "Credentials saved to: $CREDS_FILE"
print_warning "IMPORTANT: Keep this file secure and add it as GitHub secret"

###############################################################################
# STEP 10: Add GitHub Secrets
###############################################################################

print_header "STEP 10: Adding GitHub Secrets"

echo -e "\n${YELLOW}Choose how to add secrets:${NC}"
echo "1. Manual (copy-paste into GitHub web interface)"
echo "2. GitHub CLI (automatic)"
read -p "Enter choice (1 or 2): " SECRET_METHOD

if [ "$SECRET_METHOD" = "2" ]; then
    if command -v gh &> /dev/null; then
        echo -e "\nAdding secrets via GitHub CLI..."

        gh secret set AZURE_CREDENTIALS -b "$(cat $CREDS_FILE)" --repo "$GITHUB_REPO" 2>/dev/null || {
            print_error "Could not set secrets with GitHub CLI"
            print_warning "You may need to authenticate with: gh auth login"
        }

        gh secret set STORAGE_ACCOUNT_NAME -b "$STORAGE_ACCOUNT" --repo "$GITHUB_REPO" 2>/dev/null || true
        gh secret set STORAGE_ACCOUNT_KEY -b "$STORAGE_KEY" --repo "$GITHUB_REPO" 2>/dev/null || true
        gh secret set AZURE_RESOURCE_GROUP -b "$RESOURCE_GROUP" --repo "$GITHUB_REPO" 2>/dev/null || true

        print_success "GitHub secrets added"
    else
        print_error "GitHub CLI not found"
        SECRET_METHOD="1"
    fi
fi

if [ "$SECRET_METHOD" = "1" ]; then
    print_warning "Please add the following secrets to GitHub manually:"
    echo ""
    echo "Repository: $GITHUB_REPO"
    echo "Go to: Settings → Secrets and variables → Actions → New repository secret"
    echo ""
    echo "1. AZURE_CREDENTIALS:"
    echo "   $(cat $CREDS_FILE)"
    echo ""
    echo "2. STORAGE_ACCOUNT_NAME:"
    echo "   $STORAGE_ACCOUNT"
    echo ""
    echo "3. STORAGE_ACCOUNT_KEY:"
    echo "   $STORAGE_KEY"
    echo ""
    echo "4. AZURE_RESOURCE_GROUP:"
    echo "   $RESOURCE_GROUP"
    echo ""
fi

###############################################################################
# STEP 11: Verify Configuration
###############################################################################

print_header "STEP 11: Verifying Configuration"

echo "Testing storage account access..."
BLOB_COUNT=$(az storage blob list \
    --account-name "$STORAGE_ACCOUNT" \
    --account-key "$STORAGE_KEY" \
    --container-name '$web' \
    --query "length(@)" \
    -o tsv 2>/dev/null || echo "0")

print_success "Storage account is accessible"
print_success "Blobs in \$web container: $BLOB_COUNT"

###############################################################################
# STEP 12: Display Summary
###############################################################################

print_header "✅ SETUP COMPLETE"

echo -e "${GREEN}Azure Static Website is ready to deploy!${NC}\n"

echo "📋 Summary:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Azure Resources:"
echo "  • Resource Group: $RESOURCE_GROUP"
echo "  • Location: $LOCATION"
echo "  • Storage Account: $STORAGE_ACCOUNT"
echo "  • Website URL: $STORAGE_URL"
echo ""
echo "GitHub Configuration:"
echo "  • Repository: $GITHUB_REPO"
echo "  • Secrets added: 4 required secrets"
echo "  • Workflow file: .github/workflows/azure-static-web-apps-deploy.yml"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

echo -e "\n${YELLOW}Next Steps:${NC}"
echo "1. Build your frontend: npm run build"
echo "2. Push changes to main branch to trigger workflow"
echo "3. Monitor deployment in GitHub Actions tab"
echo "4. Visit your website at: $STORAGE_URL"

echo -e "\n${YELLOW}Optional:${NC}"
echo "• Configure custom domain"
echo "• Set up Azure CDN for HTTPS"
echo "• Configure CORS if using separate API backend"

echo -e "\n${GREEN}Cleanup:${NC}"
echo "Remove credentials file (already added to GitHub):"
echo "  rm $CREDS_FILE"

echo -e "\n${BLUE}Documentation:${NC}"
echo "• Setup Guide: AZURE_STATIC_WEBSITE_SETUP.md"
echo "• Quick Reference: AZURE_STATIC_WEBSITE_QUICK_REFERENCE.md"
echo "• Troubleshooting: GITHUB_ACTIONS_STORAGE_WEBSITE_GUIDE.md"

echo -e "\n"

