from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import JWTError
from app.utils.security import decode_access_token
from app.database import users_collection
from app.models.user import UserInDB, TokenData
from bson import ObjectId
from typing import Optional

# HTTP Bearer token scheme
security = HTTPBearer()

async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security)
) -> UserInDB:
    """
    Dependency to get the current authenticated user from JWT token
    
    Args:
        credentials: HTTP Bearer token from Authorization header
    
    Returns:
        Current user object
    
    Raises:
        HTTPException: If token is invalid or user not found
    """
    token = credentials.credentials
    
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    try:
        payload = decode_access_token(token)
        user_id: str = payload.get("user_id")
        
        if user_id is None:
            raise credentials_exception
            
    except JWTError:
        raise credentials_exception
    
    # Fetch user from database
    user_doc = users_collection.find_one({"_id": ObjectId(user_id)})
    
    if user_doc is None:
        raise credentials_exception
    
    # Convert MongoDB document to UserInDB model
    user = UserInDB(
        id=str(user_doc["_id"]),
        name=user_doc["name"],
        email=user_doc["email"],
        role=user_doc["role"],
        hashed_password=user_doc["hashed_password"],
        created_at=user_doc["created_at"]
    )
    
    return user

def require_role(allowed_roles: list[str]):
    """
    Dependency factory to check if user has required role
    
    Args:
        allowed_roles: List of roles that are allowed access
    
    Returns:
        Dependency function that checks user role
    """
    async def role_checker(current_user: UserInDB = Depends(get_current_user)) -> UserInDB:
        if current_user.role not in allowed_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Access denied. Required roles: {', '.join(allowed_roles)}"
            )
        return current_user
    
    return role_checker

# Common role dependencies
require_admin = require_role(["admin"])
require_admin_or_manager = require_role(["admin", "manager"])
