# PP_VAT UI Module

**Split-Screen PDF Preview and VAT Correction Interface**

## Overview

Modern GUI interface for PP_VAT application featuring:
- **Split-screen preview**: Compare original vs corrected PDF side-by-side
- **Automatic VAT detection**: Displays detected VAT percentage
- **Live preview**: See corrections before saving
- **Save dialog**: Choose destination for corrected PDF

## Architecture

```
ui/
├── __init__.py                    # Module exports
├── main_window.py                 # Main application window
│   └── PP_VATMainWindow           # Split-screen interface
├── pdf_preview_widget.py          # PDF preview component
│   └── PDFPreviewWidget          # Renders PDF pages as images
└── README.md                      # This file
```

## Components

### PP_VATMainWindow

**Location**: `ui/main_window.py`

Main application window with three sections:

1. **Top Bar** (Load button + VAT info)
   - "Load PDF Invoice" button
   - Displays detected VAT percentage

2. **Split View** (Original ↔ Corrected)
   - Left: Original PDF preview
   - Right: Corrected PDF with VAT removed
   - Resizable splitter (50/50 by default)

3. **Bottom Bar** (Accept button)
   - "ACCEPT & SAVE" button (disabled until processing complete)
   - Opens file save dialog

### PDFPreviewWidget

**Location**: `ui/pdf_preview_widget.py`

Renders PDF pages as high-quality images:
- Loads PDF file
- Renders pages at 2x zoom for crisp display
- Scrollable content
- Error handling for invalid files

## Usage

### Launch GUI

```bash
# From project root
python project/src/main_gui.py

# Or from src directory
cd project/src
python main_gui.py
```

### Workflow

1. **Load PDF**
   - Click "Load PDF Invoice"
   - Select invoice file from dialog

2. **Processing**
   - System automatically detects VAT %
   - Displays percentage in top bar
   - Processes PDF with corrections
   - Shows preview on right side

3. **Review**
   - Compare original (left) vs corrected (right)
   - Check yellow highlights on prices
   - Verify corrected values

4. **Save**
   - Click "ACCEPT & SAVE"
   - Choose destination folder
   - Filename auto-suggested as `original_name_clean.pdf`

## Design System

Follows **monochrome minimalist design** from `previous_project_ressources`:

- **Colors**: Black (#000), White (#FFF), Gray (#DDD)
- **Typography**: System fonts, 12-14pt
- **Spacing**: 20px padding/margins
- **Buttons**: Black primary buttons with hover states

## Integration

### Code Integration

```python
from ui.main_window import PP_VATMainWindow
from PySide6.QtWidgets import QApplication

app = QApplication([])
window = PP_VATMainWindow()
window.show()
app.exec()
```

### Processing Logic

UI integrates with existing `scripts/auto_vat_removal.py`:
- Uses `extract_prices_and_positions()` function
- Uses `PDFUtils.detect_vat_percentage()` for detection
- Applies yellow highlights and price overlays

## Dependencies

```txt
PySide6>=6.6.0      # Qt framework
pymupdf>=1.24.0     # PDF processing
```

## Files Generated

- `_temp.pdf`: Temporary corrected version for preview
- `_clean.pdf`: Final output (user selects location)

## Error Handling

- **Invalid PDF**: Shows error message in preview
- **VAT Detection Failed**: Warns user, disables save button
- **Processing Error**: Shows error dialog with details
- **Save Error**: Prompts user with error message

## Future Enhancements

- [ ] Multi-page navigation (previous/next buttons)
- [ ] Zoom controls for PDF preview
- [ ] Batch processing interface
- [ ] Manual VAT override option
- [ ] Progress bar for large PDFs
- [ ] Keyboard shortcuts (Ctrl+O for load, Ctrl+S for save)

