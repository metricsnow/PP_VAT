# TASK-006: Testing and Quality Assurance

**Status:** Waiting  
**Impact:** High  
**Description:** Comprehensive testing strategy for web application including unit tests, integration tests, and end-to-end testing  
**Date:** 2025-01-27  
**Estimated Effort:** 6 hours  
**Priority:** P0 - Blocking

---

## Objective

Ensure the web application is production-ready with comprehensive test coverage for all components: backend API, PDF processing logic, frontend, and deployment configuration.

## Context

Testing is critical for a financial application processing invoices. We need to ensure:
- Accurate VAT detection
- Correct price calculations
- File handling security
- API reliability
- User experience quality

## Testing Strategy

### Test Pyramid
```
        /\
       /E2E\         Few, slow, expensive
      /------\
     /Integration\  Some, medium speed
    /------------\
   /  Unit Tests  \ Many, fast, cheap
  /----------------\
```

### Test Categories

1. **Unit Tests** - Test individual functions
2. **Integration Tests** - Test API endpoints
3. **E2E Tests** - Test full user workflows
4. **Performance Tests** - Test scalability
5. **Security Tests** - Test vulnerabilities

## Implementation Tasks

### 1. Create Test Directory Structure

```
project/
├── tests/
│   ├── __init__.py
│   ├── conftest.py                    # Pytest configuration
│   ├── test_utils.py                  # Utility functions
│   ├── unit/
│   │   ├── __init__.py
│   │   ├── test_vat_detection.py     # VAT detection logic
│   │   ├── test_price_extraction.py  # Price extraction logic
│   │   └── test_calculations.py      # Calculation logic
│   ├── integration/
│   │   ├── __init__.py
│   │   ├── test_api_endpoints.py     # API endpoint tests
│   │   └── test_file_processing.py   # File processing tests
│   └── e2e/
│       ├── __init__.py
│       └── test_user_workflows.py    # Full workflow tests
```

### 2. Update requirements.txt

Add testing dependencies:

```belt
# Testing
pytest>=8.0.0
pytest-asyncio>=0.23.0
pytest-cov>=4.1.0
httpx>=0.27.0
pytest-mock>=3.12.0
```

### 3. Create Pytest Configuration (conftest.py)

```python
import pytest
from pathlib import Path
import sys
import tempfile
import shutil

# Add project to path
PROJECT_ROOT = Path(__file__).parent.parent
sys.path.insert(0, str(PROJECT_ROOT))
sys.path.insert(0, str(PROJECT_ROOT / "project" / "src"))

@pytest.fixture
def temp_dir():
    """Create temporary directory for tests"""
    tmp_dir = tempfile.mkdtemp()
    yield Path(tmp_dir)
    shutil.rmtree(tmp_dir)

@pytest.fixture
def sample_pdf_path():
    """Path to sample PDF for testing"""
    return PROJECT_ROOT / "project" / "examples" / "example_1.PDF"

@pytest.fixture
def client():
    """FastAPI test client"""
    from project.src.web.app import app
    from fastapi.testclient import TestClient
    return TestClient(app)
```

### 4. Unit Tests

#### test_vat_detection.py

```python
import pytest
from docs.core.utils import PDFUtils

class TestVATDetection:
    """Test VAT detection logic"""
    
    def test_detect_vat_percentage_standard(self):
        """Test standard VAT detection"""
        text = "Invoice for services. VAT (19%): €380.00"
        result = PDFUtils.detect_vat_percentage(text)
        assert result == 19.0
    
    def test_detect_vat_percentage_german(self):
        """Test German VAT detection"""
        text = "MwSt 19% auf Rechnungsbetrag"
        result = PDFUtils.detect_vat_percentage(text)
        assert result == 19.0
    
    def test_detect_vat_percentage_not_found(self):
        """Test when VAT not found"""
        text = "This invoice has no VAT information"
        result = PDFUtils.detect_vat_percentage(text)
        assert result is None
    
    def test_detect_vat_percentage_decimal(self):
        """Test decimal VAT detection"""
        text = "VAT 8.1% on this invoice"
        result = PDFUtils.detect_vat_percentage(text)
        assert result == 8.1
```

#### test_calculations.py

```python
import pytest

def test_remove_vat_from_price():
    """Test VAT removal calculation"""
    # Price with 19% VAT: 1190.00
    # Price without VAT: 1000.00
    price_with_vat = 1190.00
    vat_percentage = 19.0
    price_without_vat = price_with_vat / (1 + vat_percentage / 100)
    assert price_without_vat == pytest.approx(1000.00, abs=0.01)

def test_remove_vat_8_1_percent():
    """Test 8.1% VAT removal"""
    price_with_vat = 810.00
    vat_percentage = 8.1
    price_without_vat = price_with_vat / (1 + vat_percentage / 100)
    assert price_without_vat == pytest.approx(749.31, abs=0.01)
```

### 5. Integration Tests

