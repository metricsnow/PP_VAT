# Importer Box Placement Logic Analysis

## Overview

The importer information box (yellow for review style, white for download style) is dynamically placed on the first page of processed PDF invoices. The placement logic uses a priority-based anchor system: shipping address line (priority 1), packlist row (priority 2), or default position (priority 3).

## Location

**File:** `project/src/main.py`  
**Function:** `add_importer_info_box(doc, country_code: str, output_style: str = "review")`  
**Lines:** 71-220

## Placement Algorithm

### 1. Initial Setup

```71:90:project/src/main.py
def add_importer_info_box(doc, country_code: str, output_style: str = "review"):
    """
    Add importer information box to the first page of the PDF.
    
    Args:
        doc: PyMuPDF document
        country_code: Country code to look up importer
        output_style: Output style - "review" for yellow, "download" for white
    """
    importer_info = get_importer_info(country_code)
    
    if not importer_info:
        print(f"[INFO] No importer info found for country code: {country_code}")
        return
    
    print(f"[INFO] Adding importer info box for {country_code}: {importer_info['importer']}")
    
    # Add to first page
    page = doc[0]
    page_rect = page.rect
```

**Key Points:**
- Only processes if importer info is found in CSV
- Always places on first page (`doc[0]`)
- Retrieves importer data from `project/src/configs/importers.csv`

### 2. Anchor Detection (Priority-Based)

The system searches for both shipping address line and packlist row, then uses a priority-based selection:

**Priority 1: Shipping Address Line**
- **Pattern:** Case-insensitive regex `r'shipping\s+addr'` (matches "Shipping Addr.:" or "Shipping Address:")
- **Validation:** Only used if it's positioned above the packlist row (smaller y0 coordinate = higher on page)

**Priority 2: Packlist Row**  
- **Pattern:** Case-insensitive regex `r'packinglist'`
- **Fallback:** Used when shipping address not found or positioned incorrectly

**Priority 3: Default Position**
- **Fallback:** `x=10, y=200` when neither anchor is found

**Algorithm Details:**
- **Search Scope:** First 50 text blocks from the page
- **Selection Logic:** Chooses the **lowest** (smallest y-coordinate) match for each anchor type
- **Validation:** Validates shipping address is above packlist before using it
- **Data Extraction:** Captures both `block_y0` (top Y) and `block_x0` (left X) from text blocks

### 3. Y-Position Calculation (Priority-Based Anchor Selection)

The system selects an anchor using priority logic:

```143:169:project/src/main.py
    if shipping_row_top is not None and packlist_row_top is not None:
        # Both found - validate that shipping address is above packlist (smaller y0 = higher on page)
        if shipping_row_top < packlist_row_top:
            # Shipping address is above packlist - use it as anchor
            anchor_row_top = shipping_row_top
            anchor_row_x0 = shipping_row_x0
            anchor_name = "shipping address line"
        else:
            # Shipping address is below packlist - use packlist as anchor instead
            anchor_row_top = packlist_row_top
            anchor_row_x0 = packlist_row_x0
            anchor_name = "packlist row"
    elif shipping_row_top is not None:
        # Only shipping address found - use it as anchor
        anchor_row_top = shipping_row_top
        anchor_row_x0 = shipping_row_x0
        anchor_name = "shipping address line"
    elif packlist_row_top is not None:
        # Only packlist found - use it as anchor
        anchor_row_top = packlist_row_top
        anchor_row_x0 = packlist_row_x0
        anchor_name = "packlist row"
```

**Calculation Formula:**
```
y_position = anchor_row_top - box_height - margin
```

Where:
- `anchor_row_top` = Y-coordinate of selected anchor row (shipping address or packlist)
- `box_height` = 50px (box height)
- `margin` = 8px (spacing between box bottom and anchor row)

**Result:** Box is positioned 8px above the selected anchor row's top edge.

### 4. X-Position Calculation (Alignment)

```169:175:project/src/main.py
    # Align box text with anchor text start
    if anchor_row_x0 is not None:
        # Offset box left by text padding (10px) so the text inside aligns with anchor text
        x = anchor_row_x0 - 10
        print(f"[INFO] Aligning box text with {anchor_name} text start at x={anchor_row_x0:.1f} (box at x={x:.1f})")
    else:
        x = 10  # Fallback: Left side with small padding
```

**Alignment Logic:**
- **With Anchor Found:** `x = anchor_row_x0 - 10`
  - Shifts box 10px to the left so internal text aligns with anchor text start
  - Maintains visual alignment with document structure (works for both shipping address and packlist)
- **Without Anchor:** `x = 10` (left side with 10px padding)

### 5. Box Dimensions

```116:120:project/src/main.py
    # Calculate box dimensions - accommodate full text but compact
    # Full importer name: "Cream della Cream Switzerland GmbH" = 40 chars
    # Full VAT number: "VAT Number: CHE-114.821.618" = 28 chars
    box_width = 290  # Compact width to fit content (increased by 10px on right side)
    box_height = 50  # Reduced height for more compact box
```

**Dimensions:**
- **Width:** 290px (was 280px, increased by 10px per BUG-002)
- **Height:** 50px (reduced for compact display)
- **Design Rationale:** Sized to fit full importer name (40 chars) and VAT number (28 chars)

### 6. Color Selection (Yellow vs White)

```145:148:project/src/main.py
    # Draw rectangle with appropriate color based on output style
    box_color = (1, 1, 0.85) if output_style == "review" else (1, 1, 1)
    box_rect = pymupdf.Rect(x, y, x + box_height, y + box_height)
    page.draw_rect(box_rect, color=box_color, fill=box_color)
```

