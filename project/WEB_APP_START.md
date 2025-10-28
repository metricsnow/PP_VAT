# PP_VAT Web Application - Quick Start Guide

**Status:** Ready to Test  
**Date:** 2025-01-27

---

## What Was Implemented

✅ **Backend (FastAPI)**
- Web application structure in `project/src/web/`
- Authentication system with login/logout
- PDF processing API endpoint
- File upload/download with token-based security
- Session management

✅ **Frontend (HTML/CSS/JS)**
- Login page (`static/index.html`)
- Main application page (`static/app.html`) 
- Split-screen PDF preview
- Drag-and-drop file upload
- Download functionality
- Monochrome minimalist design

✅ **Dependencies**
- FastAPI + Uvicorn
- Authentication libraries (python-jose, passlib)
- All requirements updated in `requirements.txt`

---

## How to Run (In venv)

### 1. Activate Virtual Environment

```bash
cd /Users/marcus/PP/VAT
source venv/bin/activate
```

### 2. Install Dependencies

```bash
pip install -r requirements.txt
```

### 3. Start the Application

```bash
cd project/src
uvicorn web.app:app --reload --port 8000
```

### 4. Access in Browser

Open: **http://localhost:8000**

**Login Credentials:**
- Username: `admin`
- Password: `secret`

---

## User Flow

1. **Open** → http://localhost:8000
2. **Login** → Enter username/password
3. **Upload PDF** → Drag & drop or click to browse
4. **View Split-Screen** → Original (left) | Corrected (right)
5. **Download** → Click "Download Corrected PDF"
6. **Process Another** → Or logout to return to login

---

## File Structure

```
project/
├── src/web/                  ← FastAPI Backend
│   ├── __init__.py
│   ├── app.py               ← Main FastAPI app
│   ├── routes.py            ← API endpoints
│   ├── models.py            ← Pydantic models
│   ├── auth.py              ← Authentication logic
│   └── database.py          ← User storage
│
├── static/                   ← Frontend Files
│   ├── index.html           ← Login page
│   ├── app.html             ← Main app page
│   ├── css/
│   │   └── style.css        ← Styling
│   └── js/
│       └── app.js           ← Frontend logic
│
└── requirements.txt          ← Updated dependencies
```

---

## API Endpoints

- `GET /` - Login page
- `POST /api/login` - Authenticate user
- `GET /app` - Main application (protected)
- `POST /api/logout` - Logout
- `POST /api/process` - Process PDF (upload & detect VAT)
- `GET /api/download/{token}` - Download processed PDF
- `GET /api/me` - Current user info
- `GET /health` - Health check

---

## Features Implemented

✅ **Authentication**
- Secure login with bcrypt password hashing
- Session management with cookies
- Protected routes
- Auto-redirect for unauthenticated users

✅ **PDF Processing**
- File upload via drag-and-drop
- Automatic VAT detection
- Price extraction and correction
- Yellow rectangle highlighting

✅ **User Interface**
- Split-screen PDF preview
- VAT percentage display
- Prices updated counter
- Download button
- Process another invoice
- Logout button

✅ **Security**
- JWT tokens for API authentication
- HTTP-only cookies
- Token-based file downloads
- Session expiration (30 min)

---

## Next Steps (Remaining Tasks)

- **TASK-004**: Integrate VAT metadata extraction from processing
- **TASK-005**: Create Docker deployment configuration
- **TASK-006**: Comprehensive testing suite

---

## Troubleshooting

### Import Errors
```bash
# Ensure you're in venv
source venv/bin/activate

# Install missing packages
pip install -r requirements.txt
```

### Port Already in Use
```bash
# Use different port
uvicorn web.app:app --reload --port 8001
```

### PDF Processing Fails
- Check that PDF has VAT text (19%, 25%, etc.)
- Ensure PDF is text-based (not scanned)
- Check console logs for error details

---

## Testing

### Manual Testing
1. Login with admin/secret
2. Upload a sample PDF from `project/examples/`
3. Verify split-screen preview
4. Check VAT detection works
5. Download processed PDF
6. Logout and verify session cleared

### API Testing
```bash
# Health check
curl http://localhost:8000/health

# Login
curl -X POST http://localhost:8000/api/login \
  -d "username=admin&password=secret"

# Process PDF (after login)
curl -X POST http://localhost:8000/api/processام\
  -F "file=@project/examples/example_1.PDF"
```

---

**Ready to launch! 🚀**

