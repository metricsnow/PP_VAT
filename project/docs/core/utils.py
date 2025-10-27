"""
PDF Utilities Module

Provides low-level PDF manipulation utilities using PyMuPDF.
"""

import pymupdf
from pathlib import Path
from typing import List, Tuple, Optional, Dict
import re


class PDFUtils:
    """Utility functions for PDF manipulation using PyMuPDF."""
    
    # Default configuration
    DEFAULT_HIGHLIGHT_COLOR = (1, 1, 0.85)  # Light yellow
    DEFAULT_FONT_SIZE = 8.0
    DEFAULT_FONT_FAMILY = "helv"
    DEFAULT_PADDING = 2
    
    @staticmethod
    def open_pdf(pdf_path: Path) -> pymupdf.Document:
        """
        Open a PDF document.
        
        Args:
            pdf_path: Path to the PDF file
            
        Returns:
            Opened PDF document
            
        Raises:
            FileNotFoundError: If PDF file doesn't exist
            Exception: If PDF cannot be opened
        """
        if not pdf_path.exists():
            raise FileNotFoundError(f"PDF file not found: {pdf_path}")
        
        try:
            return pymupdf.open(str(pdf_path))
        except Exception as e:
            raise Exception(f"Failed to open PDF: {e}")
    
    @staticmethod
    def find_text_positions(
        doc: pymupdf.Document,
        search_text: str,
        page_num: Optional[int] = None
    ) -> List[Tuple[int, Tuple[float, float], pymupdf.Rect]]:
        """
        Find all positions where search text appears in PDF.
        
        Args:
            doc: PDF document
            search_text: Text to search for
            page_num: Optional page number (None = search all pages)
            
        Returns:
            List of tuples: (page_number, (x, y), rect) coordinates with bounding box
        """
        positions = []
        start_page = page_num if page_num is not None else 0
        end_page = page_num + 1 if page_num is not None else len(doc)
        
        for page_idx in range(start_page, end_page):
            page = doc[page_idx]
            text_instances = page.search_for(search_text)
            
            for rect in text_instances:
                # Text position: x is left edge, y is baseline (bottom of text box)
                x = rect.x0
                y = rect.y1  # Baseline for proper text alignment
                positions.append((page_idx, (x, y), rect))
        
        return positions
    
    @staticmethod
    def highlight_rect(
        page: pymupdf.Page,
        rect: pymupdf.Rect,
        color: Tuple[float, float, float] = DEFAULT_HIGHLIGHT_COLOR,
        padding: int = DEFAULT_PADDING
    ) -> None:
        """
        Draw a highlight rectangle on a PDF page.
        
        Args:
            page: PDF page to draw on
            rect: Rectangle coordinates
            color: RGB color tuple (default: light yellow)
            padding: Padding around the rectangle
        """
        expanded_rect = pymupdf.Rect(
            rect.x0 - padding,
            rect.y0 - padding,
            rect.x1 + padding,
            rect.y1 + padding
        )
        page.draw_rect(expanded_rect, color=color, fill=color)
    
    @staticmethod
    def insert_text(
        page: pymupdf.Page,
        position: Tuple[float, float],
        text: str,
        font_size: float = DEFAULT_FONT_SIZE,
        font_family: str = DEFAULT_FONT_FAMILY,
        color: Tuple[int, int, int] = (0, 0, 0)
    ) -> None:
        """
        Insert text at a specific position on a PDF page.
        
        Args:
            page: PDF page to insert text on
            position: (x, y) coordinates where to place text
            text: Text to insert
            font_size: Size of the font
            font_family: Font family name
            color: Text color as RGB tuple
            
        Note:
            Handles Unicode Euro symbol (€) with fallback to "EUR"
        """
        x, y = position
        point = pymupdf.Point(x, y)
        
        try:
            # Try inserting with Unicode Euro
            page.insert_text(
                point,
                text,
                fontsize=font_size,
                fontname=font_family,
                color=color,
                render_mode=0,  # Fill text (not outline)
            )
        except Exception:
            # Fallback: if Euro symbol fails, use "EUR" instead
            text_fallback = text.replace('€', 'EUR')
            page.insert_text(
                point,
                text_fallback,
                fontsize=font_size,
                fontname=font_family,
                color=color,
                render_mode=0,
            )
    
    @staticmethod
    def save_pdf(
        doc: pymupdf.Document,
        output_path: Path
    ) -> Path:
        """
        Save PDF document to file.
        
        Args:
            doc: PDF document to save
            output_path: Path where to save the PDF
            
        Returns:
            Path to the saved file
            
        Raises:
            Exception: If save fails
        """
        if doc is None:
            raise Exception("PDF document is None")
        
        try:
            # Save PDF
            doc.save(str(output_path), garbage=4)
            return output_path
        except Exception as e:
            # Fallback: try to close first and save again
            try:
                doc.close()
                doc = None
                # Re-open to save
                temp_doc = pymupdf.open(str(output_path))
                temp_doc.save(str(output_path), garbage=4)
                temp_doc.close()
                return output_path
            except Exception as e2:
                raise Exception(f"Failed to save PDF: {e}")
        finally:
            doc.close()
    
    @staticmethod
    def detect_vat_percentage(text: str) -> Optional[float]:
        """
        Detect VAT percentage from text.
        
        Args:
            text: Text to search for VAT percentage
            
        Returns:
            VAT percentage as float, or None if not found
            
        Example:
            >>> detect_vat_percentage("19 %")
            19.0
            >>> detect_vat_percentage("MwSt: 19%")
            19.0
        """
        # Match patterns like "19 %", "19%", "MwSt 19%", etc.
        patterns = [
            r'(\d+(?:[,\.]\d+)?)\s*%\s*VAT',  # "8.10 % VAT" or "8,10 % VAT"
            r'VAT[:\s]*(\d+(?:[,\.]\d+)?)',  # "VAT: 19" or "VAT 19"
            r'MwSt[:\s]*(\d+(?:[,\.]\d+)?)',  # "MwSt: 19"
            r'Mehrwertsteuer[:\s]*(\d+(?:[,\.]\d+)?)',  # "Mehrwertsteuer: 19"
            r'USt[:\s]*(\d+(?:[,\.]\d+)?)',  # "USt: 19"
            r'GST[:\s]*\((\d+(?:[,\.]\d+)?)',  # "GST(9%)"
            r'TVA[:\s]*(\d+(?:[,\.]\d+)?)',  # "TVA: 19" (French)
            r'IVA[:\s]*(\d+(?:[,\.]\d+)?)',  # "IVA: 19" (Italian/Spanish)
        ]
        
        # Store all found percentages with context
        found_vat = []
        
        for pattern in patterns:
            matches = re.finditer(pattern, text, re.IGNORECASE)
            for match in matches:
                try:
                    vat_str = match.group(1).replace(',', '.')
                    vat_percent = float(vat_str)
                    # Reasonable VAT range: 0-30%
                    if 0 <= vat_percent <= 30:
                        found_vat.append({
                            'value': vat_percent,
                            'pattern': pattern,
                            'context': text[max(0, match.start()-20):match.end()+20]
                        })
                except (ValueError, IndexError):
                    continue
        
        if found_vat:
            # Prioritize patterns with "VAT" keyword
            vat_matches = [v for v in found_vat if 'VAT' in v['pattern']]
            if vat_matches:
                return vat_matches[0]['value']
            # Otherwise return first valid match
            return found_vat[0]['value']
        
        return None
    
    @staticmethod
    def calculate_tax_amount(subtotal: float, vat_percentage: float) -> float:
        """
        Calculate tax amount from subtotal and VAT percentage.
        
        Args:
            subtotal: Subtotal amount
            vat_percentage: VAT percentage
            
        Returns:
            Tax amount
        """
        return subtotal * vat_percentage / 100
    
    @staticmethod
    def calculate_total(subtotal: float, tax_amount: float) -> float:
        """
        Calculate total amount from subtotal and tax.
        
        Args:
            subtotal: Subtotal amount
            tax_amount: Tax amount
            
        Returns:
            Total amount
        """
        return subtotal + tax_amount

