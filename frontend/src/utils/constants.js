export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const ROLES = {
    ADMIN: 'admin',
    MANAGER: 'manager',
    USER: 'user'
};

export const TASK_STATUS = {
    TODO: 'todo',
    IN_PROGRESS: 'in_progress',
    COMPLETED: 'completed'
};

export const STATUS_OPTIONS = [
    { value: 'todo', label: 'To Do' },
    { value: 'in_progress', label: 'In Progress' },
    { value: 'completed', label: 'Completed' }
];

export const STATUS_COLORS = {
    todo: 'badge-todo',
    in_progress: 'badge-in-progress',
    completed: 'badge-completed'
};
