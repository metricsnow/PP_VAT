"""
Test VAT detection on example PDF
"""

import sys
from pathlib import Path
import pymupdf

# Add parent directory to path
sys.path.insert(0, str(Path(__file__).parent.parent))

from core.utils import PDFUtils

def main():
    pdf_path = Path(__file__).parent.parent / "examples" / "example_1.PDF"
    
    if not pdf_path.exists():
        print(f"Error: PDF file not found: {pdf_path}")
        return 1
    
    print(f"\n{'='*80}")
    print(f"VAT Detection Test")
    print(f"{'='*80}\n")
    
    doc = pymupdf.open(str(pdf_path))
    
    # Extract all text
    full_text = ""
    for page_num, page in enumerate(doc):
        page_text = page.get_text()
        full_text += page_text
        print(f"[INFO] Page {page_num + 1} extracted: {len(page_text)} characters")
    
    doc.close()
    
    # Detect VAT
    print(f"\n[INFO] Total text length: {len(full_text)} characters")
    print(f"[INFO] Searching for VAT percentage...")
    
    detected_vat = PDFUtils.detect_vat_percentage(full_text)
    
    print(f"\n{'='*80}")
    if detected_vat is not None:
        print(f"[SUCCESS] Identified VAT Percentage: {detected_vat}%")
    else:
        print(f"[WARNING] Could not identify VAT percentage")
    print(f"{'='*80}\n")
    
    return 0 if detected_vat else 1

if __name__ == '__main__':
    sys.exit(main())

