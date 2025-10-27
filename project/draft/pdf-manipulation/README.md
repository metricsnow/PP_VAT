# PDF Invoice Updater

Utility script to update PDF invoices by overlaying text at specified positions.

## Overview

This script uses **PyMuPDF** (approach 3 - overlay updates) to:
1. Find specific text in a PDF invoice
2. Overlay new text at the same position
3. Save the updated PDF with `_updated` suffix

## Installation

Install required dependencies:

```bash
pip install pymupdf
```

Or add to your requirements:

```
pymupdf>=1.24.0
```

## Usage

### Basic Usage

```bash
python pdf_invoice_updater.py invoice.pdf
```

### With Configuration File

Create a JSON file with update criteria:

```json
[
    {
        "search": "Total:",
        "replace": "Total: $1,234.56",
        "font_size": 12,
        "offset": [0, 0]
    },
    {
        "search": "Invoice #",
        "replace": "Invoice #ABC-123",
        "font_size": 10,
        "offset": [0, -2]
    }
]
```

Then run:

```bash
python pdf_invoice_updater.py invoice.pdf config.json
```

## Configuration Parameters

Each update in the configuration array can have:

- **search** (required): Text to find in the PDF
- **replace** (required): New text to overlay
- **font_size** (optional): Font size for new text (default: 11)
- **offset** (optional): Pixel offset `[x, y]` to adjust position (default: `[0, 0]`)

## How It Works

1. **Search**: Finds all occurrences of the search text in the PDF
2. **Position**: Extracts the coordinates (x, y) where the text appears
3. **Overlay**: Places new text at the same position
4. **Adjust**: Optional offset to fine-tune positioning
5. **Save**: Creates a new PDF with `_updated` suffix

## Example Workflow

1. Identify text in your invoice (e.g., "Total: $100.00")
2. Create configuration with search text and replacement
3. Run script: `python pdf_invoice_updater.py invoice.pdf`
4. Output: `invoice_updated.pdf`

## Limitations

- Text overlay only (doesn't modify underlying PDF structure)
- Position matching may need fine-tuning with `offset` parameter
- Works best with text-based PDFs (scanned images won't work)
- Original text may still be visible through overlay (depends on PDF structure)

## Tips

- Use small font sizes for precise positioning
- Adjust `offset` if text doesn't align properly
- Test with one update first before processing multiple
- Check PDF structure with `pdf_info` if text isn't found

## Troubleshooting

**Text not found**
- Verify exact spelling and spacing in search text
- Check if PDF text is selectable (not scanned image)

**Position misalignment**
- Use negative `offset` values to move left/up
- Use positive `offset` values to move right/down
- Adjust `font_size` if text appears too large/small

**Overlay not visible**
- Original text may be covering overlay
- Try larger `font_size` or different colors

## Python API Usage

```python
from pdf_invoice_updater import PDFInvoiceUpdater

updates = [
    {
        'search': 'Total:',
        'replace': 'Total: $1,500.00',
        'font_size': 12,
        'offset': (0, 0)
    }
]

updater = PDFInvoiceUpdater('invoice.pdf', updates)
output_path = updater.process()
```

