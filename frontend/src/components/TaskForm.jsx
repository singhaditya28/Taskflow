import { useState, useEffect } from 'react';
import { STATUS_OPTIONS, ROLES } from '../utils/constants';
import { getUsers } from '../api/users';
import { useAuth } from '../hooks/useAuth';

const TaskForm = ({ task, onSubmit, onCancel }) => {
    const { user } = useAuth();
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        status: 'todo',
        due_date: '',
        assigned_to: ''
    });
    const [users, setUsers] = useState([]);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const canAssignTasks = user?.role === ROLES.ADMIN || user?.role === ROLES.MANAGER;

    useEffect(() => {
        if (task) {
            setFormData({
                title: task.title || '',
                description: task.description || '',
                status: task.status || 'todo',
                due_date: task.due_date ? task.due_date.split('T')[0] : '',
                assigned_to: task.assigned_to || ''
            });
        }
    }, [task]);

    useEffect(() => {
        // Fetch users for assignment dropdown (admin/manager only)
        if (canAssignTasks) {
            fetchUsers();
        }
    }, [canAssignTasks]);

    const fetchUsers = async () => {
        try {
            const data = await getUsers();
            setUsers(data);
        } catch (error) {
            console.error('Failed to fetch users:', error);
        }
    };

    const validate = () => {
        const newErrors = {};

        if (!formData.title.trim()) {
            newErrors.title = 'Title is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validate()) return;

        setLoading(true);

        const submitData = {
            ...formData,
            due_date: formData.due_date ? new Date(formData.due_date).toISOString() : null
        };

        await onSubmit(submitData);
        setLoading(false);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        // Clear error for this field
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title *
                </label>
                <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className={`input ${errors.title ? 'border-red-500' : ''}`}
                    placeholder="Enter task title"
                />
                {errors.title && (
                    <p className="text-red-500 text-sm mt-1">{errors.title}</p>
                )}
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                </label>
                <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows="3"
                    className="input"
                    placeholder="Enter task description"
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Status
                    </label>
                    <select
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        className="input"
                    >
                        {STATUS_OPTIONS.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Due Date
                    </label>
                    <input
                        type="date"
                        name="due_date"
                        value={formData.due_date}
                        onChange={handleChange}
                        className="input"
                    />
                </div>
            </div>

            {canAssignTasks && (
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Assign To
                    </label>
                    <select
                        name="assigned_to"
                        value={formData.assigned_to}
                        onChange={handleChange}
                        className="input"
                    >
                        <option value="">Select user...</option>
                        {users.map((u) => (
                            <option key={u.id} value={u.id}>
                                {u.name} ({u.email})
                            </option>
                        ))}
                    </select>
                </div>
            )}

            <div className="flex space-x-3 pt-4">
                <button
                    type="submit"
                    disabled={loading}
                    className="btn btn-primary flex-1"
                >
                    {loading ? 'Saving...' : task ? 'Update Task' : 'Create Task'}
                </button>
                <button
                    type="button"
                    onClick={onCancel}
                    className="btn btn-secondary"
                >
                    Cancel
                </button>
            </div>
        </form>
    );
};

export default TaskForm;
