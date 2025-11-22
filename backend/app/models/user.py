from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime
from enum import Enum

class UserRole(str, Enum):
    """User role enumeration"""
    ADMIN = "admin"
    MANAGER = "manager"
    USER = "user"

class UserBase(BaseModel):
    """Base user schema with common fields"""
    name: str = Field(..., min_length=2, max_length=100)
    email: EmailStr
    role: UserRole = UserRole.USER

class UserCreate(UserBase):
    """Schema for creating a new user"""
    password: str = Field(..., min_length=6)

class UserLogin(BaseModel):
    """Schema for user login"""
    email: EmailStr
    password: str

class UserInDB(UserBase):
    """User schema as stored in database"""
    id: str
    hashed_password: str
    created_at: datetime
    
    class Config:
        json_schema_extra = {
            "example": {
                "id": "507f1f77bcf86cd799439011",
                "name": "John Doe",
                "email": "john@example.com",
                "role": "user",
                "created_at": "2025-01-20T10:30:00Z"
            }
        }

class UserResponse(UserBase):
    """Schema for user API responses (without password)"""
    id: str
    created_at: datetime
    
    class Config:
        json_schema_extra = {
            "example": {
                "id": "507f1f77bcf86cd799439011",
                "name": "John Doe",
                "email": "john@example.com",
                "role": "user",
                "created_at": "2025-01-20T10:30:00Z"
            }
        }

class UserUpdate(BaseModel):
    """Schema for updating user information"""
    name: Optional[str] = None
    role: Optional[UserRole] = None

class Token(BaseModel):
    """JWT token response schema"""
    access_token: str
    token_type: str = "bearer"
    user: UserResponse

class TokenData(BaseModel):
    """Data stored in JWT token"""
    user_id: str
    email: str
    role: str
