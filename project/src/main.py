"""
Automated VAT Removal System - Main Production Entry Point

Automatically detects VAT percentage, finds product prices, removes VAT,
and highlights changes with yellow rectangles.

Usage:
    python -m src.main <pdf_file> [output_suffix]
    
Example:
    python -m src.main project/examples/example_1.PDF
    python -m src.main invoice.pdf _corrected
"""

import sys
from pathlib import Path
import re
import pymupdf

# Import PDFUtils - add current directory to path
sys.path.insert(0, str(Path(__file__).parent))

# Direct import from docs/core
import importlib.util
spec = importlib.util.spec_from_file_location(
    "utils",
    Path(__file__).parent.parent / "docs" / "core" / "utils.py"
)
utils_module = importlib.util.module_from_spec(spec)
spec.loader.exec_module(utils_module)
PDFUtils = utils_module.PDFUtils


def extract_prices_and_positions(doc, detected_vat):
    """
    Extract all prices and their positions from PDF.
    
    Returns:
        List of tuples: (page_num, position, rect, original_value, new_value)
    """
    all_prices = []
    
    for page_num in range(len(doc)):
        page = doc[page_num]
        
        print(f"\n[INFO] Searching for prices on page {page_num + 1}...")
        
        # Search for European price format: "1.540,00" or "1540,00"
        price_pattern = r'\d{1,3}(?:\.\d{3})*,\d{2}'
        
        text_blocks = page.get_text("blocks")
        text_only_blocks = [b for b in text_blocks if b[6] == 0]
        
        for block in text_only_blocks:
            block_text = block[4]
            matches = re.finditer(price_pattern, block_text)
            
            for match in matches:
                price_str = match.group(0)
                
                # Skip dates and small values
                if re.match(r'\d{2}[\.]\d{2}[\.]\d{4}', price_str):
                    continue
                if re.match(r'\d{2}[\.]\d{2}', price_str) and float(price_str.replace(',', '.')) < 50:
                    continue
                
                try:
                    price_without_thousands = price_str.replace('.', '')
                    price_float = float(price_without_thousands.replace(',', '.'))
                    
                    # Skip discount percentages - small values (< 100) with % sign nearby
                    block_context = block_text[max(0, block_text.find(price_str) - 30):block_text.find(price_str) + len(price_str) + 30]
                    
                    # Check if this is a discount percentage
                    has_percent_sign = '%' in block_context
                    percent_position = block_context.find('%') if has_percent_sign else -1
                    price_position_in_context = block_context.find(price_str)
                    
                    # Skip if it's a value < 100 and has % sign nearby
                    if price_float < 100 and has_percent_sign and percent_position != -1:
                        # Check if % sign is within reasonable distance
                        distance_to_percent = abs(percent_position - (price_position_in_context + len(price_str)))
                        if distance_to_percent < 20:  # % is close to the number
                            continue  # Skip all small values with % nearby
                    
                    # Always skip very small values (likely errors or percentages)
                    if price_float < 10:
                        continue
                    
                    # Additional check: if value is between 10-100, be more careful
                    if 10 <= price_float < 100:
                        # Check context for percentage indicators
                        context_before = block_context[:price_position_in_context].lower()
                        if '%' in block_context or any(word in context_before for word in ['rabatt', 'discount', 'reduktion', 'reduction', '-']):
                            # Skip if it appears near percentage-related keywords
                            if any(keyword in block_context.lower() for keyword in ['%', 'rabatt', 'discount', '- ']):
                                continue
                    
                    if 10 <= price_float <= 100000:
                        search_results = page.search_for(price_str)
                        
                        for text_rect in search_results:
                            new_value = price_float / (1 + detected_vat / 100)
                            new_value = round(new_value, 2)
                            
                            # Check for duplicates
                            duplicate = False
                            for existing in all_prices:
                                if (existing[0] == page_num and 
                                    abs(existing[2].x0 - text_rect.x0) < 5 and 
                                    abs(existing[2].y0 - text_rect.y0) < 5):
                                    duplicate = True
                                    break
                            
                            if not duplicate:
                                all_prices.append((
                                    page_num,
                                    (text_rect.x0, text_rect.y1),
                                    text_rect,
                                    price_float,
                                    new_value,
                                    price_str
                                ))
                                
                                print(f"  Found price: {price_str} ({price_float}) -> {new_value:.2f} (VAT {detected_vat}% removed)")
                                
                except (ValueError, AttributeError):
                    continue
    
    return all_prices


