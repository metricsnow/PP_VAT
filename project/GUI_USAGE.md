# PP_VAT GUI Usage Guide

**Version**: 1.0  
**Date**: October 25, 2025  
**Framework**: PySide6

## Quick Start

### Launch the GUI

**Windows:**
```bash
cd project
launch_gui.bat
```

**Or directly:**
```bash
python project/src/main_gui.py
```

## Interface Overview

### Layout

```
┌─────────────────────────────────────────────────────────────┐
│  [Load PDF]                        [Detected VAT: 8.1%]     │ ← Top Bar
├─────────────────────────────────────────────────────────────┤
│                                                     │        │
│  Original PDF              Corrected PDF            │        │
│  ┌──────────────┐          ┌──────────────┐         │        │
│  │              │          │              │         │        │ ← Split View
│  │    PDF       │   ↔     │    PDF       │         │        │
│  │  Preview     │          │  (VAT        │         │        │
│  │              │          │  Removed)    │         │        │
│  └──────────────┘          └──────────────┘         │        │
│                                                     │        │
├─────────────────────────────────────────────────────────────┤
│                           [ACCEPT & SAVE]                    │ ← Bottom Bar
└─────────────────────────────────────────────────────────────┘
```

### Components

#### 1. Top Bar
- **Load PDF Invoice** button: Opens file dialog
- **VAT Info**: Shows detected VAT percentage (e.g., "Detected VAT: 8.1%")

#### 2. Split View
- **Left Panel**: Original PDF preview
- **Right Panel**: Corrected PDF with yellow highlights and new prices
- **Splitter**: Drag to resize panels

#### 3. Bottom Bar
- **ACCEPT & SAVE** button: Opens save dialog (disabled until processing complete)

## Workflow

### Step 1: Load PDF

1. Click **"Load PDF Invoice"** button
2. Navigate to your invoice file
3. Select PDF and click "Open"

**What happens:**
- PDF loads in left preview
- System detects VAT percentage
- Displays VAT % in top bar
- Processing begins automatically

### Step 2: Review

1. **Left Side**: View original PDF
   - Scroll to see all pages
   - Check original prices

2. **Right Side**: View corrected PDF
   - See yellow highlights on prices
   - Check corrected values

3. **VAT Info**: Verify detected VAT percentage is correct

### Step 3: Save

1. Click **"ACCEPT & SAVE"** button
2. Choose destination folder
3. Filename auto-suggested (e.g., `invoice_clean.pdf`)
4. Click "Save"

**Result:**
- Corrected PDF saved to selected location
- Yellow highlights indicate modified prices
- Original values remain visible

## Visual Indicators

### Yellow Highlights

All prices with VAT removed are highlighted with **yellow rectangles**:

- **Meaning**: These prices were modified
- **Location**: Right preview shows yellow highlights
- **Permanent**: Saves to output PDF

### Price Overlays

New prices are displayed next to originals:
- Original: `10.540,00`
- New: `9.740,00` (without VAT)

## Keyboard Shortcuts

- **Ctrl + O**: Open PDF file
- **Ctrl + S**: Save corrected PDF
- **Esc**: Close application

## Error Handling

### VAT Detection Failed

**Message**: "Could not detect VAT percentage"

**Solution**:
- Ensure PDF contains VAT text (19%, 25%, etc.)
- Check PDF is not corrupted
- Try another invoice

### Processing Error

**Message**: Shows specific error

**Common Causes**:
- PDF is locked/protected
- PDF is corrupted
- Invalid file format

**Solution**:
- Check PDF is text-based (not scanned)
- Try opening in PDF viewer first
- Verify file is not password-protected

### File Not Saved

**Message**: "Error saving PDF"

**Solution**:
- Check destination folder exists
- Ensure you have write permissions
- Try different folder location

## Troubleshooting

### GUI Doesn't Launch

**Check:**
```bash
python --version  # Should be Python 3.9+
pip install PySide6 pymupdf
```

### Import Errors

**Check:**
```bash
# Ensure you're in project directory
cd project

# Install dependencies
pip install -r requirements.txt
```

### PDF Preview Not Showing

**Possible causes:**
- PDF file is corrupted
- PDF is password-protected
- PDF is too large (>100MB)

**Solution:**
- Try another PDF file
- Check file size
- Verify PDF opens in viewer

## Technical Details

### PDF Processing

1. **VAT Detection**: Searches for VAT patterns
   - "19%", "25%", "MwSt 19%", etc.
   - Returns first valid match

2. **Price Extraction**: Finds all prices
   - Format: `1.540,00` (European)
   - Range: €10 - €100,000

3. **VAT Removal**: Calculates new price
   - Formula: `new_price = old_price / (1 + VAT% / 100)`
   - Rounds to 2 decimals

4. **Highlights**: Yellow rectangles over prices
   - RGB: (1, 1, 0.85)
   - 2px padding

5. **Price Overlay**: Inserts corrected values
   - Font: Helvetica, 8pt
   - Black color

### File Output

**Output Filename**: `{original_name}_clean.pdf`

**Example**:
- Input: `invoice.pdf`
- Output: `invoice_clean.pdf`

**Location**: User-selected directory

## Design System

Follows **monochrome minimalist design**:

- **Colors**: Black (#000), White (#FFF), Gray (#DDD)
- **Typography**: System fonts, 12-14pt
- **Layout**: Fixed 1400x900 window
- **Buttons**: Black primary, uppercase text

## Support

For issues or questions:
1. Check this guide
2. Review error messages
3. Check PDF file is valid
4. Verify dependencies installed

## Future Features

- [ ] Multi-page navigation controls
- [ ] Zoom controls for PDF preview
- [ ] Batch processing mode
- [ ] Manual VAT override
- [ ] Progress bar for large PDFs
- [ ] Keyboard shortcuts (Ctrl+O, Ctrl+S)
- [ ] Dark mode support
- [ ] PDF comparison mode

