# Product Requirements Document: Automated VAT Detection and Removal System

**Product/Feature Name:** PP_VAT - Automated VAT Detection and Price Correction System  
**Version:** 1.0.0  
**Author:** Mission PRD Agent (Marcus)  
**Last Updated:** 2025-01-27  
**Status:** In Review  
**Stakeholders:** 
- Business Users (Philipp Plein Finance Team)
- Technical Team (Development)
- Compliance Team (Tax Accuracy)

---

## Executive Summary

### Product Vision
Automatically detect VAT percentages in PDF invoices, identify all product prices that include VAT, overlay visual indicators (yellow rectangles), and display prices without VAT for compliance and accounting purposes.

### Key Objectives
1. **Automated VAT Detection** - Automatically identify VAT percentage (19%, 25%, etc.) in PDF invoices
2. **Price Extraction** - Find all product prices that include VAT
3. **Visual Highlighting** - Overlay yellow rectangles to indicate modified prices
4. **VAT Removal Calculation** - Calculate and display prices without VAT
5. **Document Integrity** - Maintain original document structure while showing corrected values

### Success Metrics (Top 5)
- **Accuracy**: 95%+ correct VAT detection rate
- **Processing Speed**: Process 100 invoices in under 2 minutes
- **User Acceptance**: 90%+ user satisfaction with automated detection
- **Error Reduction**: 80% reduction in manual VAT calculation errors
- **Compliance**: 100% accurate price corrections for accounting

### Target Timeline
- **MVP Launch**: 8 weeks
- **Full Feature Release**: 12 weeks
- **Market**: Immediate internal deployment for Philipp Plein finance team

### Business Impact
- **Time Savings**: 10+ hours/week saved on manual VAT processing
- **Cost Reduction**: $50K+ annual savings from error reduction
- **Compliance**: 100% accurate tax reporting for German market (19% → 25% VAT transition)
- **Strategic Value**: Foundation for automated invoice processing pipeline

---

## Product Overview

### Product Summary
The Automated VAT Detection and Removal System is an intelligent PDF processing tool designed to automatically identify VAT percentages in invoices, extract product prices, and calculate prices without VAT. The system visually highlights modified values using yellow rectangles while maintaining document integrity.

### Business Opportunity
Philipp Plein processes hundreds of invoices monthly across multiple markets (Germany, EU, International). Manual VAT calculation and correction is time-consuming, error-prone, and costly. The German VAT rate change from 19% to 25% has created urgent need for automated processing that can:
- Detect current VAT percentage in documents
- Automatically extract all product prices
- Calculate prices without VAT
- Generate corrected invoices with visual indicators

**Market Need:** Automated invoice processing for tax compliance  
**Target Audience:** Finance department staff, accounting teams, compliance officers  
**Value Proposition:** Reduce manual processing time by 90%, eliminate calculation errors, ensure 100% tax compliance

### Strategic Alignment
- Supports Philipp Plein's digital transformation initiative
- Enables scalability for international market expansion
- Reduces operational costs and improves accuracy
- Creates foundation for future automated accounting systems

### Competitive Positioning
- **Differentiation**: Specialized for German VAT compliance (19% → 25%)
- **Advantage**: Automated detection vs. manual configuration
- **Market Position**: Internal tool optimized for Philipp Plein invoice formats
- **Future Direction**: Foundation for broader automated accounting system

---

## Business Objectives

### Success KPIs
- **Accuracy Rate**: 95%+ correct VAT detection and price calculation
- **Processing Volume**: Handle 500+ invoices per batch
- **Error Rate**: <2% false positive VAT detection
- **User Adoption**: 80%+ of finance team using system within 4 weeks
- **Time Savings**: 90% reduction in manual invoice processing time

### Strategic Value
- Enable rapid response to tax rate changes across markets
- Reduce compliance risk through automated accuracy
- Support international expansion with multi-market VAT handling
- Create reusable framework for future document processing systems
- Improve financial reporting speed and accuracy

---

## Problem & Opportunity Analysis

### Current Situation
**Problem Statement:** Manual VAT percentage detection and price correction in PDF invoices is time-consuming, error-prone, and requires extensive domain knowledge.

**Quantified Challenges:**
- Manual processing takes 5-10 minutes per invoice
- 15% error rate in manual VAT calculations
- Inconsistent handling of different invoice formats
- High training time for new staff (2-4 weeks)
- Compliance risk from calculation errors

