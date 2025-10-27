# PDF Invoice Processor - Source Module

**Version:** 1.0.0  
**Author:** Marcus  
**Date:** 2025-01-27

## Overview

Automated VAT detection and removal system that processes PDF invoices by identifying VAT percentages, finding product prices, removing VAT, and highlighting changes with yellow rectangles.

## Module Structure

```
src/
├── __init__.py           # Module initialization and exports
├── main.py               # Command-line entry point
├── main_gui.py           # GUI entry point
├── README.md             # This file
├── core/                 # Core functionality
│   ├── __init__.py       # Core module exports
│   ├── orchestrator.py   # High-level workflow orchestration
│   └── utils.py          # Low-level PDF utilities
├── scripts/              # Utility scripts
│   ├── __init__.py
│   ├── auto_vat_removal.py    # Automated VAT removal (MAIN)
│   ├── detect_vat_demo.py     # VAT detection demo
│   └── extract_pdf_text.py    # Text extraction utility
├── ui/                   # GUI interface
│   ├── __init__.py       # UI module exports
│   ├── main_window.py    # Main application window
│   ├── pdf_preview_widget.py  # PDF preview component
│   └── README.md         # UI documentation
├── configs/              # Configuration examples
│   ├── config_example.json
│   ├── config_example2.json
│   └── config_hetzner.json
└── test/                 # Test files
    ├── __init__.py
    ├── README.md
    ├── test_import.py
    ├── test_orchestrator.py
    └── test_vat_detection.py
```

## Core Components

### 1. Core Module (`core/`)

#### `orchestrator.py`
High-level PDF processing workflow coordinator.

**Key Features:**
- Loads and validates PDF documents
- Applies text updates with highlighting
- Manages backup creation (optional)
- Saves modified PDFs
- Detects VAT percentage automatically

**Usage:**
```python
from src.core.orchestrator import PDFInvoiceOrchestrator

updates = [{'search': 'text', 'replace': 'new'}]
orchestrator = PDFInvoiceOrchestrator(pdf_path, updates)
output = orchestrator.process()
```

#### `utils.py`
Low-level PDF manipulation utilities.

**Key Functions:**
- `open_pdf()` - Open PDF documents
- `find_text_positions()` - Find text in PDFs
- `highlight_rect()` - Draw yellow rectangles
- `insert_text()` - Overlay text on PDF pages
- `detect_vat_percentage()` - Extract VAT from text
- `calculate_tax_amount()` - Calculate tax amounts
- `calculate_total()` - Calculate totals

### 2. Scripts Module (`scripts/`)

#### `auto_vat_removal.py` - Main Automated VAT Removal
**Features:**
- Automatic VAT percentage detection
- Product price extraction
- VAT removal calculation
- Yellow rectangle highlighting
- Price overlay

**Run:**
```bash
python -m src.scripts.auto_vat_removal
```

Or directly:
```bash
python project/src/scripts/auto_vat_removal.py
```

## Quick Start

### Using GUI (Recommended)

```bash
# Run the GUI application
cd project
python src/main_gui.py

# Or use the launcher script (Windows)
launch_gui.bat
```

The GUI provides:
- Split-screen preview (original vs corrected)
- Automatic VAT detection
- Live preview before saving
- Easy-to-use interface

See `project/GUI_USAGE.md` for detailed usage instructions.

### Using Automated VAT Removal (Command Line)

```bash
# Run the automated VAT removal system
python project/src/scripts/auto_vat_removal.py
```

This will:
1. Detect VAT percentage in the invoice
2. Find all product prices
3. Calculate prices without VAT
4. Apply yellow rectangles over prices
5. Overlay new prices
6. Save to `example_1_clean.pdf`

### Using Orchestrator (Manual Configuration)

```bash
# Use orchestrator with manual config
python -m src.main project/examples/example_1.PDF project/src/configs/config_hetzner.json
```

## Workflow

1. **VAT Detection**: Automatically identifies VAT percentage (e.g., 8.1%, 19%, 25%)
2. **Price Extraction**: Finds all product prices in European format (1.540,00)
3. **Calculation**: Computes prices without VAT: `new_price = old_price / (1 + VAT%)`
4. **Highlighting**: Draws yellow rectangles over original prices
5. **Overlay**: Inserts new prices on top of yellow rectangles
6. **Output**: Saves corrected PDF with `_clean.pdf` suffix

## Example Output

```
================================================================================
Automated VAT Removal System
================================================================================

[INFO] Loading PDF: example_1.PDF
[INFO] Detecting VAT percentage...
[SUCCESS] Detected VAT: 8.1%
[INFO] Calculating prices without VAT...
  Formula: new_price = old_price / (1 + 8.1%)

[INFO] Found 10 prices to update
[1/10] Processing: 1.540,00 (1540.0) -> 1424.61
    [DONE] Yellow highlight applied
    [DONE] New price '1424,61' inserted

[SUCCESS] File created: example_1_clean.pdf
```

## API Usage

```python
from project.src.core.orchestrator import PDFInvoiceOrchestrator
from project.src.core.utils import PDFUtils
from pathlib import Path

# Load PDF
pdf_path = Path("invoice.pdf")
orchestrator = PDFInvoiceOrchestrator(
    pdf_path=pdf_path,
    updates=[],  # Empty for auto mode
    output_suffix="_clean"
)
orchestrator.load()

# Detect VAT
vat = orchestrator.detect_and_print_vat()

# Process automatically
output = orchestrator.process()
```

## Configuration

### Automated Mode (Recommended)
- No configuration needed
- Automatic VAT detection
- Automatic price detection
- Automatic calculation

### Manual Mode
Create JSON configuration:
```json
[
    {
        "search": "19 %",
        "replace": "25 %",
        "font_size": 8.0,
        "offset": [0, 0]
    }
]
```

## Output

- **Output filename**: Original name with `_clean.pdf` suffix
- **No backups**: Original file preserved
- **Yellow rectangles**: Highlight all modified prices
- **Overlay text**: New prices displayed over yellow boxes

## See Also

- PRD: `project/docs/prd.md` - Complete product requirements
- Configuration examples: `project/src/configs/`
- Test files: `project/src/test/`
