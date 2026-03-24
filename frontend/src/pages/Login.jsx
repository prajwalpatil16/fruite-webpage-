import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { User, Sprout } from 'lucide-react';

const Login = () => {
    const [role, setRole] = useState('customer'); // customer | farmer

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                    Sign in to your account
                </h2>
                <p className="mt-2 text-center text-sm text-gray-600">
                    Or{' '}
                    <Link to="/register" className="font-medium text-green-600 hover:text-green-500">
                        create a new account
                    </Link>
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">

                    {/* Role Toggle */}
                    <div className="flex rounded-md bg-gray-100 p-1 mb-6">
                        <button
                            onClick={() => setRole('customer')}
                            className={`flex-1 flex items-center justify-center py-2 text-sm font-medium rounded-md transition-all ${role === 'customer' ? 'bg-white text-green-600 shadow-sm' : 'text-gray-500 hover:text-gray-900'
                                }`}
                        >
                            <User size={16} className="mr-2" /> Customer
                        </button>
                        <button
                            onClick={() => setRole('farmer')}
                            className={`flex-1 flex items-center justify-center py-2 text-sm font-medium rounded-md transition-all ${role === 'farmer' ? 'bg-white text-green-600 shadow-sm' : 'text-gray-500 hover:text-gray-900'
                                }`}
                        >
                            <Sprout size={16} className="mr-2" /> Farmer
                        </button>
                    </div>

                    <form className="space-y-6">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                Email address
                            </label>
                            <div className="mt-1">
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                Password
                            </label>
                            <div className="mt-1">
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="current-password"
                                    required
                                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                                />
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <input
                                    id="remember-me"
                                    name="remember-me"
                                    type="checkbox"
                                    className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                                />
                                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                                    Remember me
                                </label>
                            </div>

                            <div className="text-sm">
                                <a href="#" className="font-medium text-green-600 hover:text-green-500">
                                    Forgot your password?
                                </a>
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                            >
                                Sign in as {role === 'customer' ? 'Customer' : 'Farmer'}
                            </button>
                        </div>
                    </form>

                </div>
            </div>
        </div>
    );
};

export default Login;
