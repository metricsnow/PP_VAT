"""
PDF Invoice Orchestrator

High-level orchestrator for PDF invoice manipulation workflow.
"""

import json
import shutil
from pathlib import Path
from typing import List, Dict, Optional
import pymupdf

try:
    from .utils import PDFUtils  # Relative import (when run as module)
except ImportError:
    try:
        from core.utils import PDFUtils  # From core package
    except ImportError:
        from utils import PDFUtils  # Absolute import (when run directly)


class PDFInvoiceOrchestrator:
    """
    Orchestrator for PDF invoice updating operations.
    
    Manages the complete workflow of:
    1. Loading PDF documents
    2. Finding and replacing text
    3. Highlighting changes
    4. Saving updated documents
    """
    
    def __init__(
        self,
        pdf_path: Path,
        updates: List[Dict],
        output_suffix: str = "_clean",
        backup: bool = False
    ):
        """
        Initialize the PDF invoice orchestrator.
        
        Args:
            pdf_path: Path to the input PDF file
            updates: List of update dictionaries with format:
                {
                    'search': str,      # Text to find
                    'replace': str,     # New text to overlay
                    'font_size': float, # Optional font size
                    'offset': [x, y]    # Optional pixel offset
                }
            output_suffix: Suffix for output filename (default: "_clean")
            backup: Whether to create backup before processing (default: False)
        """
        self.pdf_path = Path(pdf_path)
        self.updates = updates
        self.output_suffix = output_suffix
        self.backup = backup
        self.doc: Optional[pymupdf.Document] = None
        
    def load(self) -> bool:
        """
        Load the PDF document.
        
        Returns:
            True if loaded successfully
            
        Raises:
            FileNotFoundError: If PDF file doesn't exist
            Exception: If PDF cannot be opened
        """
        print(f"[INFO] Loading PDF from: {self.pdf_path}")
        print(f"[INFO] File exists: {self.pdf_path.exists()}")
        print(f"[INFO] File size: {self.pdf_path.stat().st_size:,} bytes")
        
        if self.backup:
            self._create_backup()
        
        print(f"[INFO] Opening PDF document...")
        self.doc = PDFUtils.open_pdf(self.pdf_path)
        print(f"[INFO] PDF opened successfully")
        print(f"[INFO] Total pages: {len(self.doc)}")
        
        return True
    
    def apply_update(self, update: Dict) -> int:
        """
        Apply a single update to the PDF.
        
        Args:
            update: Update dictionary with 'search' and 'replace' keys
            
        Returns:
            Number of positions updated
        """
        if self.doc is None:
            raise Exception("PDF not loaded. Call load() first.")
        
        search_text = update.get('search', '')
        replace_text = update.get('replace', '')
        font_size = update.get('font_size', PDFUtils.DEFAULT_FONT_SIZE)
        offset = update.get('offset', (0, 0))
        
        print(f"\n--- Processing Update ---")
        print(f"Search text: '{search_text}'")
        print(f"Replace with: '{replace_text}'")
        print(f"Font size: {font_size}")
        print(f"Offset: {offset}")
        
        if not search_text or not replace_text:
            print(f"[WARNING] Skipping invalid update: {update}")
            return 0
        
        # Find all positions where text appears
        print(f"[INFO] Searching for '{search_text}' in PDF...")
        positions = PDFUtils.find_text_positions(self.doc, search_text)
        print(f"[INFO] Found {len(positions)} occurrence(s)")
        
        if not positions:
            print(f"[WARNING] Text '{search_text}' not found in PDF")
            return 0
        
        # Apply update at each found position
        update_count = 0
        for idx, (page_num, pos, rect) in enumerate(positions):
            print(f"  [{idx+1}/{len(positions)}] Processing occurrence on page {page_num + 1}")
            print(f"      Position: ({pos[0]:.2f}, {pos[1]:.2f})")
            print(f"      Rectangle: ({rect.x0:.2f}, {rect.y0:.2f}) -> ({rect.x1:.2f}, {rect.y1:.2f})")
            
            # Apply highlight
            PDFUtils.highlight_rect(self.doc[page_num], rect)
            print(f"      [DONE] Applied yellow highlight")
            
            # Apply text overlay with offset
            adjusted_pos = (pos[0] + offset[0], pos[1] + offset[1])
            print(f"      Inserting text '{replace_text}' at adjusted position: ({adjusted_pos[0]:.2f}, {adjusted_pos[1]:.2f})")
            PDFUtils.insert_text(
                self.doc[page_num],
                adjusted_pos,
                replace_text,
                font_size=font_size
            )
            print(f"      [DONE] Text overlay complete")
            update_count += 1
        
        print(f"[SUCCESS] Update complete: {update_count} position(s) modified")
        return update_count
    
    def apply_all_updates(self) -> int:
        """
        Apply all configured updates to the PDF.
        
        Returns:
            Total number of updates applied
        """
        if self.doc is None:
            raise Exception("PDF not loaded. Call load() first.")
        
        total_updates = 0
        for update in self.updates:
            update_count = self.apply_update(update)
            total_updates += update_count
        
        return total_updates
    
    def save(self, output_path: Optional[Path] = None) -> Path:
        """
        Save the updated PDF.
        
        Args:
            output_path: Optional custom output path. If None, uses input path with suffix.
            
        Returns:
            Path to the saved file
        """
        if self.doc is None:
            raise Exception("PDF not loaded. Call load() first.")
        
        if output_path is None:
            output_path = self.pdf_path.parent / f"{self.pdf_path.stem}{self.output_suffix}{self.pdf_path.suffix}"
        
        print(f"[INFO] Determining output path...")
        print(f"[INFO] Output will be saved to: {output_path}")
        
        saved_path = PDFUtils.save_pdf(self.doc, output_path)
        
        print(f"[INFO] File saved successfully")
        print(f"[INFO] Output size: {output_path.stat().st_size:,} bytes")
        
        return saved_path
    
    def detect_and_print_vat(self) -> Optional[float]:
        """Detect and print VAT percentage from PDF."""
        if self.doc is None:
            raise Exception("PDF not loaded. Call load() first.")
        
        print(f"\n{'='*80}")
        print(f"[INFO] Detecting VAT percentage in document...")
        
        # Extract text from all pages
        full_text = ""
        for page_num, page in enumerate(self.doc):
            page_text = page.get_text()
            full_text += page_text
        
        # Detect VAT
        detected_vat = PDFUtils.detect_vat_percentage(full_text)
        
        if detected_vat is not None:
            print(f"[SUCCESS] Identified VAT Percentage: {detected_vat}%")
        else:
            print(f"[WARNING] Could not identify VAT percentage")
        
        print(f"{'='*80}")
        
        return detected_vat
    
    def process(self, output_path: Optional[Path] = None) -> Path:
        """
        Complete workflow: load, update, and save PDF.
        
        Args:
            output_path: Optional custom output path
            
        Returns:
            Path to the updated PDF file
        """
        print(f"Loading PDF: {self.pdf_path}")
        self.load()
        
        # Detect and print VAT
        self.detect_and_print_vat()
        
        print(f"\nApplying {len(self.updates)} update(s)...")
        total = self.apply_all_updates()
        print(f"Applied {total} total update(s)")
        
        print("\nSaving updated PDF...")
        output_path = self.save(output_path)
        
        print(f"[SUCCESS] Created: {output_path}")
        return output_path
    
    def _create_backup(self) -> None:
        """Create a backup of the original PDF."""
        if self.backup:
            backup_path = self.pdf_path.with_suffix('.backup.pdf')
            if not backup_path.exists():
                shutil.copy2(self.pdf_path, backup_path)
                print(f"[INFO] Created backup: {backup_path}")


def load_updates_from_config(config_path: Path) -> List[Dict]:
    """
    Load updates from a JSON configuration file.
    
    Args:
        config_path: Path to JSON configuration file
        
    Returns:
        List of update dictionaries
        
    Raises:
        FileNotFoundError: If config file doesn't exist
        json.JSONDecodeError: If JSON is invalid
    """
    if not config_path.exists():
        raise FileNotFoundError(f"Config file not found: {config_path}")
    
    with open(config_path, 'r') as f:
        updates = json.load(f)
    
    return updates


def process_invoice(
    pdf_path: Path,
    config_path: Path,
    output_suffix: str = "_updated"
) -> Path:
    """
    Process a single invoice with updates from a config file.
    
    Args:
        pdf_path: Path to PDF invoice
        config_path: Path to JSON configuration file
        output_suffix: Suffix for output filename
        
    Returns:
        Path to the updated PDF
        
    Example:
        >>> pdf = Path("invoice.pdf")
        >>> config = Path("config.json")
        >>> result = process_invoice(pdf, config)
    """
    updates = load_updates_from_config(config_path)
    orchestrator = PDFInvoiceOrchestrator(pdf_path, updates, output_suffix)
    return orchestrator.process()

