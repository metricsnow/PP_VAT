"""
Extract text from PDF to understand the format
"""

import sys
from pathlib import Path
import pymupdf

def main():
    pdf_path = Path(__file__).parent.parent / "examples" / "example_1.PDF"
    
    if not pdf_path.exists():
        print(f"Error: PDF file not found: {pdf_path}")
        return 1
    
    doc = pymupdf.open(str(pdf_path))
    
    print(f"Total pages: {len(doc)}")
    print("\n" + "="*80)
    
    for page_num in range(len(doc)):
        page = doc[page_num]
        text = page.get_text()
        
        print(f"\n--- Page {page_num + 1} ---\n")
        print(text[:2000])  # First 2000 characters
        print("...")
        
        # Also search for VAT patterns
        vat_patterns = [
            "19 %", "19%", "19",
            "25 %", "25%", "25",
            "MwSt", "MwSt.", "VAT",
            "Betrag", "betrag",
            "68", "72"
        ]
        
        print(f"\n--- VAT Pattern Search ---")
        for pattern in vat_patterns:
            instances = page.search_for(pattern)
            if instances:
                print(f"'{pattern}': Found {len(instances)} instance(s)")
    
    doc.close()
    return 0

if __name__ == '__main__':
    sys.exit(main())

