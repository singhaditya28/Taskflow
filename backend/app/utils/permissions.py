"""Utility functions for role-based permissions"""

def can_view_task(user_role: str, task_assigned_to: str, task_created_by: str, user_id: str) -> bool:
    """
    Check if a user can view a specific task
    
    Args:
        user_role: Role of the current user (admin, manager, user)
        task_assigned_to: ID of user the task is assigned to
        task_created_by: ID of user who created the task
        user_id: Current user's ID
    
    Returns:
        True if user can view the task, False otherwise
    """
    if user_role == "admin":
        return True
    
    if user_role == "manager":
        # Managers can see tasks they created or tasks assigned to their team
        # For simplicity, managers can see all tasks they created
        return task_created_by == user_id or task_assigned_to == user_id
    
    # Regular users can only see tasks assigned to them
    return task_assigned_to == user_id

def can_edit_task(user_role: str, task_created_by: str, user_id: str) -> bool:
    """Check if user can edit a task"""
    if user_role == "admin":
        return True
    
    if user_role == "manager":
        # Managers can edit tasks they created
        return task_created_by == user_id
    
    # Users can update status of their own tasks (handled separately)
    return False

def can_delete_task(user_role: str) -> bool:
    """Check if user can delete tasks"""
    return user_role == "admin"

def can_assign_task(user_role: str) -> bool:
    """Check if user can assign tasks to others"""
    return user_role in ["admin", "manager"]

def can_manage_users(user_role: str) -> bool:
    """Check if user can manage other users"""
    return user_role == "admin"
