"""
GUI Entry Point for PP_VAT Application
Launches split-screen PDF preview interface
"""

import sys
from pathlib import Path

# Add src to path
sys.path.insert(0, str(Path(__file__).parent))

from ui.main_window import main

if __name__ == "__main__":
    main()

