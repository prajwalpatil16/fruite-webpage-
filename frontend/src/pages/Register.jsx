import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Sprout, Map, Truck, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Register = () => {
    const [role, setRole] = useState('customer'); // customer | farmer
    const [formData, setFormData] = useState({ firstName: '', lastName: '', email: '', password: '', phone: '' });
    const [error, setError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');
    const { register, loading } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMsg('');
        const fullName = `${formData.firstName} ${formData.lastName}`;
        const result = await register(fullName, formData.email, formData.password, formData.phone);
        if (result.success) {
            setSuccessMsg('Registration successful! Redirecting to login...');
            setTimeout(() => navigate('/login'), 2000);
        } else {
            setError(result.message);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                    Join FruitBasket 
                </h2>
                <p className="mt-2 text-center text-lg text-gray-600">
                    Already have an account?{' '}
                    <Link to="/login" className="font-medium text-green-600 hover:text-green-500">
                        Sign in
                    </Link>
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">

                    {/* Role Selection Cards */}
                    <div className="grid grid-cols-2 gap-4 mb-8">
                        <div
                            onClick={() => setRole('customer')}
                            className={`cursor-pointer border-2 rounded-xl p-4 text-center transition-all ${role === 'customer' ? 'border-green-600 bg-green-50' : 'border-gray-200 hover:border-gray-300'
                                }`}
                        >
                            <User className={`mx-auto mb-2 ${role === 'customer' ? 'text-green-600' : 'text-gray-400'}`} size={32} />
                            <div className={`font-semibold ${role === 'customer' ? 'text-green-900' : 'text-gray-600'}`}>Customer</div>
                            <div className="text-xs text-gray-500 mt-1">I want to buy fresh produce</div>
                        </div>

                        <div
                            onClick={() => setRole('farmer')}
                            className={`cursor-pointer border-2 rounded-xl p-4 text-center transition-all ${role === 'farmer' ? 'border-green-600 bg-green-50' : 'border-gray-200 hover:border-gray-300'
                                }`}
                        >
                            <Sprout className={`mx-auto mb-2 ${role === 'farmer' ? 'text-green-600' : 'text-gray-400'}`} size={32} />
                            <div className={`font-semibold ${role === 'farmer' ? 'text-green-900' : 'text-gray-600'}`}>Farmer</div>
                            <div className="text-xs text-gray-500 mt-1">I want to sell my harvest</div>
                        </div>
                    </div>

                    {error && (
                        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded text-sm">
                            {error}
                        </div>
                    )}
                    {successMsg && (
                        <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded text-sm">
                            {successMsg}
                        </div>
                    )}

                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="first-name" className="block text-sm font-medium text-gray-700">First name</label>
                                <input 
                                    type="text" 
                                    required 
                                    value={formData.firstName}
                                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm" 
                                />
                            </div>
                            <div>
                                <label htmlFor="last-name" className="block text-sm font-medium text-gray-700">Last name</label>
                                <input 
                                    type="text" 
                                    required 
                                    value={formData.lastName}
                                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm" 
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email address</label>
                            <input 
                                type="email" 
                                required 
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm" 
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                            <input 
                                type="password" 
                                required 
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm" 
                            />
                        </div>

                        {role === 'farmer' && (
                            <div className="bg-green-50 p-4 rounded-md border border-green-100 space-y-4">
                                <h4 className="font-semibold text-green-800 flex items-center gap-2">
                                    <Truck size={18} /> Farm Details
                                </h4>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Farm Name</label>
                                    <input type="text" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md sm:text-sm" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Location (City/District)</label>
                                    <div className="mt-1 relative rounded-md shadow-sm">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Map size={16} className="text-gray-400" />
                                        </div>
                                        <input type="text" className="pl-10 block w-full px-3 py-2 border border-gray-300 rounded-md sm:text-sm" placeholder="e.g. Nasik" />
                                    </div>
                                </div>
                            </div>
                        )}

                        <div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="animate-spin mr-2" size={20} /> Creating...
                                    </>
                                ) : (
                                    'Create Account'
                                )}
                            </button>
                        </div>
                    </form>

                </div>
            </div>
        </div>
    );
};

export default Register;
