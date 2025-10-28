# Web Application Migration Summary

**Created:** 2025-01-27  
**Status:** Planning Phase  
**Goal:** Migrate from PySide6 Desktop GUI to FastAPI Web Application  
**Target Platform:** Google Cloud Run

---

## Overview

This migration transforms PP_VAT from a desktop application (PySide6) into a modern web application (FastAPI + HTML/CSS/JS) deployable to Google Cloud, enabling:
- Cloud deployment
- API access
- Multi-device compatibility
- Scalable processing
- Zero-installation access

---

## Architecture Overview

### Before (Desktop App)
```
User → PySide6 GUI → PDF Processing Logic → Local File System
```

### After (Web App)
```
User Browser → HTML/CSS/JS Frontend → FastAPI Backend → PDF Processing Logic → Download
                      ↕                        ↕
              Cloud Deployment            Google Cloud Run
```

---

## Task Breakdown

### TASK-001: Add Web Framework Dependencies ⏱️ 5 min
**Impact:** High | **Priority:** P0

Add FastAPI, uvicorn, python-multipart to requirements.txt.

**Status:** Ready to start  
**Blocking:** None

---

### TASK-002: Create FastAPI Backend Application ⏱️ 2 hours  
**Impact:** High | **Priority:** P0

Build FastAPI application with file upload endpoint, integrate existing PDF processing logic.

**Key Files:**
- `project/src/web/app.py` - FastAPI application
- `project/src/web/routes.py` - API endpoints
- `project/src/web/models.py` - Pydantic models

**Endpoints:**
- `GET /` - Serve HTML frontend
- `GET /health` - Health check
- `POST /api/process` - Process PDF upload
- `GET /api/download/{token}` - Download processed PDF

**Status:** Ready after TASK-001  
**Dependencies:** TASK-001

---

### TASK-003: Create HTML Frontend Interface ⏱️ 4 hours
**Impact:** High | **Priority:** P0

Build HTML/CSS/JS frontend replicating desktop GUI functionality.

**Key Files:**
- `project/static/index.html` - Main page
- `project/static/css/style.css` - Monochrome styling
- `project/static/js/app.js` - Frontend logic

**Features:**
- Drag-and-drop file upload
- Split-screen PDF preview (Original | Corrected)
- VAT detection display
- Download functionality
- Responsive design

**Status:** Ready after TASK-002  
**Dependencies:** TASK-002

---

### TASK-গ-004: Integrate VAT Detection Display ⏱️ 1 hour
**Impact:** Medium | **Priority:** P1

Enhance API to return VAT detection metadata (percentage, prices updated) for frontend display.

**Key Changes:**
- Modify `process_invoice()` to return metadata
- Add token-based download system
- Update frontend to display VAT info

**Status:** Ready after TASK-002, TASK-003  
**Dependencies:** TASK-002, TASK-003

---

### TASK-005: Create Production Deployment Configuration ⏱️ 3 hours
**Impact:** High | **Priority:** P1

Create Docker-based deployment for Google Cloud Run.

**Key Files:**
- `Dockerfile` - Container definition
- `.dockerignore` - Build exclusions
- `cloud-run.yaml` - Cloud Run configuration
- `deploy.sh` - Deployment script

**Features:**
- Python 3.9 slim container
- System dependencies for PyMuPDF
- Health checks
- Resource limits
- Security best practices

**Status:** Ready after TASK-001 through TASK-004  
**Dependencies:** All previous tasks

---

### TASK-006: Testing and Quality Assurance ⏱️ 6 hours
**Impact:** High | **Priority:** P0

Comprehensive testing strategy for all components.

**Test Categories:**
1. **Unit Tests** - VAT detection, price extraction, calculations
2. **Integration Tests** - API endpoints, file processing
3. **E2E Tests** - Complete user workflows
4. **Performance Tests** - Concurrent requests, large files

**Target Coverage:** 80%+

**Status:** Ready after all tasks complete  
**Dependencies:** All previous tasks

---

## Timeline Estimate

