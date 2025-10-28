# Google Cloud Deployment Guide - PP_VAT

**Quick Answer:** ✅ YES, your app is ready for Google Cloud deployment on the free tier!

**What's included in the free tier (Always Free):**
- Cloud Run: 2 million requests/month
- 400,000 GiB-seconds of memory
- 200,000 vCPU-seconds
- 1 GB egress per month

---

## Prerequisites

1. **Google Cloud account** (free $300 credit for new users)
2. **Google Cloud CLI** installed and authenticated
3. **Docker** installed (for local testing)

---

## Quick Deployment (5 minutes)

### Step 1: Authenticate with Google Cloud

```bash
# Install gcloud CLI if not installed
# macOS: brew install google-cloud-sdk

# Login to Google Cloud
gcloud auth login

# Set your project (create one if needed)
gcloud projects create pp-vat-deployment
gcloud config set project pp-vat-deployment

# Enable billing (required even for free tier)
gcloud billing accounts list
gcloud billing projects link pp-vat-deployment --billing-account=YOUR_BILLING_ACCOUNT_ID
```

### Step 2: Build and Deploy

```bash
cd /Users/marcus/PP/VAT

# Build Docker image
gcloud builds submit --tag gcr.io/pp-vat-deployment/pp-vat

# Deploy to Cloud Run
gcloud run deploy pp-vat \
  --image gcr.io/pp-vat-deployment/pp-vat \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --memory 1Gi \
  --cpu 1 \
  --timeout 300s \
  --max-instances 10
 lieutenant

### Step 3: Get Your URL

```bash
# The deployment will output a URL like:
# https://pp-vat-xxxxx-uc.a.run.app

# Test it
curl https://pp-vat-xxxxx-uc.a.run.app/health
```

---

## One-Line Deploy (Easiest)

```bash
cd /Users/marcus/我就是你的AI助手/VAT && gcloud run deploy pp-vat --source . --platform managed --region us-central1 --allow-unauthenticated
```

The `--source .` flag tells Cloud Run to build the Dockerfile automatically.

---

## Local Testing Before Deployment

### Test Docker Build Locally

```bash
cd /Users/marcus/PP/VAT

# Build image
docker build -t pp-vat:local .

# Run locally
docker run -p 8080:8080 pp-vat:local

# Test in browser
open http://localhost:8080
```

**Login:** `admin` / `secret`

---

## Configuration Options

### For Free Tier

```bash
gcloud run deploy pp-vat \
  --memory 512Mi \        # Start with 512MB (enough for most PDFs)
  --cpu 1 \
  --min-instances 0 \     # Scale to zero when not in use
  --max-instances 5       # Limit to control costs
```

### For Production

```bash
gcloud run deploy pp-vat \
  --memory 2Gi \
  --cpu 2 \
  --timeout 300s \
  --concurrency 10 \
  --min-instances 1 \     # Always run (faster, costs more)
  --max-instances 100
```

---

## Monitoring

### Check Logs

```bash
# View recent logs
gcloud run services logs read pp-vat --region us-central1

# Follow logs in real-time
gcloud run services logs tail pp-vat --region us-central1
```

### Check Costs

```bash
# Go to Google Cloud Console
open https://console.cloud.google.com/billing

# Monitor in Cloud Console
open https://console.cloud.google.com/cloud-run
```

---

## Security Setup (Optional but Recommended)

### Add Authentication

```bash
# Remove --allow-unauthenticated and add IAM

# Deploy with authentication required
gcloud run deploy pp-vat \
  --no-allow-unauthenticated

# Grant access to your account
gcloud run services add-iam-policy-binding pp-vat \
  --member="user:your-email@gmail.com" \
  --role="roles/run.invoker"
```

### Environment Variables

```bash
gcloud run deploy pp-vat \
  --update-env-vars SECRET_KEY="your-secret-key-here"
```

---

## Cost Estimation

### On Free Tier (Always Free)

**Monthly usage: 100 PDFs processed**
- Requests: 100 (well under 2M limit) ✅ FREE
- Memory: 500 MB × 5 seconds × 100 = 250 GiB-seconds (under 400K limit) ✅ FREE
- CPU: 0.5 vCPU × 5 seconds × 100 = 250 vCPU-seconds (under 200K limit) ✅ FREE
- **Total Cost: $0.00** 🎉

### After Free Tier (Pay-as-you-go)

**Monthly usage: 1,000 PDFs**
- Requests: 1,000 × $0.0000004 = $0.0004
- Memory: 500 MB × 5s × 1,000 × $0.00000250 = $0.006
- CPU: 0.5 vCPU × 5s × 1,000 × $0.00002400 = $0.06
- **Total: ~$0.07/month** 💰

---

## Troubleshooting

### Build Fails

```bash
# Check Dockerfile syntax
docker build -t pp-vat:test . --no-cache

# Check for syntax errors
python -m py_compile project/src/web/app.py
```

### App Won't Start

```bash
# Check logs
gcloud run services logs read pp-vat --region us-central1 --limit 50

# Common issues:
# - Missing environment variables
# - Port not exposed correctly
# - Dependencies not installed
```

### PDF Processing Fails

```bash
# Check PyMuPDF is installed correctly
docker run pp-vat:local python -c "import pymupdf; print(pymupdf.__version__)"

# Test locally first
docker run -p 8080:8080 pp-vat:local
# Then upload a PDF via the web interface
```

---

## Rollback

``` swarm
# List revisions
gcloud run revisions list --service pp-vat --region us-central1

# Rollback to previous version
gcloud run services update-traffic pp-vat \
  --to-revisions PREVIOUS_REVISION=100 \
  --region us-central1
```

---

## Next Steps

1. ✅ Deploy to Cloud Run
2. ✅ Test the web interface
3. ✅ Upload a sample PDF
4. ✅ Verify VAT detection works
5. ✅ Monitor costs in billing dashboard

---

## Support

- **Cloud Run Docs:** https://cloud.google.com/run/docs
- **Pricing Calculator:** https://cloud.google.com/products/calculator
- **Troubleshooting:** Check logs with `gcloud run services logs`

---

**Ready to deploy! 🚀**

Your app is fully functional and ready for Google Cloud's free tier deployment.