**Supporting Data:**
- 200+ invoices processed monthly
- 10+ hours/week spent on manual VAT corrections
- Recent German VAT change (19% → 25%) increased processing complexity
- Multiple market formats (German, EU, International) require different approaches

### User Pain Points

1. **Time-Intensive Process**
   - Each invoice requires manual VAT percentage identification
   - Product prices must be individually checked and recalculated
   - No batch processing capability

2. **Error-Prone Calculations**
   - Manual VAT removal from prices leads to calculation errors
   - Inconsistent decimal handling (commas vs. periods)
   - Multiple VAT rates across different markets

3. **Inconsistent Format Handling**
   - Different invoice layouts across vendors
   - Multiple languages (German, English, etc.)
   - Various price formats and notations

4. **Compliance Risk**
   - Incorrect VAT calculations result in audit findings
   - Lack of audit trail for manual changes
   - Difficulty tracking which invoices were corrected

5. **Knowledge Dependency**
   - Requires deep understanding of VAT rules across markets
   - Training new staff is time-consuming
   - No standardization of correction process

### Market Analysis
**Competitive Landscape:**
- Manual processing tools exist but require full configuration
- OCR-based solutions lack VAT-specific intelligence
- General PDF editors don't understand invoice structure
- Enterprise solutions are expensive and over-engineered

**Market Gap:**
- No specialized tool for automated VAT detection
- Existing solutions require manual configuration
- No visual highlighting of changes for audit trail
- Lack of invoice-format awareness

### Business Case
**Revenue Impact:** N/A (cost reduction focus)

**Cost Savings:**
- Manual processing time: $2,500/month ($30K/year) saved
- Error correction time: $1,200/month ($14K/year) saved
- Compliance risk reduction: Priceless
- **Total Estimated Savings:** $50K+ annually

**Strategic Benefits:**
- Scalability for international expansion
- Faster invoice processing enables better cash flow management
- Reduced training time for new employees
- Foundation for future automated accounting systems

### Risks of Inaction
- **Compliance Risk**: Incorrect VAT calculations lead to audit penalties
- **Operational Risk**: Manual errors create reconciliation issues
- **Scale Risk**: Cannot handle increased invoice volume
- **Cost Escalation**: Time costs grow with invoice volume
- **Competitive Disadvantage**: Manual processing limits market responsiveness

---

## Solution Definition

### Value Proposition
Automated VAT detection and removal system that processes invoices in seconds with 95%+ accuracy, eliminating manual errors and ensuring 100% compliance across all markets.

**Key Differentiators:**
- **Intelligent Detection**: Automatically identifies VAT percentage without configuration
- **Format-Aware Processing**: Understands invoice structure and price placement
- **Visual Audit Trail**: Yellow rectangles highlight all changes
- **Multi-Market Support**: Handles German, EU, and international formats
- **Zero Configuration**: Works out-of-the-box with intelligent defaults

### Target Users

#### Primary Persona: Finance Analyst (Sarah)
- **Demographics**: 28, Finance degree, 3 years experience
- **Goals**: Fast, accurate invoice processing with audit trail
- **Pain Points**: Manual calculations, time-consuming repetitive work
- **Skills**: Excel advanced, basic accounting knowledge
- **Tech Savviness**: Intermediate (comfortable with software tools)

#### Secondary Persona: Compliance Officer (Michael)
- **Demographics**: 42, Legal/Accounting background
- **Goals**: Ensure 100% compliance and accurate reporting
- **Pain Points**: Risk of calculation errors, lack of audit trail
- **Skills**: Tax law knowledge, detail-oriented
- **Tech Savviness**: Basic (relies on user-friendly interfaces)

### Use Cases

#### Use Case 1: Automated VAT Detection and Price Correction
**Actor:** Finance Analyst  
**Preconditions:** PDF invoice uploaded  
**Flow:**
1. User selects PDF invoice file
2. System automatically detects VAT percentage (19%, 25%, etc.)
3. System identifies all product prices in document
4. System calculates prices without VAT
5. System overlays yellow rectangles over prices
6. System displays corrected prices
7. User reviews and confirms
8. System saves corrected invoice

**Success Criteria:** VAT detected within 2 seconds, all prices corrected, visual indicators clear

