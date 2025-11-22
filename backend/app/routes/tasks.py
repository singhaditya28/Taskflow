from fastapi import APIRouter, HTTPException, status, Depends, Query
from app.models.task import TaskCreate, TaskUpdate, TaskResponse, TaskStatus
from app.models.user import UserInDB
from app.database import tasks_collection, users_collection
from app.middleware.auth import get_current_user, require_admin
from app.utils.permissions import can_view_task, can_edit_task, can_delete_task, can_assign_task
from datetime import datetime
from bson import ObjectId
from typing import List, Optional

router = APIRouter(prefix="/api/tasks", tags=["Tasks"])

def get_user_name(user_id: Optional[str]) -> Optional[str]:
    """Helper function to get user name from ID"""
    if not user_id:
        return None
    try:
        user = users_collection.find_one({"_id": ObjectId(user_id)})
        return user["name"] if user else None
    except:
        return None

@router.post("", response_model=TaskResponse, status_code=status.HTTP_201_CREATED)
async def create_task(
    task_data: TaskCreate,
    current_user: UserInDB = Depends(get_current_user)
):
    """
    Create a new task
    
    - Admin and Manager can create and assign tasks
    - Users cannot create tasks for others
    """
    # Check if user can assign tasks
    if task_data.assigned_to and task_data.assigned_to != current_user.id:
        if not can_assign_task(current_user.role):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You don't have permission to assign tasks to others"
            )
    
    # If no assignment specified, assign to creator
    assigned_to = task_data.assigned_to if task_data.assigned_to else current_user.id
    
    # Verify assigned user exists
    if assigned_to:
        try:
            assigned_user = users_collection.find_one({"_id": ObjectId(assigned_to)})
            if not assigned_user:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Assigned user not found"
                )
        except:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid user ID format"
            )
    
    # Create task document
    now = datetime.utcnow()
    task_doc = {
        "title": task_data.title,
        "description": task_data.description,
        "status": task_data.status,
        "due_date": task_data.due_date,
        "assigned_to": assigned_to,
        "created_by": current_user.id,
        "created_at": now,
        "updated_at": now
    }
    
    result = tasks_collection.insert_one(task_doc)
    task_id = str(result.inserted_id)
    
    # Return task with user names
    return TaskResponse(
        id=task_id,
        title=task_data.title,
        description=task_data.description,
        status=task_data.status,
        due_date=task_data.due_date,
        assigned_to=assigned_to,
        assigned_to_name=get_user_name(assigned_to),
        created_by=current_user.id,
        created_by_name=current_user.name,
        created_at=now,
        updated_at=now
    )

@router.get("", response_model=List[TaskResponse])
async def get_tasks(
    status: Optional[TaskStatus] = None,
    search: Optional[str] = None,
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    start_date: Optional[datetime] = None,
    end_date: Optional[datetime] = None,
    current_user: UserInDB = Depends(get_current_user)
):
    """
    Get tasks with role-based filtering
    
    - Admin: sees all tasks
    - Manager: sees tasks they created or assigned to them
    - User: sees only tasks assigned to them
    
    Supports filtering by status, search, and date range (for calendar)
    """
    # Build query based on role
    query = {}
    
    if current_user.role == "user":
        # Users only see their own tasks
        query["assigned_to"] = current_user.id
    elif current_user.role == "manager":
        # Managers see tasks they created or assigned to them
        query["$or"] = [
            {"created_by": current_user.id},
            {"assigned_to": current_user.id}
        ]
    # Admin sees all tasks (no additional filter)
    
    # Apply filters
    if status:
        query["status"] = status
    
    if search:
        # Search in title and description
        query["$or"] = query.get("$or", [])
        search_pattern = {"$regex": search, "$options": "i"}
        if "$or" in query and isinstance(query["$or"], list):
            # If we already have $or for role filtering, we need to combine differently
            role_filter = query.pop("$or")
            query["$and"] = [
                {"$or": role_filter},
                {"$or": [
                    {"title": search_pattern},
                    {"description": search_pattern}
                ]}
            ]
        else:
            query["$or"] = [
                {"title": search_pattern},
                {"description": search_pattern}
            ]
    
    # Date range filter for calendar
    if start_date or end_date:
        query["due_date"] = {}
        if start_date:
            query["due_date"]["$gte"] = start_date
        if end_date:
            query["due_date"]["$lte"] = end_date
    
    # Fetch tasks
    tasks = []
    cursor = tasks_collection.find(query).sort("created_at", -1).skip(skip).limit(limit)
    
    for task_doc in cursor:
        tasks.append(TaskResponse(
            id=str(task_doc["_id"]),
            title=task_doc["title"],
            description=task_doc.get("description"),
            status=task_doc["status"],
            due_date=task_doc.get("due_date"),
            assigned_to=task_doc.get("assigned_to"),
            assigned_to_name=get_user_name(task_doc.get("assigned_to")),
            created_by=task_doc["created_by"],
            created_by_name=get_user_name(task_doc["created_by"]),
            created_at=task_doc["created_at"],
            updated_at=task_doc["updated_at"]
        ))
    
    return tasks

