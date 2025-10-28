"""
API routes for PP_VAT web application
"""

from fastapi import APIRouter, UploadFile, File, HTTPException, Depends, Form, Request
from fastapi.responses import FileResponse, HTMLResponse, RedirectResponse, JSONResponse
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pathlib import Path
import sys
import tempfile
import secrets
from datetime import datetime, timedelta
from typing import Optional
import hashlib

# Add parent directories to path for imports
PROJECT_ROOT = Path(__file__).parent.parent.parent.parent
sys.path.insert(0, str(PROJECT_ROOT))
sys.path.insert(0, str(Path(__file__).parent.parent))

from .auth import create_access_token, decode_access_token, verify_password
from .database import get_user, create_user, list_users
from .models import HealthResponse, UserInfo

# Initialize router
router = APIRouter()
security = HTTPBearer()

# In-memory session storage (use Redis in production)
sessions = {}

# Processed files storage with expiration
processed_files = {}


def get_current_user(token: str = Depends(security)) -> str:
    """
    Get current authenticated user from JWT token.
    
    Args:
        token: Bearer token
        
    Returns:
        str: Username
    """
    payload = decode_access_token(token.credentials)
    if not payload:
        raise HTTPException(
            status_code=401,
            detail="Invalid or expired token",
            headers={"WWW-Authenticate": "Bearer"}
        )
    return payload.get("sub")


@router.get("/", response_class=HTMLResponse)
async def index():
    """Serve the login page"""
    html_path = PROJECT_ROOT / "project" / "static" / "index.html"
    if html_path.exists():
        with open(html_path, 'r') as f:
            return f.read()
    return HTMLResponse(content="<h1>PP_VAT Login</h1><p>Login page - HTML file not found</p>")


@router.get("/health")
async def health_check():
    """Health check endpoint"""
    return HealthResponse(
        status="healthy",
        version="1.0.0",
        service="PP_VAT Processor"
    )


@router.post("/api/login")
async def login(request: Request, username: str = Form(...), password: str = Form(...)):
    """
    Login endpoint - authenticates user and creates session.
    
    Args:
        username: Username
        password: Password
        
    Returns:
        Redirect to /app on success
    """
    user = get_user(username)
    
    if not user or not verify_password(password, user["hashed_password"]):
        # Return error HTML instead of JSON for better UX
        error_html = """
        <html>
            <body>
                <h1>Login Failed</h1>
                <p>Incorrect username or password</p>
                <a href="/">Try again</a>
            </body>
        </html>
        """
        return HTMLResponse(content=error_html, status_code=401)
    
    # Create access token
    access_token = create_access_token(data={"sub": username})
    
    # Store session
    session_id = secrets.token_urlsafe(32)
    sessions[session_id] = {
        "username": username,
        "created_at": datetime.now(),
        "expires_at": datetime.now() + timedelta(minutes=30)
    }
    
    # Redirect to app with cookies set
    response = RedirectResponse(url="/app", status_code=303)
    response.set_cookie(
        key="session_id",
        value=session_id,
        httponly=True,
        secure=False,  # Set to True in production with HTTPS
        samesite="lax",
        max_age=1800  # 30 minutes
    )
    response.set_cookie(
        key="access_token",
        value=access_token,
        httponly=True,
        secure=False,
        samesite="lax",
        max_age=1800
    )
    return response


@router.get("/app", response_class=HTMLResponse)
async def app_page(request: Request):
    """
    Main application page (protected route).
    Requires valid session cookie.
    """
    # Check session from cookie
    session_id = request.cookies.get("session_id")
    
    if not session_id or session_id not in sessions:
        return RedirectResponse(url="/", status_code=303)
    
    # Check if session expired
    session = sessions.get(session_id)
    if session and datetime.now() > session.get("expires_at", datetime.now()):
        del sessions[session_id]
        return RedirectResponse(url="/", status_code=303)
    
    # Serve app HTML
    html_path = PROJECT_ROOT / "project" / "static" / "app.html"
    if html_path.exists():
        with open(html_path, 'r') as f:
            return f.read()
    return HTMLResponse(content="<h1>PP_VAT Application</h1><p>Application page - HTML file not found</p>")


