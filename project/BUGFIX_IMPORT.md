# Bug Fix: Processing Module Import

**Date:** 2025-01-27  
**Issue:** "Processing module not found" when uploading PDF  
**Status:** ✅ Fixed

---

## Problem

When uploading a PDF file, the application returned:
```
"Processing module not found"
```

The error occurred when trying to import `process_invoice` function from `main.py`.

---

## Root Cause

Incorrect import path in `routes.py`:
```python
# Before (incorrect):
from src.main import process_invoice
```

The path was looking for `src.main` but the module is in the current directory as `main.py`.

---

## Solution

Fixed the import statement to use correct relative path:

```python
# After (correct):
sys.path.insert(0, str(PROJECT_ROOT / "project" / "src"))
from main import process_invoice
```

---

## Files Modified

- **`project/src/web/routes.py`** (Line 214-217)
  - Changed from `from src.main import process_invoice`
  - To: `from main import process_invoice`
  - Added proper error message with exception details

---

## How It Works Now

1. Adds `project/src` to Python path
2. Imports `process_invoice` from `main.py` in that directory
3. Uses it to process the uploaded PDF
4. Returns processed PDF with VAT removed

---

**Status:** Fixed! Upload your PDF now. 🚀

