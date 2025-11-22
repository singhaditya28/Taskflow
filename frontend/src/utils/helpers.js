import { format, parseISO } from 'date-fns';

export const formatDate = (dateString) => {
    if (!dateString) return 'No due date';
    try {
        const date = typeof dateString === 'string' ? parseISO(dateString) : dateString;
        return format(date, 'MMM dd, yyyy');
    } catch (error) {
        return 'Invalid date';
    }
};

export const formatDateTime = (dateString) => {
    if (!dateString) return 'N/A';
    try {
        const date = typeof dateString === 'string' ? parseISO(dateString) : dateString;
        return format(date, 'MMM dd, yyyy HH:mm');
    } catch (error) {
        return 'Invalid date';
    }
};

export const getStatusLabel = (status) => {
    const labels = {
        'todo': 'To Do',
        'in_progress': 'In Progress',
        'completed': 'Completed'
    };
    return labels[status] || status;
};

export const getRoleBadgeColor = (role) => {
    const colors = {
        'admin': 'bg-purple-100 text-purple-800',
        'manager': 'bg-blue-100 text-blue-800',
        'user': 'bg-gray-100 text-gray-800'
    };
    return colors[role] || 'bg-gray-100 text-gray-800';
};
