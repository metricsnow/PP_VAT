# TASK-005: Create Production-Ready Deployment Configuration

**Status:** Waiting  
**Impact:** High  
**Description:** Configure application for Google Cloud deployment with Docker and production settings  
**Date:** 2025-01-27  
**Estimated Effort:** 3 hours  
**Priority:** P1 - Important

---

## Objective

Create Docker-based deployment configuration for Google Cloud Run with production-ready settings, environment management, and security best practices.

## Context

The application needs to be containerized and configured for cloud deployment. Google Cloud Run is the target platform based on the earlier analysis in `cloud_deployment_guide.md`.

## Required Files

Create deployment configuration files:

```
project/
├── Dockerfile                    # Docker container definition
├── .dockerignore                 # Files to exclude from Docker build
├── docker-compose.yml            # Local development setup (optional)
├── .env.example                  # Environment variables template
└── cloud-run.yaml                # Cloud Run service configuration
```

## Implementation Tasks

### 1. Create Dockerfile

```dockerfile
FROM python:3.9-slim

# Set working directory
WORKDIR /app

# Install system dependencies for PyMuPDF
RUN apt-get update && apt-get install -y \
    libmupdf-dev \
    fonts-liberation \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements
COPY requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY project/ /app/project/
COPY docs/ /app/docs/
COPY static/ /app/static/

# Set environment variables
ENV PYTHONPATH=/app
ENV PYTHONUNBUFFERED=1

# Expose port (Cloud Run uses PORT env variable)
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD python -c "import requests; requests.get('http://localhost:8080/health')"

# Run application
CMD exec uvicorn project.src.web.app:app --host 0.0.0.0 --port ${PORT:-8080} --workers 1
```

### 2. Create .dockerignore

```dockerignore
# Git
.git
.gitignore

# Python
__pycache__
*.pyc
*.pyo
*.pyd
.Python
*.so
*.egg
*.egg-info
dist/
build/

# Virtual environments
venv/
env/
ENV/

# IDE
.vscode/
.idea/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# Project specific
project/examples/
project/draft/
*.pdf

# Documentation
README.md
*.md

# Tests
test/
tests/
*.test.py
```

### 3. Create .env.example

```bash
# Application Settings
APP_NAME=PP_VAT
APP_VERSION=1.0.0
ENVIRONMENT=development

# Server Settings
PORT=8080
HOST=0.0.0.0
DEBUG=false

# Security (for production)
SECRET_KEY=change-this-in-production
ALLOWED_ORIGINS=http://localhost:8000,http://localhost:8080

# File Processing
MAX_FILE_SIZE_MB=50
TEMP_DIR=/tmp
CLEANUP_INTERVAL_HOURS=1

# Google Cloud (for deployment)
GCP_PROJECT_ID=your-project-id
GCP_REGION=us-central1
GCP_SERVICE_NAME=pp-vat-processor
```

### 4. Create docker-compose.yml (Optional, for local testing)

```yaml
version: '3.8'

services:
  pp-vat:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - "8080:8080"
    environment:
      - PORT=8080
      - DEBUG=true
    volumes:
      - ./static:/app/static:ro
      - ./project:/app/project:ro
    healthcheck:
      test: ["CMD", "curl", "-f", "diq://localhost:8080/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 10s
```

### 5. Create cloud-run.yaml (Google Cloud Run config)

```yaml
apiVersion: serving.knative.dev/v1
kind: Service
metadata:
  name: pp-vat-processor
  annotations:
    run.googleapis.com/ingress: all
    run.googleapis.com/execution-environment: gen2
spec:
  template:
    metadata:
      annotations:
        autoscaling.knative.dev/minScale: "0"
        autoscaling.knative.dev/maxScale: "10"
        run.googleapis.com/cpu-throttling: "true"
        run.googleapis.com/memory: "2Gi"
        run.googleapis.com/cpu: "2"
        run.googleapis.com/timeout: "300s"
    spec:
      containerConcurrency: 10
      containers:
      - image: gcr.io/PROJECT_ID/pp-vat:latest
        ports:
        - name: http1
          containerPort: 8080
        env:
        - name: PORT
          value: "8080"
        - name: ENVIRONMENT
          value: "production"
        resources:
          limits:
            cpu: "2"
            memory: 2Gi
        livenessProbe:
          httpGet:
            path: /health
            port: 8080
          initialDelaySeconds: 10
          timeoutSeconds: 5
          periodSeconds: 30
        readinessProbe:
          httpGet:
            path: /health
            port: 8080
          initialDelaySeconds: 5
          timeoutSeconds: 5
          periodSeconds: 10
```