def process_invoice(pdf_path: Path, output_suffix: str = "_clean"):
    """
    Process PDF invoice: detect VAT, remove from prices, highlight changes.
    
    Args:
        pdf_path: Path to PDF invoice
        output_suffix: Suffix for output filename
        
    Returns:
        Path to processed PDF
    """
    print(f"\n{'='*80}")
    print(f"Automated VAT Removal System")
    print(f"{'='*80}\n")
    
    # Load PDF
    print(f"[INFO] Loading PDF: {pdf_path}")
    doc = pymupdf.open(str(pdf_path))
    
    # Extract text and detect VAT
    full_text = ""
    for page_num, page in enumerate(doc):
        full_text += page.get_text()
    
    print(f"[INFO] Detecting VAT percentage...")
    detected_vat = PDFUtils.detect_vat_percentage(full_text)
    
    if detected_vat is None:
        print(f"[ERROR] Could not detect VAT percentage")
        doc.close()
        return None
    
    print(f"[SUCCESS] Detected VAT: {detected_vat}%")
    print(f"[INFO] Calculating prices without VAT...")
    print(f"  Formula: new_price = old_price / (1 + {detected_vat}%)")
    
    # Find all prices
    all_prices = extract_prices_and_positions(doc, detected_vat)
    
    print(f"\n[INFO] Found {len(all_prices)} prices to update")
    
    if not all_prices:
        print(f"[WARNING] No prices found to update")
        doc.close()
        return None
    
    # STEP 1: Find and highlight VAT-related items FIRST (lowest layer)
    print(f"[INFO] Detecting VAT amount from document...")
    
    # Try to detect the actual VAT amount from the document
    # Look for the last price on the page near VAT label - that's usually the VAT amount
    vat_amount_rects = []
    vat_amount_values = []
    vat_amount_detected = None
    
    for page_num in range(len(doc)):
        page = doc[page_num]
        text = page.get_text()
        # Look for pattern like "(8,10 % VAT: 240,31)" or "(8.10 % VAT: 240.31)"
        vat_match = re.search(rf'\({detected_vat}.*?%\s*VAT[:\s]*(\d[\d.,]+)', text, re.IGNORECASE)
        if vat_match:
            vat_amount_str = vat_match.group(1)
            try:
                vat_amount_without_thousands = vat_amount_str.replace('.', '')
                vat_amount_detected = float(vat_amount_without_thousands.replace(',', '.'))
                print(f"  -> Detected VAT amount: {vat_amount_detected}")
                # Find all occurrences of this value and mark them
                search_results = page.search_for(vat_amount_str)
                for rect in search_results:
                    vat_amount_rects.append((page_num, rect))
                    vat_amount_values.append(vat_amount_detected)
                break
            except (ValueError, AttributeError):
                pass
    
    if vat_amount_detected is None:
        print(f"  -> Could not detect VAT amount from document")
    
    # Find and highlight the VAT label text "(8,10 % VAT:" FIRST
    print(f"[INFO] Searching for VAT label to highlight...")
    for page_num in range(len(doc)):
        page = doc[page_num]
        # Search for "VAT" text and check nearby context
        search_results = page.search_for("VAT")
        
        for rect in search_results:
            # Get a larger area around "VAT" to check for VAT percentage
            expanded_search_rect = pymupdf.Rect(
                rect.x0 - 150,  # Expand left to catch the percentage
                rect.y0 - 10,
                rect.x1 + 50,  # Expand right
                rect.y1 + 10
            )
            text_near = page.get_text("text", clip=expanded_search_rect)
            
            # Check if this text contains the VAT pattern like "(8,10 % VAT" or "(8.10 % VAT"
            if re.search(rf'{detected_vat}', text_near) and re.search(r'VAT', text_near, re.IGNORECASE):
                # Draw yellow highlight over the entire VAT label area
                padding = 2
                # Extend the highlight to cover the full text area
                expanded_rect = pymupdf.Rect(
                    rect.x0 - 100,  # Cover the percentage part
                    rect.y0 - padding,
                    rect.x1 + 50,
                    rect.y1 + padding
                )
                page.draw_rect(expanded_rect, color=(1, 1, 0.85), fill=(1, 1, 0.85))
                print(f"  -> VAT label highlighted on page {page_num + 1}")
                break  # Only highlight once per page
    
    # STEP 2: Apply highlights for VAT amount line
    print(f"[INFO] Drawing VAT amount highlights (empty boxes)...")
    
    # STEP 3: Collect all highlights and text overlays separately
    highlights = []  # Store yellow rectangles
    text_overlays = []  # Store text to insert
    
    for idx, (page_num, pos, rect, old_value, new_value, orig_str) in enumerate(all_prices):
        page = doc[page_num]
        
        print(f"[{idx+1}/{len(all_prices)}] Processing: {orig_str} ({old_value}) -> {new_value:.2f}")
        
        # Check if this is a VAT amount line (highlight only, no new value)
        is_vat_amount_line = False
        
        # Check nearby text for VAT label indicators
        expanded_search_rect = pymupdf.Rect(
            rect.x0 - 100,
            rect.y0 - 30,
            rect.x1 + 100,
            rect.y1 + 30
        )
        page_text_near = page.get_text("text", clip=expanded_search_rect)
        
        # Check if nearby text contains VAT pattern like "(10.0 % VAT:"
        if re.search(rf'{detected_vat}.*?%.*?VAT', page_text_near, re.IGNORECASE):
            # This price is near a VAT label
            # VAT amounts are typically smaller values (< 500) near the bottom of financial summaries
            # Only flag smaller values as VAT amounts (avoid flagging large totals)
            if old_value < 500:
                is_vat_amount_line = True
                print(f"  -> VAT amount line near VAT label ({old_value}): highlighting only (empty box, no new value)")
        
        # Also check if this matches any detected VAT amount values
        if vat_amount_detected is not None:
            if abs(old_value - vat_amount_detected) < 0.01:
                is_vat_amount_line = True
                print(f"  -> VAT amount line ({old_value}): highlighting only (empty box, no new value)")
            for vat_val in vat_amount_values:
                if abs(old_value - vat_val) < 0.01:
                    is_vat_amount_line = True
                    print(f"  -> VAT amount line ({old_value}): highlighting only (empty box, no new value)")
                    break
        
        # Store highlight
        padding = 2
        expanded_rect = pymupdf.Rect(
            rect.x0 - padding,
            rect.y0 - padding,
            rect.x1 + padding,
            rect.y1 + padding
        )
        highlights.append((page_num, expanded_rect))
        
        # Store text overlay (only for non-VAT amounts)
        if not is_vat_amount_line:
            new_price_str = f"{new_value:.2f}".replace('.', ',')
            adjusted_pos = (pos[0], pos[1] - 1)  # Move text slightly up
            text_overlays.append((page_num, adjusted_pos, new_price_str))
    
    # STEP 4: Draw all highlights first (bottom layer)
    for page_num, expanded_rect in highlights:
        page = doc[page_num]
        page.draw_rect(expanded_rect, color=(1, 1, 0.85), fill=(1, 1, 0.85))
    
    # STEP 5: Insert all text on top (top layer)
    for page_num, adjusted_pos, new_price_str in text_overlays:
        page = doc[page_num]
        point = pymupdf.Point(adjusted_pos[0], adjusted_pos[1])
        
        try:
            page.insert_text(
                point,
                new_price_str,
                fontsize=8.0,
                fontname="helv",
                color=(0, 0, 0),
                render_mode=0
            )
        except Exception:
            page.insert_text(
                point,
                new_price_str.replace('€', 'EUR'),
                fontsize=8.0,
                fontname="helv",
                color=(0, 0, 0),
                render_mode=0
            )
    
    # Save
    output_path = pdf_path.parent / f"{pdf_path.stem}{output_suffix}.pdf"
    print(f"\n[INFO] Saving to: {output_path}")
    
    # Save PDF
    doc.save(str(output_path))
    doc.close()
    
    print(f"[SUCCESS] VAT removal complete!")
    print(f"[SUCCESS] Output: {output_path}")
    
    return output_path


