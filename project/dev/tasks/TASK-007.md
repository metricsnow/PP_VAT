# TASK-007: Implement User Authentication System

**Status:** Waiting  
**Impact:** High  
**Description:** Add secure login system for web application with session management  
**Date:** 2025-01-27  
**Estimated Effort:** 3 hours  
**Priority:** P0 - Critical for Production

---

## Objective

Implement secure user authentication so users must login before accessing the web application to upload and process invoices. This protects sensitive financial data.

## Context

You specified the requirement: "login and use the html to upload and download the invoices"

Current implementation has NO authentication - anyone with the URL can access it. This is a security risk for production.

## Required Features

### User Flow
```
1. User opens web address → Login page
2. User enters username/password → Authenticate
3. User sees main application → Upload/process invoices
4. User can logout → Return to login page
```

### Security Requirements
- Protected routes (require authentication)
- Session management
- Password hashing
- Secure logout
- Session expiration (optional)

## Implementation Tasks

### 1. Update requirements.txt

Add authentication dependencies:

```python
# Authentication
python-jose[cryptography]>=3.3.0  # JWT tokens
passlib[bcrypt]>=1.7.4  # Password hashing
python-multipart>=0.0.9  # Form data (already added)
```

### 2. Update Web Structure

Add authentication files:

```
project/src/web/
├── __init__.py
├── app.py
├── routes.py
├── models.py
├── auth.py           # NEW - Authentication logic
└── database.py       # NEW - User storage (simple for MVP)
```

### 3. Implement Auth Module (`auth.py`)

```python
from datetime import datetime, timedelta
from typing import Optional
from jose import JWTError, jwt
from passlib.context import CryptContext
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import os

# Security
SECRET_KEY = os.getenv("SECRET_KEY", "change-this-in-production")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
security = HTTPBearer()

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a password against hash"""
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password: str) -> str:
    """Hash a password"""
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    """Create JWT access token"""
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=30)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def decode_access_token(token: str):
    """Decode and validate JWT token"""
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except JWTError:
        return None
```

### 4. Create Simple User Database (`database.py`)

For MVP, use in-memory storage. For production, use PostgreSQL/MySQL.

```python
from datetime import datetime
from typing import Dict, Optional

# Simple in-memory user storage (replace with database in production)
users_db: Dict[str, dict] = {
    "admin": {
        "username": "admin",
        "hashed_password": "$2b$12$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW",  # "secret"
        "full_name": "Administrator",
        "created_at": datetime.now().isoformat()
    }
}

def get_user(username: str):
    """Get user from database"""
    return users_db.get(username)

def create_user(username: str, password: str):
    """Create new user"""
    from .auth import get_password_hash
    hashed = get_password_hash(password)
    users_db[username] = {
        "username": username,
        "hashed_password": hashed,
        "created_at": datetime.now().isoformat()
    }
```

### 5. Update Routes (`routes.py`)

Add login/logout endpoints and protect existing routes:

```python
from fastapi import APIRouter, Depends, HTTPException, Form
from fastapi.responses import HTMLResponse, RedirectResponse
from fastapi.security import HTTPBearer
from pydantic import BaseModel
from typing import Optional
from .auth import create_access_token, decode_access_token, get_password_hash, verify_password
from .database import get_user, create_user
import secrets

router = APIRouter()
security = HTTPBearer()

# In-memory session storage (use Redis in production)
sessions = {}

# Models
class LoginRequest(BaseModel):
    username: str
    password: str

# Protected dependency
async def get_current_user(token: str = Depends(security)):
    """Get current authenticated user"""
    payload = decode_access_token(token)
    if not payload:
        raise HTTPException(
            status_code=401,
            detail="Invalid or expired token",
            headers={"WWW-Authenticate": "Bearer"}
        )
    return payload.get("sub")

# Routes

@router.get("/", response_class=HTMLResponse)
async def index():
    """Serve login page"""
    html_path = Path(__file__).parent.parent.parent / "static" / "index.html"
    if html_path.exists():
        return open(html_path).read()
    return "<h1>PP_VAT Login</h1><p>Login page coming soon</p>"

@router.post("/api/login")
async def login(username: str = Form(...), password: str = Form(...)):
    """Login endpoint"""
    user = get_user(username)
    
    if not user or not verify_password(password, user["hashed_password"]):
        raise HTTPException(
            status_code=401,
            detail="Incorrect username or password"
        )
    
    # Create access token
    access_token = create_access_token(data={"sub": username})
    
    # Store session
    session_id = secrets.token_urlsafe(32)
    sessions[session_id] = {
        "username": username,
        "created_at": datetime.now()
    }
    
    response = RedirectResponse(url="/app", status_code=303)
    response.set_cookie(
        key="session_id",
        value=session_id,
        httponly=True,
        secure=True,  # HTTPS only in production
        samesite="lax",
        max_age=1800  # 30 minutes
    )
    response.set_cookie(
        key="access_token",
        value=access_token,
        httponly=True,
        secure=True,
        samesite="lax",
        max_age=1800
    )
    return response

@router.get("/app", response_class=HTMLResponse)
async def app_page(session_id: str = None):
    """Main application page (protected)"""
    # Check session
    if not session_id or session_id not in sessions:
        return RedirectResponse(url="/login", status_code=303)
    
    # Serve app HTML
    html_path = Path(__file__).parent.parent.parent / "static" / "app.html"
    if html_path.exists():
        return open(html_path).read()
    return "<h1>PP_VAT</h1><p>Application page</p>"

@router.post("/api/logout")
async def logout():
    """Logout endpoint"""
    response = RedirectResponse(url="/", status_code=303)
    response.delete_cookie("session_id")
    response.delete_cookie("access_token")
    return response

@router.get("/api/me")
async def get_current_user_info(current_user: str = Depends(get_current_user)):
    """Get current user info"""
    return {"username": current_user}
```

