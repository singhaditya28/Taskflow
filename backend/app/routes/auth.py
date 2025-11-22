from fastapi import APIRouter, HTTPException, status
from app.models.user import UserCreate, UserLogin, Token, UserResponse
from app.database import users_collection
from app.utils.security import hash_password, verify_password, create_access_token
from datetime import datetime
from bson import ObjectId

router = APIRouter(prefix="/api/auth", tags=["Authentication"])

@router.post("/signup", response_model=Token, status_code=status.HTTP_201_CREATED)
async def signup(user_data: UserCreate):
    """
    Register a new user
    
    - Validates email uniqueness
    - Hashes password with bcrypt
    - Creates user in database
    - Returns JWT token
    """
    # Check if user already exists
    existing_user = users_collection.find_one({"email": user_data.email})
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Hash the password
    hashed_pwd = hash_password(user_data.password)
    
    # Create user document
    user_doc = {
        "name": user_data.name,
        "email": user_data.email,
        "role": user_data.role,
        "hashed_password": hashed_pwd,
        "created_at": datetime.utcnow()
    }
    
    # Insert into database
    result = users_collection.insert_one(user_doc)
    user_id = str(result.inserted_id)
    
    # Create access token
    token_data = {
        "user_id": user_id,
        "email": user_data.email,
        "role": user_data.role
    }
    access_token = create_access_token(token_data)
    
    # Prepare user response
    user_response = UserResponse(
        id=user_id,
        name=user_data.name,
        email=user_data.email,
        role=user_data.role,
        created_at=user_doc["created_at"]
    )
    
    return Token(
        access_token=access_token,
        user=user_response
    )

@router.post("/login", response_model=Token)
async def login(credentials: UserLogin):
    """
    Login with email and password
    
    - Validates credentials
    - Returns JWT token on success
    """
    # Find user by email
    user_doc = users_collection.find_one({"email": credentials.email})
    
    if not user_doc:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )
    
    # Verify password
    if not verify_password(credentials.password, user_doc["hashed_password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )
    
    # Create access token
    user_id = str(user_doc["_id"])
    token_data = {
        "user_id": user_id,
        "email": user_doc["email"],
        "role": user_doc["role"]
    }
    access_token = create_access_token(token_data)
    
    # Prepare user response
    user_response = UserResponse(
        id=user_id,
        name=user_doc["name"],
        email=user_doc["email"],
        role=user_doc["role"],
        created_at=user_doc["created_at"]
    )
    
    return Token(
        access_token=access_token,
        user=user_response
    )