@router.get("/{task_id}", response_model=TaskResponse)
async def get_task(
    task_id: str,
    current_user: UserInDB = Depends(get_current_user)
):
    """Get a specific task by ID"""
    try:
        task_doc = tasks_collection.find_one({"_id": ObjectId(task_id)})
    except:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid task ID format"
        )
    
    if not task_doc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )
    
    # Check if user can view this task
    if not can_view_task(
        current_user.role,
        task_doc.get("assigned_to"),
        task_doc["created_by"],
        current_user.id
    ):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You don't have permission to view this task"
        )
    
    return TaskResponse(
        id=str(task_doc["_id"]),
        title=task_doc["title"],
        description=task_doc.get("description"),
        status=task_doc["status"],
        due_date=task_doc.get("due_date"),
        assigned_to=task_doc.get("assigned_to"),
        assigned_to_name=get_user_name(task_doc.get("assigned_to")),
        created_by=task_doc["created_by"],
        created_by_name=get_user_name(task_doc["created_by"]),
        created_at=task_doc["created_at"],
        updated_at=task_doc["updated_at"]
    )

@router.put("/{task_id}", response_model=TaskResponse)
async def update_task(
    task_id: str,
    task_update: TaskUpdate,
    current_user: UserInDB = Depends(get_current_user)
):
    """
    Update a task
    
    - Admin can update any task
    - Manager can update tasks they created
    - User can only update status of their assigned tasks
    """
    try:
        obj_id = ObjectId(task_id)
    except:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid task ID format"
        )
    
    # Fetch existing task
    task_doc = tasks_collection.find_one({"_id": obj_id})
    if not task_doc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )
    
    # Check permissions
    is_assigned_user = task_doc.get("assigned_to") == current_user.id
    
    if current_user.role == "user":
        # Users can only update status of their own tasks
        if not is_assigned_user:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You can only update your own tasks"
            )
        # Users can only update status
        if task_update.title or task_update.description or task_update.assigned_to or task_update.due_date:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You can only update task status"
            )
    elif current_user.role == "manager":
        # Managers can edit tasks they created
        if not can_edit_task(current_user.role, task_doc["created_by"], current_user.id):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You can only edit tasks you created"
            )
    
    # Build update document
    update_data = {"updated_at": datetime.utcnow()}
    
    if task_update.title is not None:
        update_data["title"] = task_update.title
    if task_update.description is not None:
        update_data["description"] = task_update.description
    if task_update.status is not None:
        update_data["status"] = task_update.status
    if task_update.due_date is not None:
        update_data["due_date"] = task_update.due_date
    if task_update.assigned_to is not None:
        # Check permission to assign
        if not can_assign_task(current_user.role):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You don't have permission to reassign tasks"
            )
        update_data["assigned_to"] = task_update.assigned_to
    
    # Update task
    result = tasks_collection.find_one_and_update(
        {"_id": obj_id},
        {"$set": update_data},
        return_document=True
    )
    
    return TaskResponse(
        id=str(result["_id"]),
        title=result["title"],
        description=result.get("description"),
        status=result["status"],
        due_date=result.get("due_date"),
        assigned_to=result.get("assigned_to"),
        assigned_to_name=get_user_name(result.get("assigned_to")),
        created_by=result["created_by"],
        created_by_name=get_user_name(result["created_by"]),
        created_at=result["created_at"],
        updated_at=result["updated_at"]
    )

@router.delete("/{task_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_task(
    task_id: str,
    current_user: UserInDB = Depends(require_admin)
):
    """Delete a task (Admin only)"""
    try:
        obj_id = ObjectId(task_id)
    except:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid task ID format"
        )
    
    result = tasks_collection.delete_one({"_id": obj_id})
    
    if result.deleted_count == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )
    
    return None
