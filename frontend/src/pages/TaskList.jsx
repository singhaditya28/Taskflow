import { useState } from 'react';
import Layout from '../components/Layout';
import TaskCard from '../components/TaskCard';
import TaskFilters from '../components/TaskFilters';
import TaskForm from '../components/TaskForm';
import { useTasks } from '../hooks/useTasks';
import { createTask, updateTask, deleteTask } from '../api/tasks';
import { useAuth } from '../hooks/useAuth';
import { ROLES } from '../utils/constants';

const TaskList = () => {
    const { user } = useAuth();
    const [filters, setFilters] = useState({});
    const [searchTerm, setSearchTerm] = useState('');
    const { tasks, loading, error, refetch } = useTasks({ ...filters, search: searchTerm });
    const [showForm, setShowForm] = useState(false);
    const [editingTask, setEditingTask] = useState(null);

    const canCreateTask = user?.role === ROLES.ADMIN || user?.role === ROLES.MANAGER || user?.role === ROLES.USER;
    const canEditTask = (task) => {
        if (user?.role === ROLES.ADMIN) return true;
        if (user?.role === ROLES.MANAGER) return task.created_by === user.id;
        return false;
    };
    const canDeleteTask = user?.role === ROLES.ADMIN;

    const handleCreateTask = async (taskData) => {
        try {
            await createTask(taskData);
            setShowForm(false);
            refetch();
        } catch (error) {
            alert(error.response?.data?.detail || 'Failed to create task');
        }
    };

    const handleUpdateTask = async (taskData) => {
        try {
            await updateTask(editingTask.id, taskData);
            setEditingTask(null);
            setShowForm(false);
            refetch();
        } catch (error) {
            alert(error.response?.data?.detail || 'Failed to update task');
        }
    };

    const handleDeleteTask = async (taskId) => {
        if (!confirm('Are you sure you want to delete this task?')) return;

        try {
            await deleteTask(taskId);
            refetch();
        } catch (error) {
            alert(error.response?.data?.detail || 'Failed to delete task');
        }
    };

    const handleStatusChange = async (taskId, newStatus) => {
        try {
            await updateTask(taskId, { status: newStatus });
            refetch();
        } catch (error) {
            alert(error.response?.data?.detail || 'Failed to update status');
        }
    };

    const handleEdit = (task) => {
        setEditingTask(task);
        setShowForm(true);
    };

    const handleCancelForm = () => {
        setShowForm(false);
        setEditingTask(null);
    };

    const handleFilterChange = (newFilters) => {
        setFilters(newFilters);
    };

    return (
        <Layout>
            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">My Tasks</h1>
                        <p className="text-gray-500 mt-1">Manage and track your work</p>
                    </div>
                    {canCreateTask && !showForm && (
                        <button
                            onClick={() => {
                                setEditingTask(null);
                                setShowForm(true);
                            }}
                            className="btn btn-primary shadow-lg shadow-primary-500/30"
                        >
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                            </svg>
                            New Task
                        </button>
                    )}
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4">
                    <TaskFilters
                        filters={filters}
                        onFilterChange={handleFilterChange}
                        onSearch={setSearchTerm}
                    />
                </div>

                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
                    </div>
                ) : error ? (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                        {error}
                    </div>
                ) : tasks.length === 0 ? (
                    <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-gray-300">
                        <div className="mx-auto h-12 w-12 text-gray-400">
                            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                            </svg>
                        </div>
                        <h3 className="mt-2 text-sm font-medium text-gray-900">No tasks found</h3>
                        <p className="mt-1 text-sm text-gray-500">Get started by creating a new task.</p>
                        <div className="mt-6">
                            <button
                                onClick={() => {
                                    setEditingTask(null);
                                    setShowForm(true);
                                }}
                                className="btn btn-primary"
                            >
                                Create Task
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {tasks.map(task => (
                            <TaskCard
                                key={task.id}
                                task={task}
                                onEdit={handleEdit}
                                onDelete={handleDeleteTask}
                                onStatusChange={handleStatusChange}
                                canEdit={canEditTask(task)}
                                canDelete={canDeleteTask}
                                currentUser={user}
                            />
                        ))}
                    </div>
                )}

                {showForm && (
                    <div className="fixed inset-0 z-50 overflow-y-auto">
                        <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                                <div className="absolute inset-0 bg-gray-900/75 backdrop-blur-sm"></div>
                            </div>

                            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

                            <div className="inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg w-full">
                                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                    <div className="flex justify-between items-center mb-5">
                                        <h3 className="text-xl font-bold text-gray-900">
                                            {editingTask ? 'Edit Task' : 'Create New Task'}
                                        </h3>
                                        <button
                                            onClick={handleCancelForm}
                                            className="text-gray-400 hover:text-gray-500 transition-colors"
                                        >
                                            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    </div>
                                    <TaskForm
                                        task={editingTask}
                                        onSubmit={editingTask ? handleUpdateTask : handleCreateTask}
                                        onCancel={handleCancelForm}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </Layout>
    );
};

export default TaskList;
