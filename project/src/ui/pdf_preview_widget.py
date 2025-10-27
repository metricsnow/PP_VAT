"""
PDF Preview Widget
Displays PDF pages as rendered images with zoom and navigation
"""

from PySide6.QtWidgets import QWidget, QVBoxLayout, QHBoxLayout, QLabel, QScrollArea, QPushButton
from PySide6.QtCore import Qt
from PySide6.QtGui import QPixmap, QImage, QPalette
from pathlib import Path
import pymupdf


class PDFPreviewWidget(QWidget):
    """Widget for displaying PDF pages as rendered images"""
    
    def __init__(self, parent=None):
        super().__init__(parent)
        self.pdf_path = None
        self.doc = None
        self.current_page = 0
        
        self.setup_ui()
    
    def setup_ui(self):
        """Initialize the UI layout"""
        layout = QVBoxLayout(self)
        layout.setContentsMargins(0, 0, 0, 0)
        
        # Scroll area for PDF content
        self.scroll_area = QScrollArea()
        self.scroll_area.setWidgetResizable(True)
        self.scroll_area.setBackgroundRole(QPalette.ColorRole.Window)
        
        # Container for PDF content
        self.content_widget = QWidget()
        self.content_layout = QVBoxLayout(self.content_widget)
        self.content_layout.setAlignment(Qt.AlignCenter)
        
        # PDF image label
        self.pdf_label = QLabel("No PDF loaded")
        self.pdf_label.setAlignment(Qt.AlignCenter)
        self.pdf_label.setMinimumSize(600, 800)
        self.pdf_label.setScaledContents(False)  # Don't scale individual pixmaps
        self.pdf_label.setStyleSheet("""
            QLabel {
                background-color: #f0f0f0;
                border: 1px solid #ddd;
                border-radius: 3px;
            }
        """)
        
        self.content_layout.addWidget(self.pdf_label)
        
        # Page navigation controls
        self.page_nav_widget = self.create_page_navigation()
        self.content_layout.addWidget(self.page_nav_widget)
        
        self.scroll_area.setWidget(self.content_widget)
        layout.addWidget(self.scroll_area)
    
    def create_page_navigation(self):
        """Create page navigation controls"""
        nav_widget = QWidget()
        nav_layout = QHBoxLayout(nav_widget)
        nav_layout.setAlignment(Qt.AlignCenter)
        
        # Previous button
        self.prev_btn = QPushButton("◀ Previous")
        self.prev_btn.setStyleSheet("""
            QPushButton {
                background-color: white;
                color: black;
                border: 1px solid black;
                border-radius: 3px;
                padding: 5px 15px;
                font-weight: bold;
            }
            QPushButton:hover {
                background-color: black;
                color: white;
            }
            QPushButton:disabled {
                background-color: #eee;
                color: #999;
                border-color: #ddd;
            }
        """)
        self.prev_btn.setEnabled(False)
        self.prev_btn.clicked.connect(self.go_to_previous_page)
        nav_layout.addWidget(self.prev_btn)
        
        # Page indicator
        self.page_label = QLabel("Page 0 of 0")
        self.page_label.setStyleSheet("font-size: 12pt; font-weight: bold; padding: 0 20px;")
        self.page_label.setAlignment(Qt.AlignCenter)
        nav_layout.addWidget(self.page_label)
        
        # Next button
        self.next_btn = QPushButton("Next ▶")
        self.next_btn.setStyleSheet("""
            QPushButton {
                background-color: white;
                color: black;
                border: 1px solid black;
                border-radius: 3px;
                padding: 5px 15px;
                font-weight: bold;
            }
            QPushButton:hover {
                background-color: black;
                color: white;
            }
            QPushButton:disabled {
                background-color: #eee;
                color: #999;
                border-color: #ddd;
            }
        """)
        self.next_btn.setEnabled(False)
        self.next_btn.clicked.connect(self.go_to_next_page)
        nav_layout.addWidget(self.next_btn)
        
        return nav_widget
    
    def load_pdf(self, pdf_path: Path):
        """
        Load and display PDF file
        
        Args:
            pdf_path: Path to PDF file
        """
        self.pdf_path = pdf_path
        
        try:
            # Open PDF
            self.doc = pymupdf.open(str(pdf_path))
            
            # Render first page
            self.render_page(0)
            
            # Update page navigation
            self.update_page_navigation()
            
            return True
        except Exception as e:
            self.pdf_label.setText(f"Error loading PDF:\n{str(e)}")
            self.pdf_label.setStyleSheet("""
                QLabel {
                    background-color: #fff3cd;
                    border: 2px solid #ffc107;
                    border-radius: 3px;
                    color: #856404;
                    padding: 20px;
                }
            """)
            return False
    
    def render_page(self, page_num: int):
        """
        Render specific page of PDF
        
        Args:
            page_num: Page number (0-indexed)
        """
        if not self.doc:
            return
        
        if page_num < 0 or page_num >= len(self.doc):
            return
        
        try:
            page = self.doc[page_num]
            self.current_page = page_num
            
            # Get scroll area size for responsive rendering
            scroll_width = self.scroll_area.width()
            scroll_height = self.scroll_area.height()
            
            # Use available size or minimum size
            target_width = max(scroll_width - 40, 600)
            target_height = max(scroll_height - 40, 800)
            
            # Calculate zoom factor based on page size and target size
            zoom_x = target_width / page.rect.width
            zoom_y = target_height / page.rect.height
            zoom = min(zoom_x, zoom_y, 2.0)  # Cap at 2x for quality
            
            # Render page to image with calculated zoom
            mat = pymupdf.Matrix(zoom, zoom)
            pix = page.get_pixmap(matrix=mat)
            
            # Convert to QImage
            img_data = pix.tobytes("png")
            qimage = QImage.fromData(img_data)
            pixmap = QPixmap.fromImage(qimage)
            
            # Set pixmap on label
            self.pdf_label.setPixmap(pixmap)
            self.pdf_label.adjustSize()  # Adjust size to pixmap
            
            # Update page navigation
            self.update_page_navigation()
            
        except Exception as e:
            self.pdf_label.setText(f"Error rendering page:\n{str(e)}")
    
    def update_page_navigation(self):
        """Update page navigation buttons and label"""
        if not self.doc:
            return
        
        total_pages = len(self.doc)
        current_page = self.current_page + 1  # Display as 1-indexed
        
        # Update page label
        self.page_label.setText(f"Page {current_page} of {total_pages}")
        
        # Update button states
        self.prev_btn.setEnabled(self.current_page > 0)
        self.next_btn.setEnabled(self.current_page < total_pages - 1)
    
    def go_to_previous_page(self):
        """Navigate to previous page"""
        if self.current_page > 0:
            self.render_page(self.current_page - 1)
    
    def go_to_next_page(self):
        """Navigate to next page"""
        if self.doc and self.current_page < len(self.doc) - 1:
            self.render_page(self.current_page + 1)
    
    def resizeEvent(self, event):
        """Handle widget resize to re-render PDF at new size"""
        super().resizeEvent(event)
        if self.doc and self.current_page >= 0:
            # Re-render current page with new size
            self.render_page(self.current_page)
    
    def cleanup(self):
        """Close PDF document"""
        if self.doc:
            self.doc.close()
            self.doc = None

