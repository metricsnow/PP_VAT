"""
Main Window for PP_VAT Application
Split-screen PDF preview with VAT correction
"""

import sys
from pathlib import Path
from PySide6.QtWidgets import (
    QMainWindow, QWidget, QVBoxLayout, QHBoxLayout, QSplitter,
    QPushButton, QFileDialog, QMessageBox, QLabel, QFrame
)
from PySide6.QtCore import Qt, Signal
from PySide6.QtGui import QIcon, QPixmap
import pymupdf

from .pdf_preview_widget import PDFPreviewWidget

# Add parent directory to path for imports
project_root = Path(__file__).parent.parent.parent
sys.path.insert(0, str(project_root))
sys.path.insert(0, str(Path(__file__).parent.parent))

# Import from correct location
try:
    # Try absolute import
    from docs.core.utils import PDFUtils
except ImportError:
    # Fallback for alternative structure
    sys.path.insert(0, str(Path(__file__).parent.parent / 'docs' / 'core'))
    from utils import PDFUtils


class PP_VATMainWindow(QMainWindow):
    """Main application window with split-screen PDF preview"""
    
    def __init__(self):
        super().__init__()
        self.pdf_path = None
        self.detected_vat = None
        self.corrected_pdf_buffer = None  # In-memory corrected PDF
        self.temp_file_path = None  # Store temp file path for cleanup
        
        self.setup_ui()
        self.apply_styling()
    
    def set_window_icon(self):
        """Set window icon from ressources"""
        try:
            icon_path = Path(__file__).parent.parent.parent / "ressources" / "images" / "logo.png"
            if icon_path.exists():
                app_icon = QIcon(str(icon_path))
                self.setWindowIcon(app_icon)
        except Exception as e:
            print(f"Warning: Could not load window icon: {e}")
    
    def create_branded_header(self, parent_layout):
        """Create branded header with logo/header image"""
        try:
            header_path = Path(__file__).parent.parent.parent / "ressources" / "images" / "header.jpg"
            
            if header_path.exists():
                header_frame = QFrame()
                header_frame.setFixedHeight(100)
                header_frame.setStyleSheet("""
                    QFrame {
                        background-color: white;
                        border-bottom: 1px solid #ddd;
                    }
                """)
                
                header_layout = QHBoxLayout(header_frame)
                header_layout.setContentsMargins(40, 0, 40, 0)
                
                # Load and center header image
                pixmap = QPixmap(str(header_path))
                header_label = QLabel()
                header_label.setPixmap(pixmap)
                header_label.setAlignment(Qt.AlignCenter)
                header_label.setStyleSheet("background-color: white;")
                
                header_layout.addStretch(1)
                header_layout.addWidget(header_label)
                header_layout.addStretch(1)
                
                parent_layout.addWidget(header_frame)
        except Exception as e:
            print(f"Warning: Could not create branded header: {e}")
    
    def setup_ui(self):
        """Initialize UI components"""
        self.setWindowTitle("PP_VAT - Automated VAT Detection and Removal")
        
        # Set window icon from ressources
        self.set_window_icon()
        
        self.setMinimumSize(1400, 800)
        self.resize(1400, 900)
        
        # Central widget
        central_widget = QWidget()
        self.setCentralWidget(central_widget)
        
        # Main layout
        main_layout = QVBoxLayout(central_widget)
        main_layout.setContentsMargins(0, 0, 0, 0)
        main_layout.setSpacing(0)
        
        # Branded header
        self.create_branded_header(main_layout)
        
        # Top menu bar (file selection + info)
        self.create_top_bar(main_layout)
        
        # Split view (left: original, right: corrected)
        self.create_split_view(main_layout)
        
        # Bottom action bar
        self.create_bottom_bar(main_layout)
    
    def create_top_bar(self, parent_layout):
        """Create top toolbar with file selection and info"""
        top_frame = QFrame()
        top_frame.setFixedHeight(80)
        top_frame.setStyleSheet("""
            QFrame {
                background-color: white;
                border-bottom: 1px solid #ddd;
            }
        """)
        
        layout = QHBoxLayout(top_frame)
        layout.setContentsMargins(20, 10, 20, 10)
        
        # Load PDF button
        self.load_btn = QPushButton("Load PDF Invoice")
        self.load_btn.setStyleSheet("""
            QPushButton {
                background-color: black;
                color: white;
                border: none;
                border-radius: 3px;
                padding: 8px 16px;
                font-size: 12pt;
                font-weight: bold;
                text-transform: uppercase;
            }
            QPushButton:hover {
                background-color: #333;
            }
        """)
        self.load_btn.clicked.connect(self.load_pdf_file)
        layout.addWidget(self.load_btn)
        
        layout.addStretch()
        
        # VAT info label
        self.vat_info_label = QLabel("No PDF loaded")
        self.vat_info_label.setStyleSheet("""
            QLabel {
                font-size: 13pt;
                font-weight: bold;
                color: black;
                padding: 8px 16px;
                background-color: #f8f8f8;
                border: 1px solid #ddd;
                border-radius: 3px;
            }
        """)
        layout.addWidget(self.vat_info_label)
        
        parent_layout.addWidget(top_frame)
    
    def create_split_view(self, parent_layout):
        """Create split screen with original (left) and corrected (right) PDF preview"""
        splitter = QSplitter(Qt.Horizontal)
        splitter.setChildrenCollapsible(False)
        
        # Left side: Original PDF
        left_container = QWidget()
        left_layout = QVBoxLayout(left_container)
        left_layout.setContentsMargins(10, 10, 10, 10)
        
        left_title = QLabel("Original PDF")
        left_title.setStyleSheet("font-size: 14pt; font-weight: bold; color: black;")
        left_layout.addWidget(left_title)
        
        self.original_preview = PDFPreviewWidget()
        left_layout.addWidget(self.original_preview)
        
        splitter.addWidget(left_container)
        
        # Right side: Corrected PDF
        right_container = QWidget()
        right_layout = QVBoxLayout(right_container)
        right_layout.setContentsMargins(10, 10, 10, 10)
        
        right_title = QLabel("Corrected PDF (VAT Removed)")
        right_title.setStyleSheet("font-size: 14pt; font-weight: bold; color: black;")
        right_layout.addWidget(right_title)
        
        self.corrected_preview = PDFPreviewWidget()
        right_layout.addWidget(self.corrected_preview)
        
        splitter.addWidget(right_container)
        
        # Set splitter proportions (50/50)
        splitter.setSizes([700, 700])
        
        parent_layout.addWidget(splitter, 1)  # Add stretch factor
    
    def create_bottom_bar(self, parent_layout):
        """Create bottom toolbar with Accept button"""
        bottom_frame = QFrame()
        bottom_frame.setFixedHeight(80)
        bottom_frame.setStyleSheet("""
            QFrame {
                background-color: white;
                border-top: 1px solid #ddd;
            }
        """)
        
        layout = QHBoxLayout(bottom_frame)
        layout.setContentsMargins(20, 10, 20, 10)
        
        layout.addStretch()
        
        # Accept button
        self.accept_btn = QPushButton("ACCEPT & SAVE")
        self.accept_btn.setStyleSheet("""
            QPushButton {
                background-color: black;
                color: white;
                border: none;
                border-radius: 3px;
                padding: 12px 32px;
                font-size: 13pt;
                font-weight: bold;
                text-transform: uppercase;
                min-width: 200px;
            }
            QPushButton:hover {
                background-color: #333;
            }
            QPushButton:disabled {
                background-color: #ccc;
                color: #999;
            }
        """)
        self.accept_btn.setEnabled(False)
        self.accept_btn.clicked.connect(self.save_corrected_pdf)
        layout.addWidget(self.accept_btn)
        
        layout.addStretch()
        
        parent_layout.addWidget(bottom_frame)
    
    def apply_styling(self):
        """Apply monochrome design system styling"""
        self.setStyleSheet("""
            QMainWindow {
                background-color: white;
            }
            QWidget {
                background-color: white;
                color: black;
            }
        """)
    
    def load_pdf_file(self):
        """Open file dialog and load PDF"""
        file_path, _ = QFileDialog.getOpenFileName(
            self,
            "Select PDF Invoice",
            str(Path.home()),
            "PDF Files (*.pdf *.PDF)"
        )
        
        if not file_path:
            return
        
        self.pdf_path = Path(file_path)
        self.process_pdf()
    
    def process_pdf(self):
        """Process PDF: detect VAT, apply corrections, preview"""
        if not self.pdf_path:
            return
        
        try:
            # Load original PDF for preview
            self.original_preview.load_pdf(self.pdf_path)
            
            # Detect VAT
            with pymupdf.open(str(self.pdf_path)) as doc:
                full_text = ""
                for page in doc:
                    full_text += page.get_text()
                
                self.detected_vat = PDFUtils.detect_vat_percentage(full_text)
                
                if self.detected_vat is None:
                    QMessageBox.warning(
                        self,
                        "VAT Detection Failed",
                        "Could not detect VAT percentage in this document.\n\n"
                        "Please ensure the PDF contains VAT information."
                    )
                    self.vat_info_label.setText("VAT Detection: Failed")
                    self.accept_btn.setEnabled(False)
                    return
                
                # Update VAT info
                self.vat_info_label.setText(f"Detected VAT: {self.detected_vat}%")
                
                # Apply corrections and create preview
                self.create_corrected_preview()
                
        except Exception as e:
            QMessageBox.critical(
                self,
                "Processing Error",
                f"Error processing PDF:\n{str(e)}"
            )
    
    def create_corrected_preview(self):
        """Create corrected PDF with VAT removed using complete main.py logic"""
        try:
            # Import the complete processing function from main.py
            from src.main import process_invoice
            
            # Process invoice with all the sophisticated logic from main.py
            # This includes:
            # - Proper discount % filtering
            # - VAT amount detection (highlight only, no replacement)
            # - VAT label highlighting
            # - Correct layering of highlights and text overlays
            
            # Create a temporary output file
            temp_output = self.pdf_path.parent / f"{self.pdf_path.stem}_temp.pdf"
            
            # Use the complete process_invoice function with "review" style for GUI preview
            output_path = process_invoice(self.pdf_path, "_temp", "review")
            
            if output_path and output_path.exists():
                # Store temp file path for cleanup later
                self.temp_file_path = output_path
                
                # Load corrected PDF in preview
                self.corrected_preview.load_pdf(output_path)
                
                # Keep the processed document for saving later
                self.corrected_pdf_buffer = pymupdf.open(str(output_path))
                
                # Enable accept button
                self.accept_btn.setEnabled(True)
            else:
                QMessageBox.warning(
                    self,
                    "Processing Failed",
                    "Could not create corrected PDF preview."
                )
                self.accept_btn.setEnabled(False)
            
        except Exception as e:
            QMessageBox.critical(
                self,
                "Processing Error",
                f"Error creating corrected PDF:\n{str(e)}"
            )
            import traceback
            traceback.print_exc()
            self.accept_btn.setEnabled(False)
    
    def save_corrected_pdf(self):
        """Open save dialog and save corrected PDF"""
        if not self.corrected_pdf_buffer:
            return
        
        # Suggest filename
        default_filename = f"{self.pdf_path.stem}_clean.pdf"
        
        file_path, _ = QFileDialog.getSaveFileName(
            self,
            "Save Corrected PDF",
            str(self.pdf_path.parent / default_filename),
            "PDF Files (*.pdf)"
        )
        
        if not file_path:
            return
        
        try:
            # Copy the processed temp file to the user's chosen location
            import shutil
            shutil.copy2(str(self.temp_file_path), file_path)
            
            # Optional: Clean up temp file after successful save
            # (Uncomment the next 2 lines if you want to delete temp files automatically)
            # if self.temp_file_path.exists():
            #     self.temp_file_path.unlink()
            
            QMessageBox.information(
                self,
                "Success",
                f"Corrected PDF saved to:\n{file_path}"
            )
                
        except Exception as e:
            QMessageBox.critical(
                self,
                "Save Error",
                f"Error saving PDF:\n{str(e)}"
            )
    
    def closeEvent(self, event):
        """Cleanup when closing"""
        # Cleanup preview widgets
        self.original_preview.cleanup()
        self.corrected_preview.cleanup()
        
        # Close PDF buffer if exists
        if self.corrected_pdf_buffer:
            self.corrected_pdf_buffer.close()
        
        # Clean up temp file if it exists
        if self.temp_file_path and self.temp_file_path.exists():
            try:
                self.temp_file_path.unlink()
                print(f"Cleaned up temp file: {self.temp_file_path}")
            except Exception as e:
                print(f"Could not delete temp file: {e}")
        
        event.accept()


def main():
    """Main entry point for GUI application"""
    from PySide6.QtWidgets import QApplication
    
    app = QApplication(sys.argv)
    app.setStyle('Fusion')  # Use Fusion style for modern look
    
    window = PP_VATMainWindow()
    window.show()
    
    sys.exit(app.exec())


if __name__ == "__main__":
    main()

