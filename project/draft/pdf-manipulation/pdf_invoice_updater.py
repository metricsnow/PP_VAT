#!/usr/bin/env python3
"""
PDF Invoice Updater - Overlay Text Updates on PDF Invoices

This script reads a PDF invoice and updates values by overlaying new text
at specified positions based on search criteria. The updated PDF is saved
with a "_updated" prefix.

Author: Marcus
Date: 2025
"""

import re
import sys
from pathlib import Path
from typing import Dict, List, Tuple, Optional
import pymupdf  # PyMuPDF (fitz)


class PDFInvoiceUpdater:
    """Updates PDF invoices by overlaying text at specified positions."""

    def __init__(self, pdf_path: str, updates: List[Dict[str, str]], config: Optional[Dict] = None, output_suffix: str = "_updated"):
        """
        Initialize the PDF invoice updater.

        Args:
            pdf_path: Path to the input PDF file
            updates: List of dictionaries with update criteria
                Format: {
                    'search': str,      # Text to find
                    'replace': str,     # New text to overlay
                    'offset': (x, y),   # Optional: pixel offset (x, y)
                    'font_size': int    # Optional: font size (default 11)
                }
            config: Optional configuration dictionary
            output_suffix: Suffix to add to output filename (default: "_updated")
        """
        self.pdf_path = Path(pdf_path)
        self.updates = updates
        self.config = config or {}
        self.doc = None
        self.output_suffix = output_suffix

    def load_pdf(self) -> bool:
        """
        Load the PDF document.

        Returns:
            bool: True if loaded successfully, False otherwise

        Raises:
            FileNotFoundError: If PDF file doesn't exist
            Exception: If PDF cannot be opened
        """
        if not self.pdf_path.exists():
            raise FileNotFoundError(f"PDF file not found: {self.pdf_path}")

        try:
            self.doc = pymupdf.open(str(self.pdf_path))
            return True
        except Exception as e:
            raise Exception(f"Failed to open PDF: {e}")

    def find_text_positions(self, search_text: str, page_num: int = None) -> List[Tuple[int, Tuple[float, float], pymupdf.Rect]]:
        """
        Find all positions where search text appears.

        Args:
            search_text: Text to search for
            page_num: Optional page number (None = search all pages)

        Returns:
            List of tuples: (page_number, (x, y), rect) coordinates with bounding box
        """
        positions = []
        start_page = page_num if page_num is not None else 0
        end_page = page_num + 1 if page_num is not None else len(self.doc)

        for page_idx in range(start_page, end_page):
            page = self.doc[page_idx]
            text_instances = page.search_for(search_text)

            for rect in text_instances:
                # Text position: x is left edge, y is baseline (bottom of text box)
                x = rect.x0
                y = rect.y1  # Baseline (bottom of text box) for proper text alignment
                positions.append((page_idx, (x, y), rect))

        return positions

    def overlay_text(self, page_num: int, position: Tuple[float, float], 
                    new_text: str, font_size: float = 8.0, cover_rect: pymupdf.Rect = None,
                    font_family: str = "helv") -> None:
        """
        Overlay text at specified position on PDF page with optional white cover.

        Args:
            page_num: Page number to update
            position: (x, y) coordinates where to place text
            new_text: Text to overlay
            font_size: Size of the font (default 8pt to match invoice)
            cover_rect: Optional rectangle to cover with white before placing text
            font_family: Font family (helv, cour, times)
        """
        page = self.doc[page_num]
        x, y = position

        # Handle offset if specified
        if isinstance(position, dict) and 'offset' in position:
            x += position['offset'][0]
            y += position['offset'][1]

        # Cover old text with light yellow rectangle if provided
        if cover_rect:
            # Use exact rectangle size with minimal padding
            padding = 2
            expanded_rect = pymupdf.Rect(
                cover_rect.x0 - padding,
                cover_rect.y0 - padding,
                cover_rect.x1 + padding,
                cover_rect.y1 + padding
            )
            # Draw light yellow filled rectangle to highlight changed values
            page.draw_rect(expanded_rect, color=(1, 1, 0.85), fill=(1, 1, 0.85))

        # Insert text with exact font size to match original
        # y-coordinate is baseline position
        point = pymupdf.Point(x, y)
        
        # Insert the text (try with both Euro symbol formats)
        try:
            # Try inserting with Unicode Euro
            page.insert_text(
                point,
                new_text,
                fontsize=font_size,
                fontname=font_family,
                color=(0, 0, 0),  # Black text
                render_mode=0,  # Fill text (not outline)
            )
        except:
            # Fallback: if Euro symbol fails, use "EUR" instead
            text_fallback = new_text.replace('€', 'EUR')
            page.insert_text(
                point,
                text_fallback,
                fontsize=font_size,
                fontname=font_family,
                color=(0, 0, 0),
                render_mode=0,
            )

    def apply_updates(self) -> None:
        """Apply all configured updates to the PDF."""
        for update in self.updates:
            search_text = update.get('search', '')
            replace_text = update.get('replace', '')
            font_size = update.get('font_size', 8.0)  # Match invoice default 8pt
            offset = update.get('offset', (0, 0))
            
            if not search_text or not replace_text:
                print(f"Warning: Skipping invalid update: {update}")
                continue

            # Find all positions
            positions = self.find_text_positions(search_text)
            
            if not positions:
                print(f"Warning: Text '{search_text}' not found in PDF")
                continue

            # Apply update at each found position
            for page_num, pos, rect in positions:
                adjusted_pos = (pos[0] + offset[0], pos[1] + offset[1])
                self.overlay_text(page_num, adjusted_pos, replace_text, font_size, cover_rect=rect)
                print(f"Updated: '{search_text}' -> '{replace_text}' on page {page_num + 1}")

    def save_updated_pdf(self) -> Path:
        """
        Save the updated PDF with custom suffix.

        Returns:
            Path: Path to the saved file

        Raises:
            Exception: If save fails
        """
        if self.doc is None:
            raise Exception("PDF not loaded. Call load_pdf() first.")

        # Create output filename with suffix before extension
        output_path = self.pdf_path.parent / f"{self.pdf_path.stem}{self.output_suffix}{self.pdf_path.suffix}"
        
        try:
            self.doc.save(str(output_path))
            self.doc.close()
            return output_path
        except Exception as e:
            raise Exception(f"Failed to save updated PDF: {e}")

    def process(self) -> Path:
        """
        Complete workflow: load, update, and save PDF.

        Returns:
            Path: Path to the updated PDF file
        """
        print(f"Loading PDF: {self.pdf_path}")
        self.load_pdf()
        
        print(f"Applying {len(self.updates)} update(s)...")
        self.apply_updates()
        
        print("Saving updated PDF...")
        output_path = self.save_updated_pdf()
        
        print(f"✅ Successfully created: {output_path}")
        return output_path


