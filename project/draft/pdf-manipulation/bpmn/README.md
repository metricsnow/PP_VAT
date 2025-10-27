# PDF Invoice Updater - BPMN Process

## Overview

This directory contains the BPMN process diagram for the PDF Invoice Updater tool.

## Process Information

- **Process ID:** `pdf-invoice-updater`
- **Process Type:** Atomic (single executable process)
- **Version:** 1.0.0
- **Framework:** Approach 3 - Overlay Updates

## Process Description

The PDF Invoice Updater process overlays text updates on PDF invoices with yellow highlighting to indicate changed values.

## Process Flow

1. **Start Event**: Begin PDF update process
2. **Initialize**: Load configuration (PDF path, updates, output suffix)
3. **Load PDF**: Open PDF document using PyMuPDF
4. **Validate PDF**: Check if PDF loaded successfully
5. **For Each Update** (Sub-process):
   - Find text positions in PDF
   - Cover old text with yellow rectangle
   - Overlay new text
   - Check for more positions
6. **Save PDF**: Save updated PDF with suffix
7. **End Event**: Return updated PDF path

## Key Features

- **Atomic Process**: Complete executable process
- **Overlay Method**: Uses PyMuPDF to overlay text on existing PDF
- **Visual Highlighting**: Yellow boxes indicate changed values
- **Precise Positioning**: Uses baseline positioning for accurate text alignment

## Usage

```javascript
import PDFInvoiceUpdaterProcess from './pdf-invoice-updater.js';

const context = {
  pdf_path: 'invoice.pdf',
  updates: [
    {
      search: '100.00',
      replace: '120.00',
      font_size: 11
    }
  ],
  output_suffix: '_updated'
};

const result = await PDFInvoiceUpdaterProcess.execute(context);
console.log(result.updated_pdf_path);
```

## Process Elements

- **Start Event**: Initiates process
- **Script Task**: Initialize updater with configuration
- **Service Task**: Load PDF document
- **Exclusive Gateway**: Validate PDF loaded successfully
- **Sub-Process**: Loop through each update
- **Service Task**: Save updated PDF
- **End Event**: Process complete

## Error Handling

- **Error Event**: PDF load failure
- **Conditional Flows**: Branch based on validation results

## Data Objects

- **Input**: pdf_path, updates, output_suffix
- **Internal**: document, positions
- **Output**: updated_pdf_path

## Technical Details

- **Library**: PyMuPDF (pymupdf)
- **Font Handling**: Supports custom font sizes
- **Color Overlay**: RGB (1, 1, 0.85) for yellow highlighting
- **Text Positioning**: Baseline-based alignment

## BPMN Compliance

This process follows BPMN 2.0 standards and represents an atomic (executable) process that can be deployed to a BPMN engine.