| Task | Effort | Dependencies | Status |
|------|--------|--------------|--------|
| TASK-001 | 5 min | None | ⏳ Ready |
| TASK-002 | 2 hours | TASK-001 | ⏳ Ready |
| TASK-003 | 4 hours | TASK-002 | ⏳ Ready |
| TASK-004 | 1 hour | TASK-002, TASK-003 | ⏳ Ready |
| TASK-005 | 3 hours | TASK-001-004 | ⏳ Ready |
| TASK-006 | 6 hours | TASK-001-005 | ⏳ Ready |

**Total Estimated Effort:** ~16 hours  
**Critical Path:** TASK-001 → TASK-002 → TASK-003 → TASK-004 → TASK-005 → TASK-006

---

## Technology Stack

### Backend
- **FastAPI** - Modern Python web framework
- **Uvicorn** - ASGI server
- **PyMuPDF** - PDF processing (existing)
- **Pydantic** - Data validation
- **Python-multipart** - File upload support

### Frontend
- **HTML5** - Semantic markup
- **CSS3** - Monochrome design system
- **Vanilla JavaScript** - No framework dependencies
- **Fetch API** - HTTP requests
- **Blob API** - File handling

### Infrastructure
- **Docker** - Containerization
- **Google Cloud Run** - Serverless deployment
- **Python 3.9** - Runtime environment

---

## Key Design Decisions

### 1. Keep Existing PDF Processing Logic ✅
- Reuse `process_invoice()` from `src/main.py`
- No changes to core business logic
- Maintain proven VAT detection algorithms

### 2. Monochrome Minimalist Design ✅
- Follow project design system (black, white, gray)
- Clean, professional appearance
- Business-ready UI

### 3. Stateless API Design ✅
- Token-based file downloads
- No session management
- Scalable architecture

### 4. Vanilla JavaScript Frontend ✅
- No framework dependencies
- Smaller bundle size
- Faster load times

### 5. Docker-First Deployment ✅
- Portable containers
- Consistent environments
- Cloud-native design

---

## Migration Benefits

### For Users
- ✅ Access from any device
- ✅ No installation required
- ✅ Familiar web interface
- ✅ Automatic updates

### For Deployment
- ✅ Google Cloud Run scalability
- ✅ Serverless cost model ($0 - $50/month)
- ✅ Automatic scaling
- ✅ HTTPS by default

### For Development
- ✅ RESTful API for integrations
- ✅ Modern web development stack
- ✅ Container-based deployment
- ✅ CI/CD friendly

---

## Backward Compatibility

### Keeping Desktop GUI (Optional)
The PySide6 desktop application will remain in the codebase:
- File: `project/src/main_gui.py`
- Dependencies: PySide6 still in requirements.txt
- Purpose: Local offline use, legacy support

**Recommended:** Phase out desktop GUI after web app proves stable.

---

## Next Steps

1. **Review and Approve Tasks** - Review all TASK-XXX.md files
2. **Start with TASK-001** - Add dependencies to requirements.txt
3. **Sequential Execution** - Follow task dependencies
4. **Test After Each Task** - Verify functionality
5. **Deploy to Staging** - Test on Cloud Run
6. **Deploy to Production** - Launch web application

---

## Success Criteria

### Functional Requirements
- [ ] Users can upload PDF invoices via web interface
- [ ] VAT is detected automatically
- [ ] Corrected PDFs display in split-screen view
- [ ] Users can download processed PDFs
- [ ] All existing PDF processing logic works correctly

### Non-Functional Requirements
- [ ] Processing time < 10 seconds per PDF
- [ ] Application handles 10+ concurrent users
- [ ] 99.9% uptime on Cloud Run
- [ ] Zero critical security vulnerabilities
- [ ] Code coverage > 80%

### User Experience
- [ ] Intuitive drag-and-drop interface
- [ ] Clear VAT detection feedback
- [ ] Responsive on mobile devices
- [ ] Professional appearance
- [ ] Fast page load times (< 2 seconds)

---

## Documentation

All tasks include:
- ✅ Clear objectives
- ✅ Implementation details
- ✅ Code examples
- ✅ Acceptance criteria
- ✅ Testing instructions
- ✅ References

**Task Files Location:** `project/dev/tasks/`

---

## Questions or Issues?

- Review individual task files for details
- Check FastAPI documentation: https://fastapi.tiangolo.com/
- Reference cloud deployment guide: `project/docs/cloud_deployment_guide.md`
- Check existing code: `project/src/main.py`

---

**Ready to start? Begin with TASK-001!**

