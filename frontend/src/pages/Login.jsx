import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const Login = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
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
        setLoading(true);
        setError('');

        const result = await login(formData);

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
            <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24 bg-white">
                <div className="mx-auto w-full max-w-sm lg:w-96">
                    <div className="mb-10">
                        <div className="h-10 w-10 bg-primary-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/30 mb-4">
                            <span className="text-white text-xl font-bold">T</span>
                        </div>
                        <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Welcome back</h2>
                        <p className="mt-2 text-sm text-gray-600">
                            Please enter your details to sign in.
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

                    <form onSubmit={handleSubmit} className="space-y-6">
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
                                placeholder="Enter your email"
                            />
                        </div>

                        <div>
                            <div className="flex items-center justify-between mb-1.5">
                                <label className="block text-sm font-semibold text-gray-700">
                                    Password
                                </label>
                                <a href="#" className="text-sm font-medium text-primary-600 hover:text-primary-500">
                                    Forgot password?
                                </a>
                            </div>
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
                                    Signing in...
                                </span>
                            ) : 'Sign in'}
                        </button>
                    </form>

                    <p className="mt-8 text-center text-sm text-gray-600">
                        Don't have an account?{' '}
                        <Link to="/signup" className="font-semibold text-primary-600 hover:text-primary-500 transition-colors">
                            Sign up for free
                        </Link>
                    </p>
                </div>
            </div>

            {/* Right Side - Image/Pattern */}
            <div className="hidden lg:block relative w-0 flex-1 bg-primary-900">
                <div className="absolute inset-0 h-full w-full bg-gradient-to-br from-primary-600 to-primary-900 opacity-90"></div>
                <div className="absolute inset-0 flex flex-col justify-center px-20 z-10">
                    <h2 className="text-4xl font-bold text-white mb-6 leading-tight">
                        Manage your tasks with <br />
                        <span className="text-primary-200">elegance and ease.</span>
                    </h2>
                    <p className="text-primary-100 text-lg max-w-md leading-relaxed">
                        Streamline your workflow, collaborate with your team, and achieve your goals with our intuitive task management system.
                    </p>

                    {/* Decorative elements */}
                    <div className="mt-12 grid grid-cols-2 gap-4 opacity-50">
                        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/10">
                            <div className="h-2 w-12 bg-white/30 rounded mb-3"></div>
                            <div className="h-2 w-24 bg-white/20 rounded"></div>
                        </div>
                        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/10 translate-y-4">
                            <div className="h-2 w-12 bg-white/30 rounded mb-3"></div>
                            <div className="h-2 w-24 bg-white/20 rounded"></div>
                        </div>
                    </div>
                </div>
                {/* Abstract shapes */}
                <div className="absolute top-0 right-0 -mt-20 -mr-20 w-80 h-80 bg-primary-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
                <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-80 h-80 bg-primary-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
            </div>
        </div>
    );
};

export default Login;
