/**
 * PP_VAT Web Application - Frontend JavaScript
 */

// DOM Elements
const uploadArea = document.getElementById('uploadArea');
const fileInput = document.getElementById('fileInput');
const uploadSection = document.getElementById('upload-section');
const processingSection = document.getElementById('processing-section');
const errorSection = document.getElementById('error-section');
const vatPercentage = document.getElementById('vatPercentage');
const pricesCount = document.getElementById('pricesCount');
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
        uploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadArea.style.borderColor = '#000';
        });

        uploadArea.addEventListener('dragleave', () => {
            uploadArea.style.borderColor = '#ddd';
        });

        uploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadArea.style.borderColor = '#ddd';
            if (e.dataTransfer.files.length > 0) {
                handleFile(e.dataTransfer.files[0]);
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

    // Reset previous values
    vatPercentage.textContent = '--';
    pricesCount.textContent = '--';

    // Create FormData
    const formData = new FormData();
    formData.append('file', file);

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
        
        // Update VAT display
        if (result.detected_vat !== null && result.detected_vat !== undefined) {
            vatPercentage.textContent = `${result.detected_vat}%`;
        }
        
        if (result.prices_updated !== null && result.prices_updated !== undefined) {
            pricesCount.textContent = result.prices_updated;
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