#### test_api_endpoints.py

```python
import pytest
from fastapi.testclient import TestClient

def test_health_endpoint(client):
    """Test health check endpoint"""
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "healthy"

def test_process_pdf_success(client, sample_pdf_path):
    """Test successful PDF processing"""
    with open(sample_pdf_path, "rb") as f:
        response = client.post(
            "/api/process",
            files={"file": ("test.pdf", f, "application/pdf")}
        )
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "success"
    assert "detected_vat" in data
    assert "download_url" in data

def test_process_pdf_invalid_file(client):
    """Test processing invalid file"""
    response = client.post(
        "/api/process",
        files={"file": ("test.txt", b"not a pdf", "text/plain")}
    )
    assert response.status_code == 400

def test_download_endpoint(client, sample_pdf_path):
    """Test download endpoint"""
    # First process a PDF
    with open(sample_pdf_path, "rb") as f:
        process_response = client.post(
            "/api/process",
            files={"file": ("test.pdf", f, "application/pdf")}
        )
    
    download_url = process_response.json()["download_url"]
    
    # Download the processed PDF
    download_response = client.get(download_url)
    assert download_response.status_code == 200
    assert download_response.headers["content-type"] == "application/pdf"
```

### 6. E2E Tests

#### test_user_workflows.py

```python
import pytest
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from pathlib import Path

@pytest.fixture
def driver():
    """Initialize WebDriver"""
    options = webdriver.ChromeOptions()
    options.add_argument("--headless")
    driver = webdriver.Chrome(options=options)
    yield driver
    driver.quit()

def test_complete_workflow(driver, sample_pdf_path):
    """Test complete user workflow"""
    # Navigate to application
    driver.get("http://localhost:8080")
    
    # Upload file
    file_input = driver.find_element(By.ID, "fileInput")
    file_input.send_keys(str(sample_pdf_path))
    
    # Wait for processing
    WebDriverWait(driver, 30).until(
        EC.presence_of_element_located((By.ID, "correctedPdf"))
    )
    
    # Verify VAT is displayed
    vat_element = driver.find_element(By.ID, "vatPercentage")
    assert vat_element.text != "--"
    
    # Verify download button is present
    download_btn = driver.find_element(By.ID, "downloadBtn")
    assert download_btn.is_displayed()
```

### 7. Performance Tests

Create `test_performance.py`:

```python
import pytest
import time
from concurrent.futures import ThreadPoolExecutor

def test_concurrent_requests(client, sample_pdf_path):
    """Test handling multiple concurrent requests"""
    def process_pdf():
        with open(sample_pdf_path, "rb") as f:
            response = client.post(
                "/api/process",
                files={"file": ("test.pdf", f, "application/pdf")}
            )
        return response.status_code == 200
    
    # Run 10 concurrent requests
    with ThreadPoolExecutor(max_workers=10) as executor:
        results = list(executor.map(lambda _: process_pdf(), range(10)))
    
    assert all(results)

def test_large_file_handling(client, temp_dir):
    """Test handling large PDF files"""
    # Create large dummy PDF (simplified)
    large_file = temp_dir / "large.pdf"
    large_file.write_bytes(b"PDF content " * 1000000)  # ~12MB
    
    with open(large_file, "rb") as f:
        response = client.post(
            "/api/process",
            files={"file": ("large.pdf", f, "application/pdf")},
            timeout=60  # Long timeout for large files
        )
    
    # Should handle gracefully (may fail detection but not crash)
    assert response.status_code in [200, 400, 500]
```

## Dependencies

- TASK-001 through TASK-005 (all previous tasks)
- pytest and testing libraries installed

## Acceptance Criteria

- [ ] Unit tests achieve 80%+ code coverage
- [ ] All API endpoints have integration tests
- [ ] E2E tests cover main user workflows
- [ ] Performance tests validate concurrent handling
- [ ] Tests run in CI/CD pipeline
- [ ] No critical bugs found
- [ ] All tests pass consistently

## Test Execution

```bash
# Run all tests
pytest

# Run with coverage
pytest --cov=project.src --cov-report=html

# Run specific test category
pytest tests/unit/
pytest tests/integration/
pytest tests/e2e/

# Run specific test file
pytest tests/unit/test_vat_detection.py

# Run in verbose mode
pytest -v
```

## CI/CD Integration

Add to `.github/workflows/test.yml`:

```yaml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-python@v2
        with:
          python-version: '3.9'
      - run: pip install -r requirements.txt
      - run: pytest --cov --cov-report=xml
      - uses: codecov/codecov-action@v2
```

## Notes

- Use fixtures for common test data
- Mock external dependencies
- Test both success and failure scenarios
- Use realistic test data
- Ensure tests are independent
- Clean up after tests

## References

- pytest docs: https://docs.pytest.org/
- FastAPI testing: https://fastapi.tiangolo.com/tutorial/testing/
- Project structure: `project/tests/`

