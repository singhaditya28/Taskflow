import Layout from '../components/Layout';
import UserTable from '../components/UserTable';

const UserManagement = () => {
    return (
        <Layout>
            <div>
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
                    <p className="text-gray-600 mt-1">Manage user accounts and roles</p>
                </div>

                <UserTable />
            </div>
        </Layout>
    );
};

export default UserManagement;
