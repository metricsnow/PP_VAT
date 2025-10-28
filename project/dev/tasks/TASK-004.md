# TASK-004: Integrate VAT Detection Display in API Response

**Status:** Waiting  
**Impact:** Medium  
**Description:** Enhance API to return VAT detection results for display in frontend  
**Date:** 2025-01-27  
**Estimated Effort:** 1 hour  
**Priority:** P1 - Important

---

## Objective

Modify the PDF processing API to return metadata (VAT percentage, prices updated count) along with the processed PDF, enabling the frontend to display detection results.

## Context

Current API returns only the processed PDF file. The frontend needs additional information like:
- Detected VAT percentage
- Number of prices updated
- Processing status

## Current State

`src/web/routes.py` returns only the PDF file via `FileResponse`:

```python
return FileResponse(
    str(output_path),
    media_type='application/pdf',
    filename=f"{Path(file.filename).stem}_corrected.pdf"
)
```

The `process_invoice()` function in `src/main.py` processes files but only returns the output path.

## Implementation Options

### Option A: Dual Endpoint Approach (Recommended)

Create two endpoints:
1. `/api/process` - Returns JSON with processing results + PDF download link
2. `/api/download/{filename}` - Returns the actual PDF file

### Option B: Multipart Response

Return JSON as metadata and PDF as binary attachment (complex)

**Decision:** Use Option A for clarity and RESTful design

## Implementation Tasks

### 1. Modify `src/main.py`

Extract processing metadata from `process_invoice()`:

```python
def process_invoice(pdf_path: Path, output_suffix: str = "_clean"):
    """
    Process PDF invoice: detect VAT, remove from prices, highlight changes.
    
    Returns:
        tuple: (output_path, metadata_dict) where metadata contains:
            - detected_vat: float
            - prices_count: int
            - processing_time: float
    """
    # ... existing processing logic ...
    
    # After detecting VAT
    detected_vat = PDFUtils.detect_vat_percentage(full_text)
    
    # After finding prices
    all_prices = extract_prices_and_positions(doc, detected_vat)
    prices_count = len(all_prices)
    
    # ... rest of processing ...
    
    # Return both path and metadata
    metadata = {
        "detected_vat": detected_vat,
        "prices_count": prices_count,
        "success": True
    }
    
    return output_path, metadata
```

### 2. Update `src/web/routes.py`

Add metadata endpoint and temporary storage:

```python
from fastapi import APIRouter, UploadFile, File, HTTPException
from fastapi.responses import FileResponse, JSONResponse
import tempfile
from pathlib import Path
from datetime import datetime, timedelta
import hashlib

router = APIRouter()

# Temporary storage for processed PDFs (in production, use Redis/database)
processed_files = {}

@router.post("/api/process")
async def process_pdf(file: UploadFile = File(...)):
    """
    Process PDF invoice and return metadata with download link
    """
    # ... existing file validation ...
    
    try:
        # Process PDF (modified to return metadata)
        output_path, metadata = process_invoice(input_path, "_corrected")
        
        if not output_path or not output_path.exists():
            raise HTTPException(status_code=500, detail="Processing failed")
        
        # Generate unique download token
        file_hash = hashlib.md5(file.filename.encode()).hexdigest()
        timestamp = datetime.now().strftime("%Y%m%d%H%M%S")
        download_token = f"{file_hash}_{timestamp}"
        
        # Store file info for download
        processed_files[download_token] = {
            "path": output_path,
            "original_filename": file.filename,
            "expires_at": datetime.now() + timedelta(hours=1)
        }
        
        # Return metadata with download link
        return JSONResponse(content={
            "status": "success",
            "detected_vat": metadata.get("detected_vat"),
            "prices_updated": metadata.get("prices_count"),
            "download_token": download_token,
            "download_url": f"/api/download/{download_token}"
        })
    
    except Exception as e:
        cleanup_temp_files(input_path, None)
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/api/download/{token}")
async def download_processed_pdf(token: str):
    """
    Download processed PDF by token
    """
    if token not in processed_files:
        raise HTTPException(status_code=404, detail="File not found or expired")
    
    file_info = processed_files[token]
    
    # Check expiration
    if datetime.now() > file_info["expires_at"]:
        del processed_files[token]
        raise HTTPException(status_code=410, detail="Download link expired")
    
    # Return file
    return FileResponse(
        str(file_info["path"]),
        media_type='application/pdf',
        filename=f"{Path(file_info['original_filename']).stem}_corrected.pdf"
    )
```

### 3. Update Frontend JavaScript

Modify `static/js/app.js` to handle new response format:

```javascript
async function handleFile(file) {
  // ... existing validation ...
  
  try {
    const response = await fetch('/api/process', {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Processing failed');
    }

    const result = await response.json();
    
    // Update VAT display
    vatPercentage.textContent = `${result.detected_vat}%`;
    document.getElementById('pricesUpdated').textContent = 
      `${result.prices_updated} prices updated`;

    // Download the processed PDF
    const pdfResponse = await fetch(result.download_url);
    processedPdfBlob = await pdfResponse.blob();
    processedPdfName = file.name.replace('.pdf', '_corrected.pdf');
    
    // Create URLs for preview
    const originalUrl = URL.createObjectURL(file);
    const correctedUrl = URL.createObjectURL(processedPdfBlob);
    
    // Update iframes
    originalPdf.src = originalUrl;
    correctedPdf.src = correctedUrl;

  } catch (error) {
    showError(error.message);
  }
}
```

## Dependencies

- TASK-002: FastAPI backend implementation
- TASK-003: HTML frontend (for integration)

## Acceptance Criteria

- [ ] API returns JSON with VAT percentage and prices count
- [ ] Download token system works correctly
- [ ] Download links expire after 1 hour
- [ ] Frontend displays VAT percentage from API
- [ ] Frontend displays prices updated count
- [ ] All temporary files are cleaned up
- [ ] Error handling for expired links

## Testing

```bash
# Test processing endpoint
curl -X POST "http://localhost:8000/api/process" \
  -F "file=@example_1.PDF"

# Expected response:
# {
#   "status": "success",
#   "detected_vat": 8.1,
#   "prices_updated": 15,
#   "download_token": "abc123_def456",
#   "download_url": "/api/download/abc123_def456"
# }

# Test download endpoint
curl "http://localhost:8000/api/download/abc123_def456" --output corrected.pdf
```

## Notes

- Use proper storage (Redis/database) in production instead of in-memory dict
- Consider adding cleanup job to remove expired entries
- Token-based approach is more secure than exposing file paths
- Add rate limiting to prevent abuse

## References

- FastAPI: https://fastapi.tiangolo.com/
- File processing: `src/main.py`

