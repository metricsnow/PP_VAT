# Bug Fix: PDF Extension Case Sensitivity

**Date:** 2025-01-27  
**Issue:** File upload failed with "Only PDF files are supported" for files with `.PDF` extension  
**Status:** ✅ Fixed

---

## Problem

When uploading files with uppercase `.PDF` extension (e.g., `example_2.PDF`), the application returned:
```
"Only PDF files are supported"
```

The validation was case-sensitive and only accepted lowercase `.pdf` files.

---

## Root Cause

The file extension validation used `.endswith('.pdf')` which is case-sensitive:
- ✅ Accepted: `file.pdf`
- ❌ Rejected: `file.PDF`
- ❌ Rejected: `file.Pdf`

---

## Solution

Changed validation to be **case-insensitive** by converting to lowercase before checking:

### Backend (routes.py)
```python
# Before:
if not file.filename.endswith('.pdf'):

# After:
if not file.filename.lower().endswith('.pdf'):
```

### Frontend (app.js)
```javascript
// Before:
if (!file.name.endsWith('.pdf')) {

// After:
if (!file.name.toLowerCase().endsWith('.pdf')) {
```

---

## Files Modified

1. **`project/src/web/routes.py`** (Line 203)
   - Added `.lower()` before `.endswith('.pdf')`

2. **`project/static/js/app.js`** (Line 112)
   - Added `.toLowerCase()` before `.endsWith('.pdf')`

---

## Testing

Now accepts:
- ✅ `.pdf`
- ✅ `.PDF`
- ✅ `.Pdf`
- ✅ `.pDf`

---

**Status:** Fixed and deployed! 🎉

