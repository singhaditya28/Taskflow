from fastapi import APIRouter, HTTPException, status, Depends, Query
from app.models.user import UserResponse, UserUpdate, UserInDB
from app.database import users_collection
from app.middleware.auth import get_current_user, require_admin
from bson import ObjectId
from typing import List

router = APIRouter(prefix="/api/users", tags=["Users"])

@router.get("/me", response_model=UserResponse)
async def get_current_user_info(current_user: UserInDB = Depends(get_current_user)):
    """Get current user's information"""
    return UserResponse(
        id=current_user.id,
        name=current_user.name,
        email=current_user.email,
        role=current_user.role,
        created_at=current_user.created_at
    )

@router.get("", response_model=List[UserResponse])
async def get_users(
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    current_user: UserInDB = Depends(require_admin)
):
    """
    Get all users (Admin only)
    
    - Supports pagination with skip and limit
    - Returns list of users without passwords
    """
    users = []
    cursor = users_collection.find().skip(skip).limit(limit)
    
    for user_doc in cursor:
        users.append(UserResponse(
            id=str(user_doc["_id"]),
            name=user_doc["name"],
            email=user_doc["email"],
            role=user_doc["role"],
            created_at=user_doc["created_at"]
        ))
    
    return users

@router.get("/{user_id}", response_model=UserResponse)
async def get_user(
    user_id: str,
    current_user: UserInDB = Depends(require_admin)
):
    """Get specific user by ID (Admin only)"""
    try:
        user_doc = users_collection.find_one({"_id": ObjectId(user_id)})
    except:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid user ID format"
        )
    
    if not user_doc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    return UserResponse(
        id=str(user_doc["_id"]),
        name=user_doc["name"],
        email=user_doc["email"],
        role=user_doc["role"],
        created_at=user_doc["created_at"]
    )

@router.put("/{user_id}", response_model=UserResponse)
async def update_user(
    user_id: str,
    user_update: UserUpdate,
    current_user: UserInDB = Depends(require_admin)
):
    """
    Update user information (Admin only)
    
    - Can update name and role
    - Cannot update email or password through this endpoint
    """
    try:
        obj_id = ObjectId(user_id)
    except:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid user ID format"
        )
    
    # Build update document
    update_data = {}
    if user_update.name is not None:
        update_data["name"] = user_update.name
    if user_update.role is not None:
        update_data["role"] = user_update.role
    
    if not update_data:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No fields to update"
        )
    
    # Update user
    result = users_collection.find_one_and_update(
        {"_id": obj_id},
        {"$set": update_data},
        return_document=True
    )
    
    if not result:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    return UserResponse(
        id=str(result["_id"]),
        name=result["name"],
        email=result["email"],
        role=result["role"],
        created_at=result["created_at"]
    )

@router.delete("/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_user(
    user_id: str,
    current_user: UserInDB = Depends(require_admin)
):
    """Delete a user (Admin only)"""
    try:
        obj_id = ObjectId(user_id)
    except:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid user ID format"
        )
    
    # Prevent admin from deleting themselves
    if user_id == current_user.id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot delete your own account"
        )
    
    result = users_collection.delete_one({"_id": obj_id})
    
    if result.deleted_count == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    return None
