"""
Pydantic models for PP_VAT web application
"""

from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class ProcessingStatus(BaseModel):
    """Response model for PDF processing status"""
    status: str
    message: str
    detected_vat: Optional[float] = None
    prices_updated: Optional[int] = None
    output_filename: Optional[str] = None


class HealthResponse(BaseModel):
    """Response model for health check"""
    status: str
    version: str
    service: str = "PP_VAT Processor"


class UserLogin(BaseModel):
    """User login model"""
    username: str
    password: str


class UserInfo(BaseModel):
    """Current user information"""
    username: str
    created_at: Optional[datetime] = None

