import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const Signup = () => {
    const navigate = useNavigate();
    const { signup } = useAuth();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: 'user'
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Validation
        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setLoading(true);

        const { confirmPassword, ...signupData } = formData;
        const result = await signup(signupData);

        if (result.success) {
            navigate('/dashboard');
        } else {
            setError(result.error);
        }

        setLoading(false);
    };

    return (
        <div className="min-h-screen flex bg-gray-50">
            {/* Left Side - Form */}
            <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24 bg-white overflow-y-auto">
                <div className="mx-auto w-full max-w-sm lg:w-96">
                    <div className="mb-8">
                        <div className="h-10 w-10 bg-primary-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/30 mb-4">
                            <span className="text-white text-xl font-bold">T</span>
                        </div>
                        <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Create account</h2>
                        <p className="mt-2 text-sm text-gray-600">
                            Start your journey with TaskFlow today.
                        </p>
                    </div>

                    {error && (
                        <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-lg mb-6 text-sm flex items-center">
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                Full Name
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                className="input"
                                placeholder="John Doe"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                Email address
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                className="input"
                                placeholder="your@email.com"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                Role
                            </label>
                            <div className="relative">
                                <select
                                    name="role"
                                    value={formData.role}
                                    onChange={handleChange}
                                    className="input appearance-none bg-no-repeat bg-right pr-10"
                                    style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: 'right 0.5rem center', backgroundSize: '1.5em 1.5em' }}
                                >
                                    <option value="user">User</option>
                                    <option value="manager">Manager</option>
                                    <option value="admin">Admin</option>
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                    Password
                                </label>
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                    className="input"
                                    placeholder="••••••••"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                    Confirm
                                </label>
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    required
                                    className="input"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <div className="pt-2">
                            <button
                                type="submit"
                                disabled={loading}
                                className="btn btn-primary w-full py-3 text-base shadow-lg shadow-primary-500/25"
                            >
                                {loading ? (
                                    <span className="flex items-center">
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Creating account...
                                    </span>
                                ) : 'Create Account'}
                            </button>
                        </div>
                    </form>

                    <p className="mt-8 text-center text-sm text-gray-600">
                        Already have an account?{' '}
                        <Link to="/login" className="font-semibold text-primary-600 hover:text-primary-500 transition-colors">
                            Sign in instead
                        </Link>
                    </p>
                </div>
            </div>

            {/* Right Side - Image/Pattern */}
            <div className="hidden lg:block relative w-0 flex-1 bg-gray-900">
                <div className="absolute inset-0 h-full w-full bg-gradient-to-br from-gray-800 to-gray-900"></div>
                <div className="absolute inset-0 flex flex-col justify-center px-20 z-10">
                    <div className="relative">
                        <div className="absolute -top-10 -left-10 w-20 h-20 bg-primary-500 rounded-full mix-blend-overlay filter blur-xl opacity-50 animate-blob"></div>
                        <h2 className="text-4xl font-bold text-white mb-6 leading-tight relative z-10">
                            Join thousands of <br />
                            <span className="text-primary-400">productive teams.</span>
                        </h2>
                    </div>
                    <p className="text-gray-300 text-lg max-w-md leading-relaxed mb-10">
                        Experience the future of task management. Built for speed, designed for clarity, and engineered for your success.
                    </p>

                    <div className="flex -space-x-4">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className={`w-12 h-12 rounded-full border-2 border-gray-800 bg-gray-700 flex items-center justify-center text-xs text-white font-medium z-${10 - i}`}>
                                U{i}
                            </div>
                        ))}
                        <div className="w-12 h-12 rounded-full border-2 border-gray-800 bg-gray-700 flex items-center justify-center text-xs text-white font-medium z-0">
                            +2k
                        </div>
                    </div>
                    <p className="mt-4 text-sm text-gray-400 font-medium">Trusted by teams worldwide</p>
                </div>
            </div>
        </div>
    );
};

export default Signup;
