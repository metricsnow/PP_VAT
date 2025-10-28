# TASK-001: Add Web Framework Dependencies to Requirements

**Status:** Waiting  
**Impact:** High  
**Description:** Add FastAPI and related web dependencies to requirements.txt  
**Date:** 2025-01-27  
**Estimated Effort:** 5 minutes  
**Priority:** P0 - Blocking

---

## Objective

Extend the requirements.txt to include web framework dependencies for the HTML web application, replacing the desktop GUI with a modern web interface.

## Context

The current application uses PySide6 for desktop GUI. We're migrating to a web-based solution using FastAPI for backend and vanilla HTML/CSS/JS for frontend to enable cloud deployment.

## Current State

`requirements.txt` contains:
- pymupdf>=1.24.0 (PDF manipulation)
- PySide6>=6.6.0 (desktop GUI - to be kept for now)
- Other data processing libraries

## Required Changes

### Update `requirements.txt`

Add the following dependencies:

```
# Web Framework
fastapi>=0.115.0
uvicorn[standard]>=0.32.0
python-multipart>=0.0.9  # Required for file uploads
jinja2>=3.1.4  # HTML templating
python-jose[cryptography]>=3.3.0  # For JWT tokens (future use)
passlib[bcrypt]>=1.7.4  # Password hashing (future use)

# Optional: Production server
gunicorn>=24.0  # For production deployment
```

## Tasks

1. [ ] Update `requirements.txt` with new dependencies
2. [ ] Keep PySide6 for now (backward compatibility)
3. [ ] Add comments to group dependencies by purpose
4. [ ] Verify version compatibility with Python 3.9+

## Acceptance Criteria

- [ ] FastAPI and uvicorn added to requirements
- [ ] python-multipart included for file uploads
- [ ] Version pins follow project conventions (>=X.Y.Z)
- [ ] Requirements file is well-organized with comments
- [ ] Can install dependencies without conflicts

## Dependencies

None - this is the foundation task.

## Notes

- Keep PySide6 in requirements.txt initially for backward compatibility
- python-multipart is REQUIRED for FastAPI file uploads
- Use uvicorn[standard] for better performance
- Consider adding toml or pyproject.toml in the future for better dependency management

## References

- FastAPI docs: https://fastapi.tiangolo.com/
- Project Structure: `project/src/`
- Current requirements: `requirements.txt`

