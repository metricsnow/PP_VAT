"""
Quick test script to verify module imports work correctly.
"""

try:
    from project.src.orchestrator import PDFInvoiceOrchestrator
    from project.src.utils import PDFUtils
    print("✅ Successfully imported from project.src")
except Exception as e:
    print(f"❌ Import from project.src failed: {e}")
    
try:
    from orchestrator import PDFInvoiceOrchestrator
    from utils import PDFUtils
    print("✅ Successfully imported with relative imports")
except Exception as e:
    print(f"❌ Relative import failed: {e}")

print("\nModule structure verified successfully!")

