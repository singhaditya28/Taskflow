import { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const Layout = ({ children }) => {
    const { user, logout } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const isActive = (path) => {
        return location.pathname === path;
    };

    const navItems = [
        {
            path: '/dashboard', label: 'Dashboard', icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
            )
        },
        {
            path: '/tasks', label: 'My Tasks', icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
            )
        },
        {
            path: '/calendar', label: 'Calendar', icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
            )
        },
    ];

    if (user?.role === 'admin') {
        navItems.push({
            path: '/users', label: 'Users', icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
            )
        });
    }

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Sidebar */}
            <aside
                className={`${isSidebarCollapsed ? 'w-20' : 'w-64'} bg-white border-r border-gray-200 hidden md:flex flex-col fixed h-full z-20 transition-all duration-300 ease-in-out`}
            >
                <div className={`h-16 flex items-center ${isSidebarCollapsed ? 'justify-center' : 'px-6'} border-b border-gray-100 relative`}>
                    <div className="h-8 w-8 bg-primary-600 rounded-lg flex items-center justify-center shadow-lg shadow-primary-500/20 flex-shrink-0">
                        <span className="text-white font-bold text-lg">T</span>
                    </div>
                    {!isSidebarCollapsed && (
                        <span className="ml-3 text-xl font-bold text-gray-900 tracking-tight whitespace-nowrap overflow-hidden">TaskFlow</span>
                    )}

                    {/* Collapse Toggle Button */}
                    <button
                        onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                        className="absolute -right-3 top-1/2 transform -translate-y-1/2 bg-white border border-gray-200 rounded-full p-1 shadow-sm text-gray-500 hover:text-primary-600 hover:border-primary-200 transition-colors"
                    >
                        <svg className={`w-4 h-4 transition-transform duration-300 ${isSidebarCollapsed ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                </div>

                <nav className="flex-1 px-3 py-6 space-y-1">
                    {navItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            title={isSidebarCollapsed ? item.label : ''}
                            className={`flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group ${isActive(item.path)
                                ? 'bg-primary-50 text-primary-700 shadow-sm ring-1 ring-primary-200'
                                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                } ${isSidebarCollapsed ? 'justify-center' : ''}`}
                        >
                            <span className={`transition-colors ${isActive(item.path) ? 'text-primary-600' : 'text-gray-400 group-hover:text-gray-500'} ${isSidebarCollapsed ? '' : 'mr-3'}`}>
                                {item.icon}
                            </span>
                            {!isSidebarCollapsed && (
                                <span className="whitespace-nowrap overflow-hidden">{item.label}</span>
                            )}
                        </Link>
                    ))}
                </nav>
            </aside>

            {/* Main Content */}
            <div className={`flex-1 ${isSidebarCollapsed ? 'md:ml-20' : 'md:ml-64'} flex flex-col min-h-screen transition-all duration-300 ease-in-out`}>
                {/* Top Header */}
                <header className="h-16 bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-10 px-4 sm:px-6 lg:px-8 flex items-center justify-between">
                    <div className="md:hidden flex items-center">
                        <div className="h-8 w-8 bg-primary-600 rounded-lg flex items-center justify-center mr-2">
                            <span className="text-white font-bold">T</span>
                        </div>
                        <span className="text-lg font-bold text-gray-900">TaskFlow</span>
                    </div>

                    <div className="flex-1 flex justify-end">
                        <div className="relative">
                            <button
                                onClick={() => setIsProfileOpen(!isProfileOpen)}
                                className="flex items-center space-x-3 focus:outline-none p-1.5 rounded-full hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-200"
                            >
                                <div className="hidden md:flex flex-col items-end mr-1">
                                    <span className="text-sm font-semibold text-gray-700 leading-none">{user?.name}</span>
                                    <span className="text-xs text-gray-500 capitalize mt-1">{user?.role}</span>
                                </div>
                                <div className="h-9 w-9 rounded-full bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center text-primary-700 font-bold border-2 border-white shadow-sm ring-1 ring-gray-100">
                                    {user?.name?.charAt(0).toUpperCase()}
                                </div>
                            </button>

                            {isProfileOpen && (
                                <>
                                    <div
                                        className="fixed inset-0 z-10"
                                        onClick={() => setIsProfileOpen(false)}
                                    ></div>
                                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg ring-1 ring-black ring-opacity-5 py-1 z-20 transform origin-top-right transition-all animate-in fade-in zoom-in-95 duration-200">
                                        <div className="px-4 py-4 border-b border-gray-50 bg-gray-50/50">
                                            <p className="text-sm text-gray-500">Signed in as</p>
                                            <p className="text-sm font-semibold text-gray-900 truncate mt-0.5">{user?.email}</p>
                                        </div>
                                        <div className="py-1">
                                            <button
                                                onClick={handleLogout}
                                                className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center group"
                                            >
                                                <svg className="w-4 h-4 mr-3 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                                </svg>
                                                Sign out
                                            </button>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
                    <div className="max-w-7xl mx-auto">
                        {children || <Outlet />}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Layout;
