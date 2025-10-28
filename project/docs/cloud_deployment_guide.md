# Google Cloud Deployment Guide - PP_VAT Application

**Created:** 2025-01-27  
**Status:** Analysis and Recommendations  
**Purpose:** Guide for deploying PP_VAT application to Google Cloud Platform

---

## Executive Summary

**Direct Answer:** ❌ **The GUI application cannot be deployed to Google Cloud Console**

**Why:** The application uses PySide6 (Qt desktop framework) which requires:
- Local graphical interface (window system)
- Desktop rendering engine
- User interaction through mouse/keyboard
- File system access with UI dialogs

**However:** ✅ **The CLI/backend processing logic CAN be deployed to Google Cloud**

---

## Application Architecture Analysis

### Current Application Structure

The PP_VAT application has **two components**:

#### 1. GUI Application (Desktop-only)
- **File:** `project/src/main_gui.py`
- **Framework:** PySide6 (Qt for Python)
- **Purpose:** Desktop UI with split-screen PDF preview
- **Deployment:** ❌ Cannot deploy to cloud
- **Requires:** Local desktop environment

#### 2. CLI Application (Cloud-deployable)
- **File:** `project/src/main.py`
- **Framework:** Python standard library
- **Purpose:** Automated PDF processing via command line
- **Deployment:** ✅ Can deploy to cloud
- **Requires:** Python runtime only

### Processing Logic (Shared)
- **Core Logic:** `project/docs/core/orchestrator.py`, `utils.py`
- **PDF Processing:** PyMuPDF library
- **Function:** VAT detection, price extraction, PDF modification

---

## Deployment Options to Google Cloud

### Option 1: Cloud Run (Recommended for CLI) ⭐

**Best for:** On-demand PDF processing via API

**How it works:**
1. Containerize the CLI application
2. Deploy to Cloud Run
3. Accept PDF uploads via HTTP API
4. Process and return corrected PDF

**Pros:**
- Serverless scaling (pay per use)
- No server management
- Fast cold start with Container
- HTTP API integration
- Can handle concurrent requests

**Cons:**
- No GUI - API only
- Requires request/response handling
- File upload size limits (32MB default)
- Cold start latency (~1-2 seconds)

**Estimated Cost:** $0 - $50/month (depending on usage)

**Implementation Effort:** Medium (2-3 days)

---

### Option 2: Cloud Functions (Event-driven Processing)

**Best for:** Process PDFs from Cloud Storage triggers

**How it works:**
1. Upload PDF to Cloud Storage bucket
2. Cloud Function triggers automatically
3. Process PDF and save result
4. Return notification

**Pros:**
- Fully serverless
- Event-driven architecture
- Automatic scaling
- Low operational overhead

**Cons:**
- No real-time interaction
- No GUI access
- 540 second timeout limit
- Requires Cloud Storage integration

**Estimated Cost:** $0 - $25/month

**Implementation Effort:** High (4-5 days)

---

### Option 3: Compute Engine (Full Control)

**Best for:** Remote server with optional remote desktop

**How it works:**
1. Create VM with Python environment
2. Install application and dependencies
3. Access via SSH or remote desktop (for GUI)
4. Run as service or on-demand

**Pros:**
- Can run GUI if desired (with remote desktop)
- Full control over environment
- No timeout limits
- Good for batch processing

**Cons:**
- Requires VM management
- Continuous cost even when idle
- Need to configure security
- More operational overhead

**Estimated Cost:** $30 - $100/month (depending on VM size)

**Implementation Effort:** Medium (3-4 days)

---

### Option 4: App Engine (Managed Platform)

**Best for:** Web API with managed scaling

**How it works:**
1. Deploy as Python web app
2. Accept PDF via POST request
3. Process and return result
4. Auto-scaling managed by GAE

**Pros:**
- Fully managed platform
- Automatic scaling
- Built-in load balancing
- Good for high traffic

**Cons:**
- More complex setup
- Web API only (no GUI)
- Cost can scale up
- Requires app.yaml configuration

**Estimated Cost:** $0 - $100/month

**Implementation Effort:** High (4-6 days)

---

## Recommended Approach: Cloud Run with Web API

### Architecture Overview

```
┌─────────────────┐
│   User/Client   │
│  (Uploads PDF)  │
└────────┬────────┘
         │
         │ HTTP POST /process
         ▼
┌─────────────────────────────────────┐
│        Cloud Run Service           │
│  ┌──────────────────────────────┐  │
│  │  Flask/FastAPI Web Server   │  │
│  │  ┌────────────────────────┐ │  │
│  │  │   PP_VAT CLI Logic    │ │  │
│  │  │  - VAT Detection       │ │  │
│  │  │  - Price Extraction    │ │  │
│  │  │  - PDF Modification    │ │  │
│  │  └────────────────────────┘ │  │
│  └──────────────────────────────┘  │
└────────┬────────────────────────────┘
         │
         │ HTTP Response (PDF)
         ▼
┌─────────────────┐
│   Download Link │
└─────────────────┘
```

### Step-by-Step Deployment

#### Phase 1: Create Web API Wrapper

Create `project/src/api_server.py`:

