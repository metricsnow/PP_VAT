# PP_VAT Production Dockerfile
# Automated VAT Detection & Removal System

FROM python:3.9-slim

# Set working directory
WORKDIR /app

# Install system dependencies for PyMuPDF in a single RUN instruction
# Combining apt-get update, install, and cleanup minimizes image layers
RUN apt-get update && apt-get install -y --no-install-recommends \
    libmupdf-dev \
    fonts-liberation \
    && rm -rf /var/lib/apt/lists/*

# Set environment variables
ENV PYTHONPATH=/app \
    PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    PIP_NO_CACHE_DIR=1 \
    PIP_DISABLE_PIP_VERSION_CHECK=1

# Copy requirements first for better Docker layer caching
COPY requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY project/ /app/project/

# Expose port (Cloud Run uses PORT env variable)
EXPOSE 8080

# Health check using HTTP endpoint (Cloud Run compatible)
# Cloud Run uses /health endpoint for service health monitoring
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD python -c "import urllib.request; urllib.request.urlopen('http://localhost:8080/health')"

# Run application
# Use exec form for proper signal handling in containers
# Cloud Run provides PORT environment variable automatically
CMD ["sh", "-c", "exec uvicorn project.src.web.app:app --host 0.0.0.0 --port ${PORT:-8080} --workers 1"]