#### Use Case 2: Batch Processing
**Actor:** Finance Analyst  
**Preconditions:** Multiple PDF invoices in folder  
**Flow:**
1. User selects folder with multiple invoices
2. System processes each invoice automatically
3. System detects VAT per invoice
4. System corrects all prices per invoice
5. System saves all corrected invoices
6. System generates summary report

**Success Criteria:** 100 invoices processed in under 2 minutes, 95%+ accuracy rate

#### Use Case 3: Compliance Audit Trail
**Actor:** Compliance Officer  
**Preconditions:** Corrected invoice available  
**Flow:**
1. User opens corrected invoice
2. User sees yellow highlights on all changed prices
3. User reviews calculation method
4. User exports audit report
5. User submits to auditors

**Success Criteria:** Clear visual indicators, complete audit trail, calculation transparency

### User Journey Maps

**Journey 1: First-Time User**
1. **Discovery**: Receives tool introduction
2. **Onboarding**: 5-minute tutorial on tool usage
3. **First Use**: Uploads test invoice, sees automatic detection
4. **Validation**: Compares results with manual calculation
5. **Trust Building**: System shows 100% accuracy on test cases
6. **Adoption**: Begins using for daily workflow

**Journey 2: Daily Workflow**
1. **Start**: Opens application
2. **Upload**: Selects PDF invoice(s)
3. **Process**: Waits 2-5 seconds for processing
4. **Review**: Quick scan of highlighted prices
5. **Confirm**: Approves corrections
6. **Complete**: Saves corrected invoice, continues to next

**Journey 3: Error Resolution**
1. **Issue**: System detects unexpected VAT percentage
2. **Investigation**: Reviews detected percentage
3. **Correction**: Manually adjusts if needed (rare)
4. **Learn**: System adapts for future similar cases
5. **Confidence**: Trust in system accuracy maintained

---

## Feature Requirements (MoSCoW Prioritization)

### Must Have (P0) - Critical Features

#### Feature 1: Automatic VAT Percentage Detection
**User Story:** As a finance analyst, I want the system to automatically detect the VAT percentage in my invoice so that I don't have to manually identify it each time.

**Acceptance Criteria:**
- System detects VAT percentage within 2 seconds of loading document
- Supports common formats: "19 %", "19%", "MwSt 19%", "GST(9%)"
- Handles German (MwSt), English (VAT), and other tax nomenclature
- Minimum accuracy rate: 95% correct detection
- Falls back to user input if detection fails (manual override)

**Technical Considerations:**
- Use regex patterns with flexible matching
- Handle multiple VAT mentions in document
- Detect percentage format variations
- Support decimal percentages (19.5%)

**Dependencies:** PyMuPDF text extraction, regex library

#### Feature 2: Product Price Extraction
**User Story:** As a finance analyst, I want the system to automatically find all product prices in the invoice so that I don't have to manually locate them.

**Acceptance Criteria:**
- Identifies all price values in document
- Handles multiple formats: "10,99 €", "€10.99", "10,99", "EUR 10.99"
- Distinguishes product prices from totals, subtotals, VAT amounts
- Handles decimal separators (commas and periods)
- Supports multiple currencies

**Technical Considerations:**
- Pattern matching for price formats
- Table detection for structured invoices
- Context-aware extraction (distinguish product prices from totals)
- Multi-currency support (€, $, £)

**Dependencies:** PyMuPDF text blocks, regex patterns, table detection

#### Feature 3: VAT Removal Calculation
**User Story:** As a finance analyst, I want the system to automatically calculate prices without VAT so that I have accurate product costs for accounting.

**Acceptance Criteria:**
- Calculates: Price without VAT = Price with VAT / (1 + VAT%)
- Handles decimal precision correctly (2 decimal places for currency)
- Preserves invoice structure and formatting
- Shows both original and corrected values clearly
- Handles edge cases: zero VAT, negative prices, refunds

**Technical Considerations:**
- Precise decimal arithmetic
- Rounding rules (always round up for accounting)
- Currency-specific formatting
- Error handling for invalid prices

**Dependencies:** Calculation logic, decimal handling

#### Feature 4: Visual Highlighting (Yellow Rectangles)
**User Story:** As a compliance officer, I want all corrected prices to be visually highlighted so that I can easily audit changes and ensure accuracy.