def main():
    """Example usage of PDFInvoiceUpdater."""
    
    if len(sys.argv) < 2:
        print("Usage: python pdf_invoice_updater.py <pdf_path> [config_file]")
        print("\nExample updates configuration:")
        print("""[
    {
        "search": "Total: $100.00",
        "replace": "Total: $120.00",
        "font_size": 12
    },
    {
        "search": "Invoice #12345",
        "replace": "Invoice #12346",
        "offset": (0, -2)
    }
]""")
        sys.exit(1)

    pdf_path = sys.argv[1]
    
    # Example updates - customize these for your invoice
    updates = [
        {
            'search': 'Total:',
            'replace': 'Total: $1,234.56',
            'font_size': 12
        },
        # Add more updates as needed
    ]

    # If config file provided, load from file
    if len(sys.argv) > 2:
        import json
        with open(sys.argv[2], 'r') as f:
            updates = json.load(f)

    # Process the PDF (allow custom suffix via config or default to _updated)
    output_suffix = sys.argv[3] if len(sys.argv) > 3 else "_updated"
    updater = PDFInvoiceUpdater(pdf_path, updates, output_suffix=output_suffix)
    output_path = updater.process()
    
    print(f"\n✅ Updated invoice saved to: {output_path}")


if __name__ == '__main__':
    main()