**Color Logic:**
- **Review Style:** `(1, 1, 0.85)` = Light yellow (RGB normalized 0-1)
- **Download Style:** `(1, 1, 1)` = Pure white

**Note:** Line 147 has a bug - `x + box_height` should be `x + box_width` for the rectangle.

### 7. Text Content Placement

```150:218:project/src/main.py
    # Add text - 3 lines with tight spacing, vertically centered in box
    line_height = 14  # Tight spacing for compact box
    # Center text vertically in box: (box_height - (3 lines * line_height)) / 2 + base offset
    total_text_height = line_height * 2.5  # 2.5 line spacings for 3 lines of text
    text_y = y + (box_height - total_text_height) / 2 + line_height  # Vertically centered
    
    # Line 1: "Importer"
    try:
        page.insert_text(
            pymupdf.Point(x + 10, text_y),
            "Importer",
            fontsize=10.0,
            fontname="helv",
            color=(0, 0, 0),
            render_mode=0
        )
    except Exception:
        pass
    
    # Line 2: Importer name (full length - no truncation)
    importer_name = importer_info['importer']
    
    try:
        page.insert_text(
            pymupdf.Point(x + 10, text_y + line_height),
            importer_name,
            fontsize=9.0,
            fontname="helv",
            color=(0, 0, 0),
            render_mode=0
        )
    except Exception:
        # Fallback: try with basic encoding
        try:
            page.insert_text(
                pymupdf.Point(x + 10, text_y + line_height),
                importer_name.encode('ascii', 'ignore').decode(),
                fontsize=9.0,
                fontname="helv",
                color=(0, 0, 0),
                render_mode=0
            )
        except Exception:
            pass
    
    # Line 3: VAT Number
    vat_text = f"VAT Number: {importer_info['vat_number']}"
    try:
        page.insert_text(
            pymupdf.Point(x + 10, text_y + line_height * 2),
            vat_text,
            fontsize=8.5,
            fontname="helv",
            color=(0, 0, 0),
            render_mode=0
        )
    except Exception:
        # Fallback
        try:
            page.insert_text(
                pymupdf.Point(x + 10, text_y + line_height * 2),
                vat_text.encode('ascii', 'ignore').decode(),
                fontsize=8.5,
                fontname="helv",
                color=(0, 0, 0),
                render_mode=0
            )
        except Exception:
            pass
```

**Text Layout:**
- **Line 1:** "Importer" label (10pt, helvetica, black)
- **Line 2:** Full importer name (9pt, helvetica, black)
- **Line 3:** VAT number with label (8.5pt, helvetica, black)
- **Vertical Centering:** Calculated to center 3 lines within 50px box height
- **Horizontal Padding:** 10px from left edge (`x + 10`)
- **Encoding Fallback:** ASCII encoding fallback for special characters

## Flow Summary

1. **Trigger:** Country code detected → `add_importer_info_box()` called with `output_style`
2. **Anchor Detection:** Searches first 50 text blocks for both "shipping addr" and "packinglist" patterns (case-insensitive)
3. **Anchor Selection:**
   - If both found: Validates shipping address is above packlist (y-coordinate check)
   - If shipping address is above packlist → Uses shipping address as anchor
   - If shipping address not found or below packlist → Uses packlist row as anchor
   - If neither found → Uses default position (x=10, y=200)
4. **Y-Position:** Positions box 8px above selected anchor row
5. **X-Position:** Aligns box left edge 10px before anchor text start (for text alignment)
6. **Rendering:** Draws colored rectangle (290x50px), then inserts 3 lines of text

## Integration Point

The function is called during PDF processing:

```597:600:project/src/main.py
    # Add importer info box based on country code
    if country_code:
        print(f"\n[INFO] Detected country code: {country_code}")
        add_importer_info_box(doc, country_code, output_style)
```

**Integration Details:**
- Called after country code detection
- Uses same `output_style` parameter as price highlighting
- Runs before final PDF save operation

## Recent Updates

### 1. **Shipping Address Priority (2025-01-29)**
- Added priority-based anchor selection with shipping address as primary anchor
- Validates shipping address position relative to packlist before selection
- Improved logging to indicate which anchor was selected and why

### 2. **VAT Label Highlight Extension (2025-01-29)**
- Extended VAT label highlight rectangle to cover full VAT line including amount
- Rectangle now covers: opening parenthesis, percentage, "VAT:" label, amount number, and closing parenthesis
- Example: `(10,00 % VAT: 172,55)` fully highlighted

## Recommendations

1. **Fix Line 111:** Correct comparison to use `packlist_row_top`
2. **Fix Line 147:** Use `box_width` instead of `box_height` for rectangle width
3. **Error Handling:** Add validation for negative Y positions (when packlist is very high on page)
4. **Documentation:** Add inline comments explaining the coordinate system (PyMuPDF uses bottom-left origin)
5. **Testing:** Add unit tests for edge cases:
   - Multiple packlist matches
   - No packlist found
   - Packlist at top of page (potential negative Y)
   - Very wide/narrow packlist text

## Coordinate System Notes

PyMuPDF uses a coordinate system with:
- **Origin (0,0):** Bottom-left corner of page
- **Y-axis:** Increases upward
- **Text blocks:** Return coordinates as `[x0, y0, x1, y1, text, block_no, block_type]`
  - `y0` = top edge of text block
  - `y1` = bottom edge of text block

This explains why selecting the "lowest" packlist means finding the smallest `y0` value (closest to top of page).