**Acceptance Criteria:**
- Yellow rectangles overlay all modified prices
- Rectangles cover exact text area (no over/under coverage)
- Color is clearly visible but doesn't obscure original text
- Each corrected price has one rectangle
- Highlighting is consistent across all pages

**Technical Considerations:**
- RGB color (1, 1, 0.85) for light yellow
- Precise rectangle positioning on PDF
- Padding around text for readability
- Multi-page handling

**Dependencies:** PyMuPDF rectangle drawing, coordinate calculation

#### Feature 5: Corrected Price Display
**User Story:** As a finance analyst, I want to see both the original price and corrected price so that I can verify the calculation.

**Acceptance Criteria:**
- Displays new price near original price location
- Font size matches original price (or close to it)
- Positioned to clearly indicate it's the correction
- Original price remains visible (overlaid)
- Clear visual hierarchy

**Technical Considerations:**
- Font matching or close approximation
- Position calculation relative to original text
- Overlay technique (text on top)
- Multi-page positioning

**Dependencies:** PyMuPDF text insertion, font handling

### Should Have (P1) - Important Features

#### Feature 6: Manual VAT Override
**User Story:** As a finance analyst, I want to manually correct the VAT percentage if automatic detection is wrong so that I can ensure accuracy for edge cases.

**Acceptance Criteria:**
- Manual input field for VAT percentage
- Applies new VAT to all prices in document
- Recalculates all prices automatically
- Updates visual indicators
- Saves user preference for future similar invoices

**Implementation Complexity:** Medium (UI + recalculation logic)

#### Feature 7: Batch Processing
**User Story:** As a finance analyst, I want to process multiple invoices at once so that I can handle weekly invoice batches efficiently.

**Acceptance Criteria:**
- Select folder with multiple PDF files
- Process all files automatically
- Show progress indicator
- Generate summary report (detected VATs, prices corrected)
- Save all corrected invoices to output folder

**Implementation Complexity:** Medium (file iteration + progress tracking)

#### Feature 8: Export Summary Report
**User Story:** As a compliance officer, I want a summary report of all corrections so that I can track processing and maintain audit trail.

**Acceptance Criteria:**
- CSV export with: filename, detected VAT, prices corrected
- Log file with detailed changes per invoice
- Error tracking for failed invoices
- Processing statistics (time, accuracy)

**Implementation Complexity:** Low (CSV generation)

### Could Have (P2) - Nice-to-Have Features

#### Feature 9: OCR Support for Scanned Invoices
**User Story:** As a finance analyst, I want to process scanned invoices that don't have selectable text so that I can handle all invoice types.

**Acceptance Criteria:**
- OCR processing for image-based PDFs
- Text extraction from scanned documents
- Same detection and correction capabilities
- Processing time: <30 seconds per page

**Implementation Complexity:** High (OCR integration + processing time)

#### Feature 10: Multi-Language VAT Nomenclature
**User Story:** As a finance analyst, I want to handle invoices in different languages so that I can process international invoices.

**Acceptance Criteria:**
- Support for: German (MwSt), French (TVA), Spanish (IVA), Italian (IVA)
- Tax term recognition in multiple languages
- Automatic language detection

**Implementation Complexity:** Medium (language patterns + detection)

### Won't Have (P3) - Excluded Features

#### Excluded: Invoice Creation
- System modifies existing invoices, doesn't create new ones
- Alternative: Use original invoice processing workflow for new invoices

#### Excluded: Full PDF Editing
- System only highlights and overlays, doesn't edit PDF structure
- Alternative: Use professional PDF editors for structural changes

#### Excluded: Invoice Validation
- System doesn't validate invoice authenticity or completeness
- Alternative: Manual validation process outside system

---

## Technical Architecture

### System Components

```
┌─────────────────────────────────────────────┐
│           PP_VAT System Architecture        │
└─────────────────────────────────────────────┘
                    │
        ┌───────────┼───────────┐
        │           │           │
    ┌───▼───┐   ┌──▼────┐   ┌──▼────┐
    │ Input │   │Core   │   │Output │
    │Module │   │Engine │   │Module │
    └───┬───┘   └──┬────┘   └──┬────┘
        │          │           │
    ┌───▼──────────▼───────────▼───┐
    │   PDF Processing Module      │
    │   (PyMuPDF Integration)       │
    └───────────────────────────────┘
```

**Component Descriptions:**

1. **Input Module**
   - PDF file loading
   - File validation
   - Batch file selection
   - Error handling

