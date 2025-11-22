import { useState, useEffect } from 'react';
import { getUsers, updateUser, deleteUser } from '../api/users';

const UserTable = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingUser, setEditingUser] = useState(null);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const data = await getUsers();
            setUsers(data);
        } catch (error) {
            console.error('Failed to fetch users:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleRoleChange = async (userId, newRole) => {
        try {
            await updateUser(userId, { role: newRole });
            fetchUsers();
            setEditingUser(null);
        } catch (error) {
            alert('Failed to update user role');
        }
    };

    const handleDelete = async (userId) => {
        if (!confirm('Are you sure you want to delete this user?')) return;

        try {
            await deleteUser(userId);
            fetchUsers();
        } catch (error) {
            alert(error.response?.data?.detail || 'Failed to delete user');
        }
    };

    const RoleBadge = ({ role }) => {
        const styles = {
            admin: 'bg-purple-100 text-purple-700 border-purple-200',
            manager: 'bg-indigo-100 text-indigo-700 border-indigo-200',
            user: 'bg-slate-100 text-slate-600 border-slate-200'
        };
        return (
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${styles[role] || styles.user}`}>
                {role.charAt(0).toUpperCase() + role.slice(1)}
            </span>
        );
    };

    if (loading) {
        return (
            <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="grid grid-cols-12 gap-4 p-4 bg-gray-50/50 border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    <div className="col-span-5">User</div>
                    <div className="col-span-4">Role</div>
                    <div className="col-span-3 text-right">Actions</div>
                </div>

                <div className="divide-y divide-gray-50">
                    {users.map((user) => (
                        <div key={user.id} className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-gray-50/80 transition-colors group">
                            <div className="col-span-5">
                                <div className="flex items-center gap-4">
                                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-sm font-bold text-white shadow-sm ring-2 ring-white">
                                        {user.name?.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <div className="font-medium text-gray-900">{user.name}</div>
                                        <div className="text-xs text-gray-500">{user.email}</div>
                                    </div>
                                </div>
                            </div>

                            <div className="col-span-4">
                                {editingUser === user.id ? (
                                    <select
                                        defaultValue={user.role}
                                        onChange={(e) => handleRoleChange(user.id, e.target.value)}
                                        className="block w-full rounded-lg border-gray-300 py-1.5 text-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    >
                                        <option value="user">User</option>
                                        <option value="manager">Manager</option>
                                        <option value="admin">Admin</option>
                                    </select>
                                ) : (
                                    <RoleBadge role={user.role} />
                                )}
                            </div>

                            <div className="col-span-3 text-right">
                                <div className="flex justify-end gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={() => setEditingUser(editingUser === user.id ? null : user.id)}
                                        className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                                        title={editingUser === user.id ? 'Cancel' : 'Edit Role'}
                                    >
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                                    </button>
                                    <button
                                        onClick={() => handleDelete(user.id)}
                                        className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                                        title="Delete User"
                                    >
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default UserTable;
