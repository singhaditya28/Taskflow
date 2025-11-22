import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Layout from './components/Layout';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import TaskList from './pages/TaskList';
import CalendarView from './pages/CalendarView';
import UserManagement from './pages/UserManagement';
import { ROLES } from './utils/constants';

function App() {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    {/* Public routes */}
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />

                    {/* Protected routes */}
                    <Route
                        path="/dashboard"
                        element={
                            <PrivateRoute>
                                <Layout>
                                    <Dashboard />
                                </Layout>
                            </PrivateRoute>
                        }
                    />

                    <Route
                        path="/tasks"
                        element={
                            <PrivateRoute>
                                <TaskList />
                            </PrivateRoute>
                        }
                    />

                    <Route
                        path="/calendar"
                        element={
                            <PrivateRoute>
                                <CalendarView />
                            </PrivateRoute>
                        }
                    />

                    <Route
                        path="/users"
                        element={
                            <PrivateRoute allowedRoles={[ROLES.ADMIN]}>
                                <UserManagement />
                            </PrivateRoute>
                        }
                    />

                    {/* Default redirect */}
                    <Route path="/" element={<Navigate to="/dashboard" replace />} />
                    <Route path="*" element={<Navigate to="/dashboard" replace />} />
                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;
