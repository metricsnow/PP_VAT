# PP_VAT Google Cloud Setup Guide

## Step 1: Install Google Cloud CLI

**On macOS:**
```bash
# Check if Homebrew is installed
brew --version

# If not installed, install Homebrew first:
# /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install Google Cloud SDK
brew install --cask google-cloud-sdk
```

**Alternative (Direct Download):**
```bash
# Download and run installer
curl https://sdk.cloud.google.com | bash
exec -l $SHELL  # Restart shell
```

## Step 2: Initialize Google Cloud

```bash
# Login to Google Cloud
gcloud auth login

# Create a new project (or use existing)
gcloud projects create pp-vat-deployment --name="PP_VAT Application"

# Set the project as default
gcloud config set project pp-vat-deployment

# Enable required APIs
gcloud services enable run.googleapis.com
gcloud services enable cloudbuild.googleapis.com
```

## Step 3: Link Billing Account (Required)

```bash
# List your billing accounts
gcloud billing accounts list

# Link billing account (replace ACCOUNT_ID with your billing account ID)
gcloud billing projects link pp-vat-deployment --billing-account=ACCOUNT_ID
```

## Step 4: Deploy Your Application

```bash
cd /Users/marcus/PP/VAT

# Deploy to Cloud Run
gcloud run deploy pp-vat \
  --source . \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --memory 1Gi \
  --cpu 1 \
  --timeout 300s \
  --max-instances 5
```

## Step 5: Get Your Application URL

After deployment completes, you'll see:
```
Service [pp-vat] deployed on Cloud Run
Service URL: https://pp-vat-xxxxx-uc.a.run.app
```

**Login Credentials:**
- Username: `admin`
- Password: `secret`

---

## Quick Start Commands

Copy and paste these commands one by one:

```bash
# 1. Install gcloud (if not installed)
brew install --cask google-cloud-sdk

# 2. Login
gcloud auth login

# 3. Create project
gcloud projects create pp-vat-deployment --name="PP_VAT Application"
gcloud config set project pp-vat-deployment

# 4. Enable APIs
gcloud services enable run.googleapis.com cloudbuild.googleapis.com

# 5. Link billing (you need to do this manually - get ACCOUNT_ID from billing accounts list)
# gcloud billing accounts list  # First, see your accounts
# gcloud billing projects link pp-vat-deployment --billing-account=ACCOUNT_ID

# 6. Deploy
cd /Users/marcus/PP/VAT
gcloud run deploy pp-vat --source . --platform managed --region us-central1 --allow-unauthenticated --memory 1Gi
```

---

## Troubleshooting

### "Command not found: gcloud"
```bash
# Install via Homebrew
brew install --cask google-cloud-sdk

# Or download installer
curl https://sdk.cloud.google.com | bash
```

### "Billing account not found"
- Go to https://console.cloud.google.com/billing
- Create a billing account (Google provides $300 free credit)
- Get the account ID from `gcloud billing accounts list`

### "Permission denied"
- Run `gcloud auth login` again
- Make sure you're using the correct Google account

### Build fails
```bash
# Check build logs
gcloud builds list --limit 5
gcloud builds log LATEST_BUILD_ID
```

---

## What Happens During Deployment?

1. **Cloud Build** compiles your Dockerfile
2. **Container** is pushed to Google Container Registry
3. **Cloud Run** deploys your service
4. **URL** is generated and service is accessible
5. **Automatic scaling** (0 to 5 instances based on traffic)

**First deployment takes 5-10 minutes** (subsequent deploys are faster).

---

## Next Steps After Deployment

1. ✅ Test login at the provided URL
2. ✅ Upload a sample PDF from `project/examples/`
3. ✅ Verify VAT detection works
4. ✅ Download the processed PDF
5. 🔒 (Optional) Secure the app by removing `--allow-unauthenticated`

---

## Cost

**Free Tier Includes:**
- 2 million requests/month
- 400,000 GiB-seconds memory
- 200,000 vCPU-seconds
- **Estimated cost for 100 PDFs/month: $0.00** ✅

