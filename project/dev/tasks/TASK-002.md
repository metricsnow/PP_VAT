# TASK-002: Create FastAPI Backend Application Structure

**Status:** Waiting  
**Impact:** High  
**Description:** Create FastAPI web application with file upload endpoint and PDF processing integration  
**Date:** 2025-01-27  
**Estimated Effort:** 2 hours  
**Priority:** P0 - Blocking

---

## Objective

Create a FastAPI backend application that accepts PDF uploads, processes them using the existing PDF logic, and returns the corrected PDF.

## Context

FastAPI documentation shows how to handle file uploads with `UploadFile` and `File()`. We need to wrap the existing `process_invoice()` function from `src/main.py` to work with web requests.

## Current State

- PDF processing logic exists in `src/main.py::process_invoice()`
- CLI entry point: `src/main.py::main()`
- No web API exists yet

## Required Structure

Create new files:

```
project/src/web/
├── __init__.py
├── app.py                    # FastAPI application
├── routes.py                 # API routes
└── models.py                 # Pydantic models
```

## Implementation Tasks

### 1. Create Directory Structure
- [ ] Create `project/src/web/` directory
- [ ] Create `__init__.py`
- [ ] Create empty `app.py`, `routes.py`, `models.py`

### 2. Implement Models (`models.py`)

Create Pydantic models for API requests/responses:

```python
from pydantic import BaseModel
from typing import Optional

class ProcessingStatus(BaseModel):
    status: str
    message: str
    detected_vat: Optional[float] = None
    prices_updated: Optional[int] = None
    output_filename: Optional[str] = None

class HealthResponse(BaseModel):
    status: str
    version: str
```

### 3. Implement Main App (`app.py`)

```python
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.responses import HTMLResponse
import os

app = FastAPI(
    title="PP_VAT - Automated VAT Detection & Removal",
    description="Web application for automated VAT detection and price correction",
    version="1.0.0"
)

# Mount static files
static_dir = os.path.join(os.path.dirname(__file__), "..", "..", "static")
if os.path.exists(static_dir):
    app.mount("/static", StaticFiles(directory=static_dir), name="static")

# Import routes
from . import routes
app.include_router(routes.router)
```

### 4. Implement Routes (`routes.py`)

```python
from fastapi import APIRouter, UploadFile, File, HTTPException
from fastapi.responses import FileResponse, HTMLResponse
from typing import BinaryIO
import tempfile
from pathlib import Path
import sys

# Add parent directories to path for imports
sys.path.insert(0, str(Path(__file__).parent.parent))
sys.path.insert(0, str(Path(__file__).parent.parent.parent))

# Import existing processing logic
from src.main import process_invoice

router = APIRouter()

@router.get("/", response_class=HTMLResponse)
async def read_root():
    """Serve the main HTML page"""
    html_path = Path(__file__).parent.parent.parent / "static" / "index.html"
    if html_path.exists():
        return open(html_path).read()
    return "<h1>PP_VAT API</h1><p>HTML interface coming soon</p>"

@router.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "version": "1.0.0",
        "service": "PP_VAT Processor"
    }

@router.post("/api/process")
async def process_pdf(file: UploadFile = File(...)):
    """
    Process PDF invoice: detect VAT and remove from prices
    
    - **file**: PDF file to process
    - Returns: Processed PDF with VAT removed
    """
    # Validate file type
    if not file.filename.endswith('.pdf'):
        raise HTTPException(
            status_code=400,
            detail="Only PDF files are supported"
        )
    
    # Create temporary input file
    with tempfile.NamedTemporaryFile(suffix='.pdf', delete=False) as tmp_input:
        content = await file.read()
        tmp_input.write(content)
        input_path = Path(tmp_input.name)
    
    # Create temporary output directory
    temp_dir = Path(tempfile.mkdtemp())
    
    try:
        # Process PDF using existing logic
        output_path = process_invoice(input_path, "_corrected")
        
        if not output_path or not output_path.exists():
            raise HTTPException(
                status_code=500,
                detail="Failed to process PDF. VAT may not be detected."
            )
        
        # Return processed file
        return FileResponse(
            str(output_path),
            media_type='application/pdf',
            filename=f"{Path(file.filename).stem}_corrected.pdf",
            background=BackgroundTask(cleanup_temp_files, input_path, output_path)
        )
    
    except Exception as e:
        # Cleanup on error
        cleanup_temp_files(input_path, None)
        raise HTTPException(
            status_code=500,
            detail=f"Processing error: {str(e)}"
        )

def cleanup_temp_files(*paths):
    """Clean up temporary files"""
    for path in paths:
        if path and Path(path).exists():
            try:
                Path(path).unlink()
            except Exception:
                pass
```

## Dependencies

- TASK-001: Add web dependencies to requirements.txt
- Existing: `src/main.py` with `process_invoice()` function

## Acceptance Criteria

- [ ] FastAPI app structure created in `src/web/`
- [ ] Health check endpoint returns 200
- [ ] File upload endpoint accepts PDF files
- [ ] Upload endpoint returns processed PDF
- [ ] Temporary files are cleaned up after processing
- [ ] Error handling for invalid files and processing failures
- [ ] Follows FastAPI best practices (Pydantic models, async/await)

## Notes

- Use async/await for file operations for better performance
- Cleanup temporary files after response is sent using BackgroundTask
- Maintain compatibility with existing PDF processing logic
- Error messages should be user-friendly

## Testing

```bash
# Start development server
cd project
uvicorn src.web.app:app --reload --port 8000

# Test health endpoint
curl http://localhost:8000/health

# Test processing endpoint
curl -X POST "http://localhost:8000/api/process" \
  -F "file=@example_1.PDF" \
  --output corrected.pdf
```

## References

- FastAPI docs: https://fastapi.tiangolo.com/
- File uploads: `src/main.py::process_invoice()`
- Project structure: `project/src/`

