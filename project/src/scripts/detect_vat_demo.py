"""
Demo script to detect VAT percentage in PDF and display it
"""

import sys
from pathlib import Path
import re
import pymupdf

def extract_and_find_vat(pdf_path: Path):
    """
    Extract text from PDF and find VAT percentage.
    
    Returns:
        tuple: (detected_vat_percentage, all_vat_texts)
    """
    print(f"\n{'='*80}")
    print(f"VAT Detection for: {pdf_path.name}")
    print(f"{'='*80}\n")
    
    doc = pymupdf.open(str(pdf_path))
    
    # Storage for all VAT-related text
    all_vat_texts = []
    detected_vat = None
    
    # Patterns to search for VAT percentages
    vat_patterns = [
        r'(\d+(?:[,\.]\d+)?)\s*%',  # "19 %", "19%", "19.5 %"
        r'VAT[:\s]*(\d+(?:[,\.]\d+)?)',  # "VAT: 19"
        r'MwSt[:\s]*(\d+(?:[,\.]\d+)?)',  # "MwSt: 19"
        r'Ust[:\s]*(\d+(?:[,\.]\d+)?)',  # "USt: 19" (German)
        r'GST[:\s]*(\d+(?:[,\.]\d+)?)',  # "GST: 9"
        r'GST\((\d+(?:[,\.]\d+)?)\)',  # "GST(9%)"
    ]
    
    print(f"[INFO] PDF has {len(doc)} page(s)")
    
    for page_num, page in enumerate(doc):
        print(f"\n--- Page {page_num + 1} ---")
        text = page.get_text()
        
        # Show first 500 chars
        preview = text.replace('\n', ' ')[:500]
        print(f"Text preview: {preview}...")
        
        # Search for VAT patterns
        print(f"\n[INFO] Searching for VAT patterns...")
        
        for pattern in vat_patterns:
            matches = re.findall(pattern, text, re.IGNORECASE)
            if matches:
                print(f"  Pattern '{pattern}': Found {len(matches)} match(es)")
                for match in matches:
                    all_vat_texts.append(match)
                    print(f"    -> Found: {match}")
        
        # Also try PyMuPDF search
        search_terms = ["VAT", "MwSt", "Mehrwertsteuer", "USt", "UST", "GST", "TVA", "IVA"]
        for term in search_terms:
            instances = page.search_for(term)
            if instances:
                print(f"  Search term '{term}': Found {len(instances)} instance(s)")
                for rect in instances:
                    # Get surrounding text
                    nearby_text = page.get_textbox(pymupdf.Rect(
                        rect.x0 - 100, rect.y0 - 5,
                        rect.x1 + 100, rect.y1 + 5
                    ))
                    if nearby_text.strip():
                        print(f"    -> Context: '{nearby_text.strip()[:80]}...'")
    
    doc.close()
    
    # Analyze found VAT percentages
    print(f"\n{'='*80}")
    print(f"VAT Detection Summary")
    print(f"{'='*80}")
    
    if all_vat_texts:
        print(f"\n[INFO] Found {len(all_vat_texts)} potential VAT value(s):")
        for idx, vat_text in enumerate(set(all_vat_texts), 1):
            print(f"  {idx}. '{vat_text}'")
            try:
                vat_float = float(vat_text.replace(',', '.'))
                print(f"      -> Parsed as: {vat_float}%")
                if 0 <= vat_float <= 100:  # Reasonable VAT range
                    detected_vat = vat_float
                    print(f"      -> [SELECTED] Most likely VAT: {detected_vat}%")
            except ValueError:
                print(f"      -> Could not parse as number")
    else:
        print("\n[WARNING] No VAT percentage found in document")
    
    return detected_vat, all_vat_texts

def main():
    pdf_path = Path(__file__).parent.parent / "examples" / "example_1.PDF"
    
    if not pdf_path.exists():
        print(f"Error: PDF file not found: {pdf_path}")
        return 1
    
    detected_vat, all_vat_texts = extract_and_find_vat(pdf_path)
    
    if detected_vat is not None:
        print(f"\n{'='*80}")
        print(f"[SUCCESS] Identified VAT Percentage: {detected_vat}%")
        print(f"{'='*80}")
        return 0
    else:
        print(f"\n{'='*80}")
        print(f"[WARNING] Could not identify VAT percentage")
        print(f"{'='*80}")
        return 1

if __name__ == '__main__':
    sys.exit(main())

