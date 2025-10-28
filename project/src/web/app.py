"""
Main FastAPI application for PP_VAT web service
"""

from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from pathlib import Path
import os

# Import routes
from . import routes

# Initialize FastAPI app
app = FastAPI(
    title="PP_VAT - Automated VAT Detection & Removal",
    description="Web application for automated VAT detection and price correction",
    version="1.0.0"
)

# CORS middleware for development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify allowed origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include router
app.include_router(routes.router)

# Mount static files (CSS, JS)
static_dir = Path(__file__).parent.parent.parent.parent / "project" / "static"
if static_dir.exists():
    app.mount("/static", StaticFiles(directory=str(static_dir)), name="static")


@app.on_event("startup")
async def startup_event():
    """Startup event handler"""
    print("PP_VAT Web Application Starting...")
    print(f"Environment: {os.getenv('ENVIRONMENT', 'development')}")
    print("Ready to process invoices!")


@app.on_event("shutdown")
async def shutdown_event():
    """Shutdown event handler"""
    print("PP_VAT Web Application Shutting Down...")

