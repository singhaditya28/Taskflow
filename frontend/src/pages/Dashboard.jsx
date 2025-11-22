import { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { getTasks } from '../api/tasks';
import { Link } from 'react-router-dom';
import { ROLES } from '../utils/constants';

const Dashboard = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState({
        total: 0,
        todo: 0,
        inProgress: 0,
        completed: 0,
        pending: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const tasks = await getTasks();
            setStats({
                total: tasks.length,
                todo: tasks.filter(t => t.status === 'todo').length,
                inProgress: tasks.filter(t => t.status === 'in_progress').length,
                completed: tasks.filter(t => t.status === 'completed').length,
                pending: tasks.filter(t => t.status !== 'completed').length
            });
        } catch (error) {
            console.error('Failed to fetch stats:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                    <p className="text-gray-500 mt-1">Welcome back, {user?.name}!</p>
                </div>
                <div className="text-sm text-gray-500 bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-100">
                    {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-2xl p-6 shadow-soft border border-gray-100 relative overflow-hidden group hover:shadow-md transition-all duration-300">
                    <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-blue-50 rounded-full group-hover:scale-110 transition-transform duration-300"></div>
                    <div className="relative">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-blue-50 rounded-xl text-blue-600">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                                </svg>
                            </div>
                            <span className="text-sm font-medium text-gray-400">Total Tasks</span>
                        </div>
                        <div className="flex items-baseline">
                            <h3 className="text-3xl font-bold text-gray-900">{stats.total}</h3>
                            <span className="ml-2 text-sm text-green-600 font-medium flex items-center">
                                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18" />
                                </svg>
                                +12%
                            </span>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-soft border border-gray-100 relative overflow-hidden group hover:shadow-md transition-all duration-300">
                    <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-yellow-50 rounded-full group-hover:scale-110 transition-transform duration-300"></div>
                    <div className="relative">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-yellow-50 rounded-xl text-yellow-600">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <span className="text-sm font-medium text-gray-400">Pending</span>
                        </div>
                        <div className="flex items-baseline">
                            <h3 className="text-3xl font-bold text-gray-900">{stats.pending}</h3>
                            <span className="ml-2 text-sm text-gray-500">tasks waiting</span>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-soft border border-gray-100 relative overflow-hidden group hover:shadow-md transition-all duration-300">
                    <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-green-50 rounded-full group-hover:scale-110 transition-transform duration-300"></div>
                    <div className="relative">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-green-50 rounded-xl text-green-600">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <span className="text-sm font-medium text-gray-400">Completed</span>
                        </div>
                        <div className="flex items-baseline">
                            <h3 className="text-3xl font-bold text-gray-900">{stats.completed}</h3>
                            <span className="ml-2 text-sm text-green-600 font-medium">Great job!</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div>
                <h2 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <Link to="/tasks" className="group bg-white p-4 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 flex items-center">
                        <div className="h-12 w-12 bg-primary-50 rounded-lg flex items-center justify-center text-primary-600 group-hover:bg-primary-600 group-hover:text-white transition-colors">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                            </svg>
                        </div>
                        <div className="ml-4">
                            <h3 className="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">Create New Task</h3>
                            <p className="text-sm text-gray-500">Add a new task to your list</p>
                        </div>
                    </Link>

                    <Link to="/calendar" className="group bg-white p-4 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 flex items-center">
                        <div className="h-12 w-12 bg-purple-50 rounded-lg flex items-center justify-center text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <div className="ml-4">
                            <h3 className="font-semibold text-gray-900 group-hover:text-purple-600 transition-colors">View Calendar</h3>
                            <p className="text-sm text-gray-500">Check upcoming deadlines</p>
                        </div>
                    </Link>

                    {user?.role === ROLES.ADMIN && (
                        <Link to="/users" className="group bg-white p-4 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 flex items-center">
                            <div className="h-12 w-12 bg-orange-50 rounded-lg flex items-center justify-center text-orange-600 group-hover:bg-orange-600 group-hover:text-white transition-colors">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                </svg>
                            </div>
                            <div className="ml-4">
                                <h3 className="font-semibold text-gray-900 group-hover:text-orange-600 transition-colors">Manage Users</h3>
                                <p className="text-sm text-gray-500">Add or remove team members</p>
                            </div>
                        </Link>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