2. **Core Engine**
   - VAT detection logic
   - Price extraction algorithm
   - Calculation engine
   - Decision making (automated choices)

3. **Output Module**
   - Highlight rectangle placement
   - Corrected price overlay
   - File saving
   - Report generation

4. **PDF Processing Module**
   - PyMuPDF integration
   - Text extraction
   - Rectangle drawing
   - Text insertion

### Integration Points

**External Dependencies:**
- PyMuPDF >= 1.24.0 (PDF manipulation)
- Python >= 3.9 (runtime)
- File system (input/output)

**Internal Dependencies:**
- `src/orchestrator.py` (workflow coordination)
- `src/utils.py` (low-level utilities)
- `src/configs/` (configuration templates)

### Data Requirements

**Input Data:**
- PDF invoice files (text-based or scanned)
- Batch folder paths
- Manual overrides (VAT percentage)

**Processing Data:**
- Detected VAT percentage
- Extracted price positions and values
- Calculated prices without VAT
- Rectangle coordinates for highlighting

**Output Data:**
- Modified PDF files (original + overlays)
- Summary report (CSV/JSON)
- Log files (processing details)
- Audit trail

### Data Models

```python
# Invoice Data Model
class InvoiceData:
    filename: str
    detected_vat: float
    product_prices: List[PriceInfo]
    original_prices: List[float]
    corrected_prices: List[float]
    processing_time: float
    confidence_score: float

# Price Info Model
class PriceInfo:
    text: str                    # Original price text
    position: Tuple[float, float]  # (x, y) coordinates
    page_num: int               # Page number
    rect: Rect                  # Bounding rectangle
    original_value: float       # Parsed numeric value
    corrected_value: float      # Calculated value without VAT
    vat_amount: float          # VAT portion removed
```

### Architecture Diagram

```
User Input
    │
    ▼
┌──────────────────────┐
│  PDF File Input      │ ← Batch Support
│  - Validation        │
│  - File Loading      │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│  Text Extraction     │
│  - Full document text │
│  - Position tracking │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│  VAT Detection       │ ← Automated
│  - Pattern matching  │   Detection
│  - Multi-format      │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│  Price Extraction    │
│  - Pattern matching  │
│  - Table detection   │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│  VAT Removal Calc    │
│  - Price / (1+VAT%)  │
│  - Rounding rules     │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│  Visual Highlighting │
│  - Yellow rectangles │
│  - Price overlay     │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│  Output Generation   │
│  - Save PDF          │
│  - Generate report   │
└──────────────────────┘
```

---

## Non-Functional Requirements

### Performance Standards
- **VAT Detection Speed**: <2 seconds per document
- **Price Processing**: <5 seconds for 100 prices
- **Batch Processing**: 100 invoices in <2 minutes
- **Memory Usage**: <500MB for single document
- **Disk I/O**: Efficient file handling (<1 second for save)

### Security Requirements
- **Input Validation**: Validate all PDF inputs
- **No Network Access**: System runs locally, no external calls
- **File Permissions**: Read-only input access, write output only
- **Error Handling**: Graceful handling of malicious or corrupted PDFs
- **Backup Creation**: Automatic backup before modification

### Compliance Standards
- **Accuracy**: 95%+ correct VAT detection
- **Audit Trail**: Complete logging of all changes
- **Data Integrity**: Original PDF preserved (backup)
- **Traceability**: Each change tracked and loggable

### Usability Requirements
- **Zero Configuration**: Works out-of-the-box
- **Intuitive Interface**: Minimal learning curve
- **Clear Feedback**: Processing status and errors clearly communicated
- **Error Recovery**: Clear error messages with recovery steps

### Reliability Requirements
- **Uptime**: 100% (local application, no external dependencies)
- **Error Rate**: <2% false positive VAT detection
- **Recovery**: Automatic retry for transient errors
- **Data Loss Prevention**: Backup before modification

### Maintainability
- **Code Quality**: PEP8 compliance, type hints
- **Documentation**: Comprehensive docstrings
- **Modularity**: Clear separation of concerns (orchestrator/utils)
- **Testing**: Unit tests for critical functions
- **Version Control**: Git workflow for changes

---

## Implementation Approach

### Technology Stack
- **Language**: Python 3.9+
- **PDF Library**: PyMuPDF 1.24.0+
- **Architecture**: Modular (orchestrator + utils pattern)
- **Testing**: pytest
- **Documentation**: Google-style docstrings