## Deployment Scripts

### 6. Create deploy.sh

```bash
#!/bin/bash

# Google Cloud deployment script for PP_VAT

set -e

# Configuration
PROJECT_ID="your-project-id"
REGION="us-central1"
SERVICE_NAME="pp-vat-processor"
IMAGE_NAME="gcr.io/${PROJECT_ID}/${SERVICE_NAME}"

echo "Building Docker image..."
docker build -t ${IMAGE_NAME}:latest .

echo "Pushing to Google Container Registry..."
docker push ${IMAGE_NAME}:latest

echo "Deploying to Cloud Run..."
gcloud run deploy ${SERVICE_NAME} \
  --image ${IMAGE_NAME}:latest \
  --platform managed \
  --region ${REGION} \
  --allow-unauthenticated \
  --memory 2Gi \
  --cpu 2 \
  --timeout 300s \
  --max-instances 10 \
  --min-instances 0 \
  --concurrency 10

echo "Deployment complete!"
echo "Get service URL:"
gcloud run services describe ${SERVICE_NAME} --region ${REGION} --format="value(status.url)"
```

### 7. Create local-test.sh

```bash
#!/bin/bash

# Local testing script

echo "Building Docker image..."
docker build -t pp-vat:local .

echo "Running container..."
docker run -p 8080:8080 \
  -e PORT=8080 \
  -e DEBUG=true \
  pp-vat:local

echo "Access the application at http://localhost:8080"
```

## Dependencies

- TASK-001: FastAPI dependencies installed
- TASK-002: FastAPI backend implemented
- Docker installed locally
- Google Cloud SDK installed (for deployment)

## Acceptance Criteria

- [ ] Dockerfile builds successfully
- [ ] Application runs in Docker container
- [ ] Health check endpoint works in container
- [ ] Static files are served correctly
- [ ] Environment variables are configurable
- [ ] .dockerignore prevents unnecessary files in image
- [ ] Deployment script works on Google Cloud
- [ ] Container is optimized (small image size)
- [ ] Security best practices followed

## Testing

```bash
# Build image
docker build -t pp-vat:test .

# Run locally
docker run -p 8080:8080 pp-vat:test

# Test health endpoint
curl http://localhost:8080/health

# Test file upload
curl -X POST "http://localhost:8080/api/process" \
  -F "file=@example_1.PDF"

# Check image size
docker images pp-vat:test
```

## Notes

- Use Python slim image to reduce size
- Install only necessary system packages
- Use multi-stage builds if size is critical
- Add health checks for production
- Configure resource limits appropriately
- Use secrets manager for sensitive data in production

## Security Considerations

1. **Non-root user**: Run container as non-root user
2. **Secrets**: Don't commit secrets to image
3. **Dependencies**: Keep dependencies up-to-date
4. **Input validation**: Validate all inputs
5. **File uploads**: Limit file sizes
6. **Rate limiting**: Implement rate limiting

## Production Checklist

- [ ] Use HTTPS only
- [ ] Enable authentication (OAuth2, API keys)
- [ ] Set up monitoring and logging
- [ ] Configure CORS properly
- [ ] Enable Cloud Armor for DDoS protection
- [ ] Set up backup and disaster recovery
- [ ] Configure custom domain
- [ ] Enable Cloud CDN for static files

## References

- Google Cloud Run docs: https://cloud.google.com/run/docs
- Docker best practices: https://docs.docker.com/develop/dev-best-practices/
- FastAPI deployment: https://fastapi.tiangolo.com/deployment/
- Project structure: `project/src/`