def print_usage():
    """Print usage information."""
    print("\nAutomated VAT Removal System")
    print("=" * 60)
    print("\nDetects VAT percentage, finds product prices, removes VAT,")
    print("and highlights changes with yellow rectangles.")
    print("\nUsage:")
    print("  python -m src.main <pdf_file> [output_suffix]")
    print("\nArguments:")
    print("  pdf_file      Path to PDF invoice")
    print("  output_suffix Suffix for output (default: '_clean')")
    print("\nExample:")
    print("  python -m src.main project/examples/example_1.PDF")
    print("  python -m src.main invoice.pdf _corrected")
    print("\nWhat it does:")
    print("  1. Detect VAT percentage automatically")
    print("  2. Find all product prices in PDF")
    print("  3. Calculate prices without VAT")
    print("  4. Apply yellow rectangles over prices")
    print("  5. Overlay new prices without VAT")


def main():
    """Main entry point."""
    if len(sys.argv) < 2:
        print_usage()
        sys.exit(1)
    
    pdf_path = Path(sys.argv[1])
    output_suffix = sys.argv[2] if len(sys.argv) > 2 else "_clean"
    
    if not pdf_path.exists():
        print(f"[ERROR] PDF file not found: {pdf_path}")
        sys.exit(1)
    
    try:
        output_path = process_invoice(pdf_path, output_suffix)
        
        if output_path:
            print(f"\n[SUCCESS] File created: {output_path}")
            return 0
        else:
            return 1
            
    except Exception as e:
        print(f"\n[ERROR] {e}")
        import traceback
        traceback.print_exc()
        return 1


if __name__ == '__main__':
    sys.exit(main())