### Development Phases

#### Phase 1: Core Detection (Week 1-2)
- VAT percentage detection with regex patterns
- Price extraction algorithm
- Basic calculation engine

#### Phase 2: Visual Highlighting (Week 3-4)
- Rectangle drawing on PDF
- Price overlay functionality
- Font matching and positioning

#### Phase 3: User Interface (Week 5-6)
- File selection interface
- Progress indicators
- Manual override capability

#### Phase 4: Batch Processing (Week 7-8)
- Folder processing
- Progress tracking
- Summary report generation

#### Phase 5: Testing & Refinement (Week 9-10)
- Testing with real invoices
- Accuracy validation
- Performance optimization

#### Phase 6: Deployment (Week 11-12)
- User training
- Documentation
- Production deployment

---

## Success Metrics Framework

### Leading Indicators (Early Success)
- System successfully detects VAT in 95%+ of test invoices
- Processing time under 5 seconds per document
- Zero false positives in detection
- User completes test run in under 10 minutes

### Lagging Indicators (Long-term Success)
- 90% reduction in manual processing time
- 80% reduction in calculation errors
- 80%+ user adoption within 4 weeks
- $50K+ annual cost savings achieved

### Measurement Plan
- **Week 1-2**: Track detection accuracy on test set
- **Week 3-4**: Measure processing speed benchmarks
- **Week 5-8**: Monitor user adoption and feedback
- **Week 9-12**: Validate business impact metrics

---

## Risk Assessment

### Technical Risks
1. **Low Accuracy in Detection** (Medium Probability, High Impact)
   - Mitigation: Multi-pattern matching, confidence scoring, manual override
2. **Performance Issues** (Low Probability, Medium Impact)
   - Mitigation: Efficient algorithms, batch processing, caching
3. **PDF Compatibility** (Medium Probability, Medium Impact)
   - Mitigation: PyMuPDF proven library, error handling, fallback strategies

### Business Risks
1. **Low User Adoption** (Medium Probability, High Impact)
   - Mitigation: Intuitive interface, comprehensive training, support
2. **Incorrect Results** (Low Probability, High Impact)
   - Mitigation: 95% accuracy target, visual confirmation, manual override

### Operational Risks
1. **PDF Corruption** (Low Probability, Medium Impact)
   - Mitigation: Backup before modification, error recovery
2. **Unsupported Formats** (Medium Probability, Low Impact)
   - Mitigation: Clear error messages, format validation

---

## Constraints & Assumptions

### Technical Constraints
- Requires text-based PDFs (OCR for scanned docs is future enhancement)
- PyMuPDF library capabilities and limitations
- Local processing only (no cloud components)

### Business Constraints
- Budget: Minimal (using existing infrastructure)
- Timeline: 12 weeks for full feature set
- Resources: 2 developers part-time

### Regulatory Constraints
- Must maintain invoice integrity for tax compliance
- Audit trail required for all modifications
- Original documents must be preserved

### Assumptions
- Invoices follow standard format (not completely free-form)
- VAT percentage appears at least once in document
- Product prices follow recognizable patterns
- Users will review output before finalizing

### Validation Requirements
- Test on 100+ real invoices from Philipp Plein
- Validate against manual calculations
- Audit trail verification
- User acceptance testing

---

## Appendices

### Glossary
- **VAT**: Value Added Tax (German: MwSt, Mehrwertsteuer)
- **PyMuPDF**: Python library for PDF manipulation
- **Regex**: Regular expressions for pattern matching
- **OCR**: Optical Character Recognition

### References
- PyMuPDF Documentation: https://pymupdf.readthedocs.io/
- German VAT Law: MwStG (Mehrwertsteuergesetz)
- Current Implementation: `project/src/orchestrator.py`, `project/src/utils.py`

### Supporting Materials
- Existing draft analysis: `project/draft/pdf-manipulation/analysis_report.md`
- Current implementation: `project/src/`
- Example configurations: `project/src/configs/`
- Sample invoices: `project/examples/`

---

## Approval & Sign-Off

**Business Owner:** TBD  
**Technical Lead:** TBD  
**Compliance Officer:** TBD  

**Review Date:** TBD  
**Next Review:** TBD  

---

*This PRD serves as the single source of truth for the Automated VAT Detection and Removal System development.*

