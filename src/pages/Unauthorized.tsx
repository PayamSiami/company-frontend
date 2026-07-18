// frontend-company/src/pages/Unauthorized.tsx
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const Unauthorized: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user } = useAuth();

    // Get the attempted path from location state
    const attemptedPath = location.state?.from?.pathname || '/dashboard';

    const handleGoBack = () => {
        navigate(-1);
    };

    const handleGoHome = () => {
        navigate('/dashboard');
    };

    const handleLogout = async () => {
        // You might want to add logout logic here
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow-xl sm:rounded-lg sm:px-10">
                    {/* Icon */}
                    <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-red-100 animate-pulse">
                        <svg
                            className="h-12 w-12 text-red-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 15v2m0 0v2m0-2h2m-2 0H10m-2-4a2 2 0 112 2m0-2a2 2 0 112 2m-2-2a2 2 0 11-2 2m6 0a2 2 0 112-2m-4 0a2 2 0 11-2 2m6 0a2 2 0 01-2-2m-4 0a2 2 0 012-2m0 0a2 2 0 012 2m-2-2v-2m0 2h-2m2 0h2"
                            />
                        </svg>
                    </div>

                    <div className="mt-6 text-center">
                        <h2 className="text-3xl font-extrabold text-gray-900">
                            Access Denied
                        </h2>
                        <p className="mt-2 text-sm text-gray-600">
                            You don't have permission to access this page.
                        </p>

                        {user && (
                            <div className="mt-4 bg-gray-50 rounded-md p-4 text-left">
                                <p className="text-xs text-gray-500">Current Account Details</p>
                                <div className="mt-2 space-y-1">
                                    <p className="text-sm">
                                        <span className="font-medium">Email:</span> {user.email}
                                    </p>
                                    <p className="text-sm">
                                        <span className="font-medium">Role:</span>{' '}
                                        <span className="capitalize">{user.role}</span>
                                    </p>
                                    {user.companyId && (
                                        <p className="text-sm">
                                            <span className="font-medium">Company:</span> {user.companyId}
                                        </p>
                                    )}
                                </div>
                            </div>
                        )}

                        {attemptedPath && (
                            <p className="mt-2 text-xs text-gray-400">
                                Attempted to access: <span className="font-mono">{attemptedPath}</span>
                            </p>
                        )}
                    </div>

                    <div className="mt-6 space-y-3">
                        <button
                            onClick={handleGoBack}
                            className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
                        >
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            Go Back
                        </button>

                        <button
                            onClick={handleGoHome}
                            className="w-full flex justify-center items-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
                        >
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                            </svg>
                            Go to Dashboard
                        </button>

                        <button
                            onClick={handleLogout}
                            className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200"
                        >
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                            Sign Out
                        </button>
                    </div>

                    {/* Help section */}
                    <div className="mt-6">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-300" />
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-white text-gray-500">
                                    Need access?
                                </span>
                            </div>
                        </div>
                        <p className="mt-4 text-center text-xs text-gray-500">
                            Contact your administrator to request access to this resource.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Unauthorized;