@router.post("/api/logout")
async def logout():
    """Logout endpoint - clears session and redirects to login"""
    response = RedirectResponse(url="/", status_code=303)
    response.delete_cookie("session_id", path="/")
    response.delete_cookie("access_token", path="/")
    return response


@router.get("/api/me")
async def get_current_user_info(request: Request) -> UserInfo:
    """
    Get current user information.
    
    Returns:
        UserInfo: Current user data
    """
    session_id = request.cookies.get("session_id")
    if not session_id or session_id not in sessions:
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    username = sessions[session_id]["username"]
    user = get_user(username)
    
    return UserInfo(
        username=username,
        created_at=datetime.fromisoformat(user.get("created_at", datetime.now().isoformat()))
    )


@router.post("/api/process")
async def process_pdf(file: UploadFile = File(...), style: Optional[str] = Form("review")):
    """
    Process PDF invoice: detect VAT and remove from prices.
    
    Args:
        file: PDF file to process
        style: Output style - "review" (yellow) or "download" (white)
        
    Returns:
        JSON response with metadata and download URL
    """
    # Validate file type (case-insensitive)
    if not file.filename or not file.filename.lower().endswith('.pdf'):
        raise HTTPException(
            status_code=400,
            detail="Only PDF files are supported"
        )
    
    # Import processing logic
    # Add project/src to path for imports
    sys.path.insert(0, str(PROJECT_ROOT / "project" / "src"))
    
    try:
        # Import process_invoice from main.py
        from main import process_invoice
    except ImportError as e:
        raise HTTPException(
            status_code=500,
            detail=f"Processing module not found: {str(e)}"
        )
    
    # Create temporary input file
    with tempfile.NamedTemporaryFile(suffix='.pdf', delete=False) as tmp:
        content = await file.read()
        tmp.write(content)
        input_path = Path(tmp.name)
    
    try:
        # Validate style parameter
        if style not in ["review", "download"]:
            style = "review"
        
        # Process PDF with specified style
        result = process_invoice(input_path, "_corrected", style)
        
        if not result or not result.get('output_path') or not result['output_path'].exists():
            raise HTTPException(
                status_code=500,
                detail="Failed to process PDF. VAT may not be detected."
            )
        
        output_path = result['output_path']
        
        # Generate download token
        file_hash = hashlib.md5(file.filename.encode()).hexdigest()[:8]
        timestamp = datetime.now().strftime("%Y%m%d%H%M%S")
        download_token = f"{file_hash}_{timestamp}"
        
        # Store file info for download
        processed_files[download_token] = {
            "path": output_path,
            "original_filename": file.filename,
            "expires_at": datetime.now() + timedelta(hours=1)
        }
        
        # Return metadata with download link
        return JSONResponse(content={
            "status": "success",
            "detected_vat": result.get('detected_vat'),
            "country_code": result.get('country_code'),
            "country_name": result.get('country_name'),
            "prior_total_value": result.get('prior_total'),
            "corrected_total_value": result.get('corrected_total'),
            "prices_updated": result.get('prices_count', 0),
            "download_token": download_token,
            "download_url": f"/api/download/{download_token}"
        })
    
    except HTTPException:
        raise
    except Exception as e:
        # Cleanup on error
        if input_path.exists():
            input_path.unlink()
        raise HTTPException(
            status_code=500,
            detail=f"Processing error: {str(e)}"
        )


@router.get("/api/download/{token}")
async def download_processed_pdf(token: str):
    """
    Download processed PDF by token.
    
    Args:
        token: Download token
        
    Returns:
        FileResponse with processed PDF
    """
    if token not in processed_files:
        raise HTTPException(status_code=404, detail="File not found or expired")
    
    file_info = processed_files[token]
    
    # Check expiration
    if datetime.now() > file_info["expires_at"]:
        del processed_files[token]
        raise HTTPException(status_code=410, detail="Download link expired")
    
    # Return file
    return FileResponse(
        path=str(file_info["path"]),
        media_type='application/pdf',
        filename=f"{Path(file_info['original_filename']).stem}_corrected.pdf"
    )

