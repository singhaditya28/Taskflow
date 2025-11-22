from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime
from enum import Enum

class TaskStatus(str, Enum):
    """Task status enumeration"""
    TODO = "todo"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"

class TaskBase(BaseModel):
    """Base task schema with common fields"""
    title: str = Field(..., min_length=1, max_length=200)
    description: Optional[str] = None
    status: TaskStatus = TaskStatus.TODO
    due_date: Optional[datetime] = None

class TaskCreate(TaskBase):
    """Schema for creating a new task"""
    assigned_to: Optional[str] = None  # User ID

class TaskUpdate(BaseModel):
    """Schema for updating a task"""
    title: Optional[str] = Field(None, min_length=1, max_length=200)
    description: Optional[str] = None
    status: Optional[TaskStatus] = None
    due_date: Optional[datetime] = None
    assigned_to: Optional[str] = None

class TaskInDB(TaskBase):
    """Task schema as stored in database"""
    id: str
    assigned_to: Optional[str] = None
    created_by: str
    created_at: datetime
    updated_at: datetime
    
    class Config:
        json_schema_extra = {
            "example": {
                "id": "507f1f77bcf86cd799439011",
                "title": "Complete project documentation",
                "description": "Write comprehensive README and API docs",
                "status": "in_progress",
                "due_date": "2025-01-25T17:00:00Z",
                "assigned_to": "507f1f77bcf86cd799439012",
                "created_by": "507f1f77bcf86cd799439010",
                "created_at": "2025-01-20T10:30:00Z",
                "updated_at": "2025-01-20T14:15:00Z"
            }
        }

class TaskResponse(TaskBase):
    """Schema for task API responses"""
    id: str
    assigned_to: Optional[str] = None
    assigned_to_name: Optional[str] = None  # Populated from user lookup
    created_by: str
    created_by_name: Optional[str] = None  # Populated from user lookup
    created_at: datetime
    updated_at: datetime
    
    class Config:
        json_schema_extra = {
            "example": {
                "id": "507f1f77bcf86cd799439011",
                "title": "Complete project documentation",
                "description": "Write comprehensive README and API docs",
                "status": "in_progress",
                "due_date": "2025-01-25T17:00:00Z",
                "assigned_to": "507f1f77bcf86cd799439012",
                "assigned_to_name": "Jane Smith",
                "created_by": "507f1f77bcf86cd799439010",
                "created_by_name": "John Doe",
                "created_at": "2025-01-20T10:30:00Z",
                "updated_at": "2025-01-20T14:15:00Z"
            }
        }
