"""
Quick test script to run the orchestrator on example_1.PDF
"""

import sys
from pathlib import Path

# Add parent directory to path
sys.path.insert(0, str(Path(__file__).parent.parent))

# Import the orchestrator
from core.orchestrator import PDFInvoiceOrchestrator
import json

def main():
    # Load configuration
    config_path = Path(__file__).parent.parent / "configs" / "config_hetzner.json"
    
    with open(config_path, 'r') as f:
        updates = json.load(f)
    
    # Process the example PDF
    pdf_path = Path(__file__).parent.parent / "examples" / "example_1.PDF"
    
    if not pdf_path.exists():
        print(f"Error: PDF file not found: {pdf_path}")
        return 1
    
    print(f"Processing: {pdf_path}")
    print(f"Configuration: {config_path}")
    print(f"Updates: {len(updates)} items")
    print("\nStarting processing...\n")
    
    try:
        orchestrator = PDFInvoiceOrchestrator(
            pdf_path=pdf_path,
            updates=updates,
            output_suffix="_clean"
        )
        
        output_path = orchestrator.process()
        
        print(f"\n[SUCCESS] Created: {output_path}")
        return 0
        
    except Exception as e:
        print(f"\n[ERROR] {e}")
        import traceback
        traceback.print_exc()
        return 1

if __name__ == '__main__':
    sys.exit(main())

