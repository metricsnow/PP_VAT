# PP_VAT Deployment Checklist

**Pre-deployment verification checklist for complete and current local version deployment.**

---

## ✅ Pre-Deployment Verification

### Files Verification

- [x] **project/src/main.py** - Current version with enhanced total detection
- [x] **project/static/js/app.js** - Current version with dual-output processing
- [x] **.dockerignore** - Updated to include config files
- [x] **project/src/configs/importers.csv** - Exists with CH, GB, AU data
- [x] **Dockerfile** - Production-ready configuration
- [x] **requirements.txt** - All dependencies specified
- [x] **project/docs/core/utils.py** - PDF utilities included
- [x] **project/src/web/** - All web files present
- [x] **project/static/** - All static files present

### Configuration Verification

- [x] **importers.csv** has 3 countries (CH, GB, AU)
- [x] **.dockerignore** allows CSV files
- [x] **Dockerfile** copies entire project/ directory
- [x] **requirements.txt** includes all dependencies
- [x] **Health check** endpoint configured
- [x] **Port** 8080 exposed

### Feature Verification

- [x] **Dual-output generation** - Review + Download versions
- [x] **Enhanced total detection** - Improved pattern matching
- [x] **Importer information box** - Country-based detection
- [x] **Smart price highlighting** - Extended rectangle support
- [x] **Web authentication** - User login system
- [x] **Session management** - Secure sessions
- [x] **File handling** - Upload/download processing

---

## 🚀 Deployment Steps

### 1. Verify Prerequisites

```bash
# Check Google Cloud CLI
gcloud --version

# Check authentication
gcloud auth list

# Check project
gcloud config get-value project
```

### 2. Prepare Deployment

```bash
# Navigate to project
cd /Users/marcus/PP/VAT

# Verify current files
git status

# Check importers.csv
cat project/src/configs/import返回ers.csv

# Verify Dockerfile
head -20 Dockerfile
```

### 3. Deploy to Cloud Run

```bash
# One-command deployment
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

### 4. Wait for Deployment

```
✅ Build started
✅ Push to Container Registry
✅ Deploy to Cloud Run
✅ Service URL provided
```

### 5. Get Service URL

```bash
gcloud run services list --region us-central1
```

---

## 🧪 Post-Deployment Testing

### Test 1: Health Check

```bash
curl https://YOUR_SERVICE_URL/health
```

**Expected Response:**
```json
{"status":"healthy","version":"1.0.0","service":"PP_VAT Processor"}
```

### Test 2: Access Web Application

1. Open browser: `https://YOUR_SERVICE_URL`
2. Should see login page

### Test 3: Login

- Username: `admin`
- Password: `secret`
- Should redirect to main application

### Test 4: Upload PDF

1. Upload `project/examples/example_1.PDF`
2. Should show processing status
3. Should display both original and corrected PDFs
4. Review version (yellow highlights) should appear
5. Download button should work

### Test 5: Verify Features

- [ ] VAT detection works
- [ ] Country code detected (if applicable)
- [ ] Importer box appears on first page
- [ ] Yellow highlights visible (review version)
- [ ] Download produces white highlights
- [ ] Metadata displayed correctly
- [ ] Prior total shown
- [ ] Corrected total shown

---

## 📊 Verification Commands

### Check Service Status

```bash
gcloud run services describe pp-vat --region us-central1
```

### View Logs

```bash
# Recent logs
gcloud run services logs read pp-vat --region us-central1 --limit 50

# Follow logs
gcloud run services logs tail pp-vat --region us-central1
```

### Test in Container

```bash
# Get image
docker pull gcr.io/YOUR_PROJECT_ID/pp-vat

# Run locally
docker run -p 8080:8080 gcr.io/YOUR_PROJECT_ID/pp-vat

# Verify files
docker run gcr.io/YOUR_PROJECT_ID/pp-vat ls -la /app/project/src/configs/
```

### Verify Configuration

```bash
# Check importers.csv in container
docker run gcr.io/YOUR_PROJECT_ID/pp-vat cat /app/project/src/configs/importers.csv

# Check Python dependencies
docker run gcr.io/YOUR_PROJECT_ID/pp-vat pip list | grep pymupdf
```

---

## 🔍 Troubleshooting

### Build Fails

**Issue:** Build error during deployment

**Solution:**
```bash
# Check Dockerfile
docker build -t pp-vat-test . --no-cache

# View build logs
gcloud builds list --limit 5
gcloud builds log BUILD_ID
```

### Service Won't Start

**Issue:** Cloud Run service shows error

**Solution:**
```bash
# Check logs
gcloud run services logs read pp-vat --region us-central1

# Verify environment variables
gcloud run services describe pp-vat --region us-central1
```

### PDF Processing Fails

**Issue:** Uploaded PDF doesn't process

**Solution:**
```bash
# Check logs for errors
gcloud run services logs read pp-vat --region us-central1 | grep ERROR

# Verify PyMuPDF
docker run gcr.io/YOUR_PROJECT_ID/pp-vat python -c "import pymupdf; print(pymupdf.__version__)"
```

### Importer Box Missing

**Issue:** No importer information appears

**Solution:**
```bash
# Verify importers.csv in container
docker run gcr.io/YOUR_PROJECT_ID/pp-vat cat /app/project/src/configs/importers.csv

# Check logs for warnings
gcloud run services logs read pp-vat --region us-central1 | grep WARNING
```

---

## 📈 Monitoring

### Key Metrics to Watch

1. **Request Count**
   - Should increase with each PDF upload

2. **Processing Time**
   - Average: 3-5 seconds per PDF

3. **Memory Usage**
   - Average: 500 MB per request

4. **Error Rate**
   - Should be minimal (< 1%)

### Cloud Console Links

- **Cloud Run**: https://console.cloud.google.com/run
- **Cloud Build**: https://console.cloud.google.com/cloud-build
- **Logs**: https://console.cloud.google.com/logs
- **Billing**: https://console.cloud.google.com/billing

---

## ✅ Success Criteria

- [ ] Service deployed successfully
- [ ] Health check returns 200 OK
- [ ] Web interface loads
- [ ] Login works
- [ ] PDF upload successful
- [ ] Processing completes
- [ ] Yellow highlights visible (review)
- [ ] White highlights in download
- [ ] Importer box appears (if country detected)
- [ ] Metadata accurate
- [ ] Download works
- [1032] No errors in logs

---

## 📝 Deployment Record

### Deployment Information

- **Date**: ________________
- **Region**: us-central1
- **Service URL**: ________________________
- **Build ID**: ________________
- **Revision**: ________________

### Test Results

- [ ] Health check passed
- [ ] Login successful
- [ ] PDF processing works
- [ ] All features verified
- [ ] No errors in logs

### Notes

_______________________________________________
_______________________________________________
_______________________________________________

---

## 🎉 Post-Deployment

Once deployment is successful:

1. **Bookmark** the service URL
2. **Share** with team
3. **Monitor** usage for first 24 hours
4. **Review** logs for any issues
5. **Optimize** resources if needed

---

**Deployment is ready to begin!**

Review this checklist, then proceed with deployment commands above.

