"""
Automated VAT removal system - main implementation
Finds all prices, removes VAT, and highlights with yellow rectangles
"""

import sys
from pathlib import Path
import re
import pymupdf

# Add parent directory to path for imports
sys.path.insert(0, str(Path(__file__).parent.parent))

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
        # Pattern matches: numbers with thousands separator (.) and decimal comma
        price_pattern = r'\d{1,3}(?:\.\d{3})*,\d{2}'
        
        text_blocks = page.get_text("blocks")
        
        # Filter to only text blocks (type 0)
        text_only_blocks = [b for b in text_blocks if b[6] == 0]  # b[6] is block type
        
        for block in text_only_blocks:
            block_text = block[4]  # b[4] is the text content
            matches = re.finditer(price_pattern, block_text)
            
            for match in matches:
                price_str = match.group(0)
                
                # Skip if appears to be a date or other non-price
                if re.match(r'\d{2}[\.]\d{2}[\.]\d{4}', price_str):  # Dates like 27.10.2025
                    continue
                if re.match(r'\d{2}[\.]\d{2}', price_str) and float(price_str.replace(',', '.')) < 50:  # Likely dates
                    continue
                
                try:
                    # Parse European format: "1.540,00" -> 1540.00
                    # Replace thousands separators, then comma to period for decimals
                    price_without_thousands = price_str.replace('.', '')
                    price_float = float(price_without_thousands.replace(',', '.'))
                    
                    # Only process reasonable price ranges
                    if 10 <= price_float <= 100000:
                        # Find position in the block
                        rect = pymupdf.Rect(block[0], block[1], block[2], block[3])
                        
                        # Find the specific text position within the block
                        search_results = page.search_for(price_str)
                        
                        for text_rect in search_results:
                            new_value = price_float / (1 + detected_vat / 100)
                            new_value = round(new_value, 2)
                            
                            # Check if we already added this (avoid duplicates)
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
                                    (text_rect.x0, text_rect.y1),  # Position for text insertion
                                    text_rect,  # Rectangle for highlighting
                                    price_float,
                                    new_value,
                                    price_str  # Original string for display
                                ))
                                
                                print(f"  Found price: {price_str} ({price_float}) -> {new_value:.2f} (VAT {detected_vat}% removed)")
                                
                except (ValueError, AttributeError) as e:
                    continue
    
    return all_prices


def apply_auto_vat_removal(pdf_path: Path):
    """
    Apply automated VAT removal: detect VAT, find prices, calculate without VAT, highlight.
    """
    import sys
    from pathlib import Path
    
    # Add parent directory to path
    parent_dir = Path(__file__).parent.parent
    if str(parent_dir) not in sys.path:
        sys.path.insert(0, str(parent_dir))
    
    from core.orchestrator import PDFInvoiceOrchestrator
    from core.utils import PDFUtils
    
    print(f"\n{'='*80}")
    print(f"Automated VAT Removal System")
    print(f"{'='*80}\n")
    
    # Load PDF
    print(f"[INFO] Loading PDF: {pdf_path}")
    doc = pymupdf.open(str(pdf_path))
    
    # Extract all text
    full_text = ""
    for page_num, page in enumerate(doc):
        full_text += page.get_text()
    
    # Detect VAT
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
    
    # Apply highlights and new prices using proven techniques from draft
    for idx, (page_num, pos, rect, old_value, new_value, orig_str) in enumerate(all_prices):
        page = doc[page_num]
        
        # Use the proven yellow rectangle technique from draft
        print(f"[{idx+1}/{len(all_prices)}] Processing: {orig_str} ({old_value}) -> {new_value:.2f}")
        print(f"    Position: ({pos[0]:.2f}, {pos[1]:.2f})")
        print(f"    Rectangle: ({rect.x0:.2f}, {rect.y0:.2f}) -> ({rect.x1:.2f}, {rect.y1:.2f})")
        
        # Draw yellow highlight rectangle with padding (from working example)
        padding = 2
        expanded_rect = pymupdf.Rect(
            rect.x0 - padding,
            rect.y0 - padding,
            rect.x1 + padding,
            rect.y1 + padding
        )
        page.draw_rect(expanded_rect, color=(1, 1, 0.85), fill=(1, 1, 0.85))
        print(f"    [DONE] Yellow highlight applied")
        
        # Insert new price at exact position (baseline positioning from draft)
        new_price_str = f"{new_value:.2f}"
        # Format with comma for European style
        new_price_str = new_price_str.replace('.', ',')
        
        point = pymupdf.Point(pos[0], pos[1])
        
        try:
            page.insert_text(
                point,
                new_price_str,
                fontsize=8.0,
                fontname="helv",
                color=(0, 0, 0),
                render_mode=0
            )
            print(f"    [DONE] New price '{new_price_str}' inserted")
        except Exception as e:
            # Fallback for special characters
            page.insert_text(
                point,
                new_price_str.replace('€', 'EUR'),
                fontsize=8.0,
                fontname="helv",
                color=(0, 0, 0),
                render_mode=0
            )
            print(f"    [DONE] New price inserted (with fallback)")
    
    # Save
    output_path = pdf_path.parent / f"{pdf_path.stem}_clean.pdf"
    print(f"\n[INFO] Saving to: {output_path}")
    
    PDFUtils.save_pdf(doc, output_path)
    
    print(f"[SUCCESS] VAT removal complete!")
    print(f"[SUCCESS] Output: {output_path}")
    
    return output_path


def main():
    pdf_path = Path(__file__).parent.parent.parent / "examples" / "example_1.PDF"
    
    if not pdf_path.exists():
        print(f"Error: PDF file not found: {pdf_path}")
        return 1
    
    try:
        output_path = apply_auto_vat_removal(pdf_path)
        
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

