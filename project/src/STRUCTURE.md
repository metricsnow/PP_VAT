# Source Module Structure

**Updated:** 2025-01-27  
**Status:** Clean, organized structure

## Directory Tree

```
project/src/
├── __init__.py                    # Main module exports
├── main.py                        # CLI entry point
├── README.md                      # Module documentation
├── STRUCTURE.md                   # This file
│
├── core/                          # Core business logic
│   ├── __init__.py               # Core module exports
│   ├── orchestrator.py           # Workflow orchestration (243 lines)
│   └── utils.py                  # PDF utilities (261 lines)
│
├── scripts/                       # Utility scripts
│   ├── __init__.py
│   ├── auto_vat_removal.py       # Main automated VAT removal ⭐
│   ├── detect_vat_demo.py        # VAT detection demonstration
│   └── extract_pdf_text.py      # Text extraction utility
│
├── configs/                       # Configuration examples
│   ├── config_example.json       # General invoice example
│   ├── config_example2.json      # GST/Australian example
│   └── config_hetzner.json       # German VAT example
│
└── test/                          # Test files
    ├── __init__.py
    ├── README.md
    ├── test_import.py            # Import testing
    ├── test_orchestrator.py      # Orchestrator tests
    └── test_vat_detection.py     # VAT detection tests
```

## Component Purposes

### Core Layer (`core/`)
**Purpose:** Core business logic and reusable components

- **`orchestrator.py`**: High-level coordination of PDF processing workflow
  - Loads/validates PDFs
  - Applies updates with highlighting
  - Automatic VAT detection
  - Manages save operations
  - Detailed logging

- **`utils.py`**: Low-level PDF manipulation utilities
  - PDF text operations
  - Rectangle drawing
  - Text insertion
  - VAT detection algorithms
  - Calculation functions

### Scripts Layer (`scripts/`)
**Purpose:** Standalone utility scripts

- **`auto_vat_removal.py`**: **Main automated system** ⭐
  - Complete automated workflow
  - VAT detection → Price extraction → Calculation → Highlighting
  - Uses proven yellow rectangle technique
  - Production-ready implementation

- **`detect_vat_demo.py`**: VAT detection demonstration
- **`extract_pdf_text.py`**: Text extraction for analysis

### Configuration Layer (`configs/`)
**Purpose:** Example configurations for different scenarios

- **`config_hetzner.json`**: German VAT (19% → 25%)
- **`config_example2.json`**: Australian GST (9% → 0%)
- **`config_example.json`**: General invoice fields

### Test Layer (`test/`)
**Purpose:** Testing and validation

- Import verification
- Orchestrator functionality tests
- VAT detection accuracy tests

## Usage

### Main Automated System (Recommended)
```bash
python project/src/scripts/auto_vat_removal.py
```

**What it does:**
1. Detects VAT percentage (8.1% for Swiss invoice)
2. Finds all product prices
3. Calculates prices without VAT
4. Applies yellow rectangles over prices
5. Overlays new prices
6. Saves to `example_1_clean.pdf`

### Using Core Components Directly

```python
from src.core.orchestrator import PDFInvoiceOrchestrator
from src.core.utils import PDFUtils

# Detect VAT
vat = PDFUtils.detect_vat_percentage(text)

# Process with orchestrator
orchestrator = PDFInvoiceOrchestrator(pdf_path, updates)
output = orchestrator.process()
```

## Import Paths

All imports use relative paths with fallbacks for flexibility:

```python
# In core/
try:
    from .utils import PDFUtils
except ImportError:
    try:
        from core.utils import PDFUtils
    except ImportError:
        from utils import PDFUtils
```

## Key Improvements

✅ **Clean separation**: Core logic, scripts, configs, tests  
✅ **Proper structure**: Follows Python package conventions  
✅ **No clutter**: All files in appropriate subfolders  
✅ **Easy navigation**: Clear hierarchy and naming  
✅ **Maintainable**: Each folder has clear purpose  

## Test Results

**Last Run:** 2025-01-27  
**Status:** ✅ All tests passing

```
Detected VAT: 8.1%
Found 10 prices to update
Applied yellow rectangles to all prices
Inserted new prices without VAT
Output: example_1_clean.pdf
```

## Files Generated

- `example_1_clean.pdf` - Corrected invoice with VAT removed
- Yellow rectangles over all prices
- New prices displayed
- Original preserved (no backup)