### 6. Update Frontend (`static/index.html`)

Add login form:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>PP_VAT - Login</title>
    <link rel="stylesheet" href="/static/css/style.css">
</head>
<body class="login-page">
    <header>
        <h1>PP_VAT</h1>
        <p>Automated VAT Detection & Removal</p>
    </header>

    <main class="login-container">
        <div class="login-box">
            <h2>Login</h2>
            <form id="loginForm">
                <div class="form-group">
                    <label for="username">Username</label>
                    <input 
                        type="text" 
                        id="username" 
                        name="username" 
                        required 
                        autocomplete="username"
                    >
                </div>
                <div class="form-group">
                    <label for="password">Password</label>
                    <input 
                        type="password" 
                        id="password" 
                        name="password" 
                        required 
                        autocomplete="current-password"
                    >
                </div>
                <button type="submit" class="btn-primary">Login</button>
            </form>
            <div id="errorMessage" class="error-message hidden"></div>
        </div>
    </main>

    <script>
        document.getElementById('loginForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            
            try {
                const response = await fetch('/api/login', {
                    method: 'POST',
                    body: formData
                });
                
                if (response.redirected) {
                    window.location.href = response.url;
                } else {
                    const error = await response.json();
                    document.getElementById('errorMessage').textContent = error.detail;
                    document.getElementById('errorMessage').classList.remove('hidden');
                }
            } catch (error) {
                document.getElementById('errorMessage').textContent = 'Login failed';
                document.getElementById('errorMessage').classList.remove('hidden');
            }
        });
    </script>
</body>
</html>
```

### 7. Create Application Page (`static/app.html`)

This is the main app with upload/download functionality (copy from TASK-003):

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>PP_VAT - Application</title>
    <link rel="stylesheet" href="/static/css/style.css">
</head>
<body>
    <header>
        <h1>PP_VAT</h1>
        <p>Automated VAT Detection & Removal</p>
        <nav>
            <button id="logoutBtn">Logout</button>
        </nav>
    </header>

    <main>
        <!-- Copy from TASK-003: Upload, Preview, Download functionality -->
        ...
    </main>

    <script>
        // Logout functionality
        document.getElementById('logoutBtn').addEventListener('click', async () => {
            await fetch('/api/logout', { method: 'POST' });
            window.location.href = '/';
        });

        // Rest of app.js from TASK-003
        ...
    </script>
</body>
</html>
```

## Dependencies

- TASK-001: Web framework dependencies
- TASK-002: FastAPI backend structure
- TASK-003: HTML frontend structure

## Acceptance Criteria

- [ ] User must login before accessing application
- [ ] Login form validates username/password
- [ ] Session stored securely (HTTP-only cookies)
- [ ] Protected routes redirect to login
- [ ] Logout functionality works
- [ ] Session expires after 30 minutes
- [ ] Error messages for invalid credentials
- [ ] Passwords are hashed (bcrypt)
- [ ] JWT tokens for API authentication

## Security Requirements

- **Password Hashing:** bcrypt with salt
- **Session Storage:** Secure HTTP-only cookies
- **HTTPS Only:** Secure flag enabled (in production)
- **CSRF Protection:** SameSite cookies
- **Token Expiration:** 30 minutes
- **Error Messages:** Don't reveal if username exists

## Default Credentials (Change in Production!)

```
Username: admin
Password: secret
```

⚠️ **WARNING:** Change default password in production!

## Testing

```bash
# Test login endpoint
curl -X POST "http://localhost:8000/api/login" \
  -d "username=admin&password=secret"

# Test protected route (without auth)
curl "http://localhost:8000/app"  # Should redirect to login

# Test protected route (with auth)
curl "http://localhost:8000/api/process" \
  -H "Cookie: session_id=XXX" \
  -F "file=@invoice.pdf"
```

## Notes

- For MVP, use in-memory storage for users
- In production, use PostgreSQL for user database
- Consider adding user registration if needed
- Add password reset functionality (future)
- Implement rate limiting for login attempts
- Add 2FA for enhanced security (future)

## Production Considerations

### Additional Security
- Rate limiting on login endpoint (prevent brute force)
- Account lockout after failed attempts
- Password complexity requirements
- Session invalidation on logout
- HTTPS enforcement
- Security headers (HSTS, CSP, etc.)

### Database Migration
Replace in-memory storage with database:

```python
# Use SQLAlchemy or similar
from sqlalchemy import create_engine, Column, String
from sqlalchemy.orm import sessionmaker

class User(Base):
    __tablename__ = 'users'
    username = Column(String, primary_key=True)
    hashed_password = Column(String)
    created_at = Column(DateTime)
```

## References

- FastAPI Security: https://fastapi.tiangolo.com/tutorial/security/
- Python-jose: https://python-jose.readthedocs.io/
- Passlib: https://passlib.readthedocs.io/