```python
"""
FastAPI Web Server for PP_VAT Processing
"""
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.responses import FileResponse
import tempfile
from pathlib import Path
from src.main import process_invoice

app = FastAPI(title="PP_VAT PDF Processor")

@app.post("/process")
async def process_pdf(file: UploadFile = File(...)):
    """Process PDF invoice and return corrected version"""
    
    # Validate file type
    if not file.filename.endswith('.pdf'):
        raise HTTPException(400, "Only PDF files are supported")
    
    # Save uploaded file temporarily
    with tempfile.NamedTemporaryFile(suffix='.pdf', delete=False) as tmp:
        content = await file.read()
        tmp.write(content)
        input_path = Path(tmp.name)
    
    try:
        # Process PDF using existing logic
        output_path = process_invoice(input_path, "_corrected")
        
        if not output_path:
            raise HTTPException(500, "Processing failed")
        
        # Return processed file
        return FileResponse(
            str(output_path),
            media_type='application/pdf',
            filename=f"{file.filename.rsplit('.', 1)[0]}_corrected.pdf"
        )
    
    finally:
        # Cleanup
        input_path.unlink(missing_ok=True)
        if output_path and output_path.exists():
            output_path.unlink(missing_ok=True)

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy"}
```

#### Phase 2: Create Dockerfile

Create `Dockerfile` in project root:

```dockerfile
FROM python:3.9-slim

WORKDIR /app

# Install system dependencies for PyMuPDF
RUN apt-get update && apt-get install -y \
    libmupdf-dev \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements
COPY requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt
RUN pip install fastapi uvicorn

# Copy application code
COPY project/ /app/project/
COPY docs/ /app/docs/

# Set working directory
WORKDIR /app/project/src

# Expose port
EXPOSE 8080

# Run API server
CMD ["uvicorn", "api_server:app", "--host", "0.0.0.0", "--port", "8080"]
```

#### Phase 3: Deploy to Cloud Run

```bash
# Build and deploy
gcloud run deploy pp-vat-processor \
  --source . \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --memory 2Gi \
  --timeout 300s \
  --max-instances 10

# Get service URL
gcloud run services describe pp-vat-processor --region us-central1
```

#### Phase 4: Test API

```bash
# Test health endpoint
curl https://[SERVICE-URL]/health

# Process a PDF
curl -X POST "https://[SERVICE-URL]/process" \
  -F "file=@invoice.pdf" \
  --output corrected.pdf
```

---

## Alternative: Keep GUI Local, Add Cloud Backend Option

### Hybrid Approach

**Best of both worlds:**

1. **Keep GUI locally** for interactive use
2. **Deploy API to Cloud Run** for batch processing
3. **GUI can call cloud API** for heavy processing

**Benefits:**
- Users still get desktop GUI experience
- Heavy processing offloaded to cloud
- Can handle large batches in cloud
- Cost-effective for occasional heavy use

**Implementation:**
```python
# In main_gui.py, add cloud processing option
if use_cloud_processing:
    response = requests.post(
        "https://[CLOUD-RUN-URL]/process",
        files={"file": pdf_file}
    )
    corrected_pdf = response.content
else:
    # Use local processing
    corrected_pdf = process_invoice(pdf_path)
```

---

## Cost Estimation

### Cloud Run Pricing
- **CPU:** $0.00002400 per vCPU-second
- **Memory:** $0.00000250 per GiB-second
- **Requests:** $0.40 per million
- **Free Tier:** 2 million requests/month

**Monthly estimate for 100 PDFs processed:**
- Processing time: 5 seconds each
- Memory: 1 GiB
- CPU: 1 vCPU
- **Cost:** ~$0.30/month

### Storage Costs (if using Cloud Storage)
- **Standard:** $0.020 per GB/month
- **Estimated:** $1-5/month (depending on PDF storage)

---

## Comparison Matrix

| Feature | Cloud Run | Cloud Functions | Compute Engine | App Engine |
|---------|-----------|-----------------|----------------|------------|
| **GUI Support** | ❌ | ❌ | ✅ (with RDP) | ❌ |
| **Scaling** | ✅ Auto | ✅ Auto | ❌ Manual | ✅ Auto |
| **Cost** | $ | $ | $$ | $$ |
| **Setup** | Medium | Medium | High | High |
| **API Access** | ✅ | ✅ (via HTTP) | ✅ (via API) | ✅ |
| **File Size** | 32MB default | Limited | Unlimited | 32MB |
| **Latency** | Low | Medium | Low | Low |
| **Best For** | API | Events | Desktop/GUI | Web Apps |

---

## Security Considerations

### For Cloud Deployment

1. **Authentication:**
   - Use Cloud IAM for access control
   - Require authentication for production
   - Use API keys for programmatic access

2. **Data Privacy:**
   - PDFs contain sensitive financial data
   - Ensure HTTPS only
   - Consider EU data residency if needed
   - Implement data retention policies

3. **Input Validation:**
   - Validate PDF file types
   - Limit file sizes
   - Sanitize filenames
   - Implement rate limiting

4. **Output Security:**
   - Secure file delivery
   - Automatic cleanup of temporary files
   - No persistent storage (unless required)
   - Logging and audit trail

---

## Next Steps

### Immediate Actions
1. ✅ Analyze current application structure (complete)
2. 📋 Create API wrapper around CLI logic
3. 🐳 Build Docker container
4. ☁️ Deploy to Cloud Run
5. 🧪 Test deployment
6. 📝 Document API usage

### Future Enhancements
- Add batch processing support
- Implement authentication
- Add progress tracking for large files
- Create web UI as alternative to desktop GUI
- Integrate with Cloud Storage for file management
- Add webhook support for async processing

---

## Conclusion

**Recommendation:** Deploy the CLI backend to **Cloud Run** as a web API service. This provides:
- Serverless PDF processing
- API access for integrations
- Cost-effective scaling
- Minimal operational overhead

**Keep:** The desktop GUI application for local interactive use, with the option to optionally call the cloud API for heavy processing.

**Outcome:** Best user experience (GUI for local use) + Scalable processing (Cloud for API/batch use).

---

**Questions or Need Help?**
- Review this guide
- Check GCP documentation for Cloud Run
- Test deployment in development environment first
- Start with small-scale deployment to validate

