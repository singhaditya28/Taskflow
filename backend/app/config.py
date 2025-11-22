from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    # MongoDB
    mongodb_url: str = "mongodb://localhost:27017"
    database_name: str = "task_management"
    
    # JWT Settings
    secret_key: str = "your-secret-key-change-this-in-production"
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 60 * 24  # 24 hours
    
    # CORS - comma-separated string
    cors_origins: str = "http://localhost:5173,http://localhost:3000"
    
    class Config:
        env_file = ".env"

settings = Settings()

# Parse CORS origins into a list
def get_cors_origins():
    """Parse CORS origins from comma-separated string"""
    return [origin.strip() for origin in settings.cors_origins.split(',')]
