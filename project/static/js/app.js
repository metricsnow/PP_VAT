/**
 * PP_VAT Web Application - Frontend JavaScript
 */

// DOM Elements
const uploadArea = document.getElementById('uploadArea');
const fileInput = document.getElementById('fileInput');
const uploadSection = document.getElementById('upload-section');
const processingSection = document.getElementById('processing-section');
const errorSection = document.getElementById('error-section');
const originalPdf = document.getElementById('originalPdf');
const correctedPdf = document.getElementById('correctedPdf');
const downloadBtn = document.getElementById('downloadBtn');
const processAnotherBtn = document.getElementById('processAnotherBtn');
const tryAgainBtn = document.getElementById('tryAgainBtn');
const logoutBtn = document.getElementById('logoutBtn');
const userInfo = document.getElementById('userInfo');

// Global state
let processedPdfBlob = null;
let processedPdfName = '';

// Helper function to format numbers with thousands separator and decimal comma
function formatNumber(num) {
    if (num === null || num === undefined) return '--';
    
    // Convert to number if it's a string
    const value = typeof num === 'string' ? parseFloat(num) : num;
    
    // Format with 2 decimal places
    const parts = value.toFixed(2).split('.');
    
    // Add thousands separator (dot) in European format
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    
    // Return with comma as decimal separator
    return parts.join(',');
}

// Initialize
document.addEventListener('DOMContentLoaded', async () => {
    // Load user info
    loadUserInfo();
    
    // Setup event listeners
    setupEventListeners();
});

// Load user info
async function loadUserInfo() {
    try {
        const response = await fetch('/api/me');
        if (response.ok) {
            const data = await response.json();
            userInfo.textContent = `Welcome, ${data.username}`;
        }
    } catch (error) {
        console.error('Failed to load user info:', error);
    }
}

// Setup event listeners
function setupEventListeners() {
    // Upload area click handler
    if (uploadArea) {
        uploadArea.addEventListener('click', () => {
            fileInput.click();
        });
    }

    // File input change handler
    if (fileInput) {
        fileInput.addEventListener('change', (e) => {
            if (e.target.files.length > 0) {
                handleFile(e.target.files[0]);
            }
        });
    }

    // Drag and drop handlers
    if (uploadArea) {
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            uploadArea.addEventListener(eventName, (e) => {
                e.preventDefault();
                e.stopPropagation();
            }, false);
        });

        uploadArea.addEventListener('dragenter', (e) => {
            uploadArea.style.borderColor = '#000';
            uploadArea.style.backgroundColor = '#F8F8F8';
        });

        uploadArea.addEventListener('dragleave', (e) => {
            uploadArea.style.borderColor = '#ddd';
            uploadArea.style.backgroundColor = '';
        });

        uploadArea.addEventListener('drop', (e) => {
            uploadArea.style.borderColor = '#ddd';
            uploadArea.style.backgroundColor = '';
            
            const dt = e.dataTransfer;
            const files = dt.files;

            if (files && files.length > 0) {
                handleFile(files[0]);
            }
        });
    }

    // Download button
    if (downloadBtn) {
        downloadBtn.addEventListener('click', downloadProcessedPdf);
    }

    // Process another button
    if (processAnotherBtn) {
        processAnotherBtn.addEventListener('click', processAnother);
    }

    // Try again button
    if (tryAgainBtn) {
        tryAgainBtn.addEventListener('click', tryAgain);
    }

    // Logout button
    if (logoutBtn) {
        logoutBtn.addEventListener('click', async () => {
            await fetch('/api/logout', { method: 'POST' });
            window.location.href = '/';
        });
    }
}

// Handle file upload
async function handleFile(file) {
    // Validate file type (case-insensitive)
    if (!file.name.toLowerCase().endsWith('.pdf')) {
        showError('Only PDF files are supported');
        return;
    }

    // Show processing UI
    uploadSection.classList.add('hidden');
    processingSection.classList.remove('hidden');
    errorSection.classList.add('hidden');

    // Create FormData
    const formData = new FormData();
    formData.append('file', file);
    formData.append('style', 'download');  // Default to download style (white highlights)

    try {
        // Upload and process
        const response = await fetch('/api/process', {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.detail || 'Processing failed');
        }

        const result = await response.json();
        
        // Update Document Analysis display
        const vatPercentageEl = document.getElementById('vatPercentage');
        const countryCodeEl = document.getElementById('countryCode');
        const priorTotalValueEl = document.getElementById('priorTotalValue');
        const correctedTotalValueEl = document.getElementById('correctedTotalValue');
        const calculationDetailsEl = document.getElementById('calculationDetails');
        
        // Update VAT
        if (result.detected_vat !== null && result.detected_vat !== undefined) {
            vatPercentageEl.textContent = `${result.detected_vat}%`;
        } else {
            vatPercentageEl.textContent = '--';
        }
        
        // Update Country
        if (result.country_name) {
            countryCodeEl.textContent = `${result.country_name} (${result.country_code})`;
        } else if (result.country_code) {
            countryCodeEl.textContent = result.country_code;
        } else {
            countryCodeEl.textContent = '--';
        }
        
        // Update Prior Total Value
        if (result.prior_total_value) {
            priorTotalValueEl.textContent = formatNumber(result.prior_total_value);
        } else {
            priorTotalValueEl.textContent = '--';
        }
        
        // Update Corrected Total Value
        if (result.corrected_total_value) {
            correctedTotalValueEl.textContent = formatNumber(result.corrected_total_value);
        } else {
            correctedTotalValueEl.textContent = '--';
        }
        
        // Update Calculation Details
        if (result.detected_vat && result.prior_total_value && result.corrected_total_value) {
            const priorFormatted = formatNumber(result.prior_total_value);
            const correctedFormatted = formatNumber(result.corrected_total_value);
            calculationDetailsEl.textContent = `Calculation applied: ${priorFormatted} - ((${priorFormatted.replace(',', '.')} / (100+${result.detected_vat})) * 100) = ${correctedFormatted}`;
        } else {
            calculationDetailsEl.textContent = '';
        }

        // Download the processed PDF
        const pdfResponse = await fetch(result.download_url);
        if (!pdfResponse.ok) {
            throw new Error('Failed to download processed PDF');
        }

        processedPdfBlob = await pdfResponse.blob();
        processedPdfName = file.name.replace('.pdf', '_corrected.pdf');

        // Create URLs for iframe preview
        const originalUrl = URL.createObjectURL(file);
        const correctedUrl = URL.createObjectURL(processedPdfBlob);

        // Update iframes
        originalPdf.src = originalUrl;
        correctedPdf.src = correctedUrl;

    } catch (error) {
        console.error('Processing error:', error);
        showError(error.message);
    }
}

// Download processed PDF
function downloadProcessedPdf() {
    if (processedPdfBlob) {
        const url = URL.createObjectURL(processedPdfBlob);
        const a = document.createElement('a');
        a.href = url;
        a.download = processedPdfName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
}

// Process another invoice
function processAnother() {
    // Reset UI
    processingSection.classList.add('hidden');
    uploadSection.classList.remove('hidden');
    processedPdfBlob = null;
    processedPdfName = '';
    
    // Clear file input
    fileInput.value = '';
    
    // Clear iframes
    originalPdf.src = '';
    correctedPdf.src = '';
}

// Try again after error
function tryAgain() {
    errorSection.classList.add('hidden');
    uploadSection.classList.remove('hidden');
}

// Show error message
function showError(message) {
    errorSection.classList.remove('hidden');
    processingSection.classList.add('hidden');
    document.getElementById('errorMessage').textContent = message;
}