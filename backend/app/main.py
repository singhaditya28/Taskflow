from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings, get_cors_origins
from app.database import init_db
from app.routes import auth, users, tasks

# Create FastAPI app
app = FastAPI(
    title="Task Management API",
    description="Role-based task management system with JWT authentication",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=get_cors_origins(),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router)
app.include_router(users.router)
app.include_router(tasks.router)

@app.on_event("startup")
async def startup_event():
    """Initialize database on startup"""
    init_db()
    print("🚀 Application started successfully")

@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "Task Management API",
        "version": "1.0.0",
        "docs": "/docs"
    }

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy"}
