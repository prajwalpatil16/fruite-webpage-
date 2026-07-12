import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

/**
 * Redirects unauthenticated users to /login.
 * Pass requireAdmin to restrict the route to admins.
 */
export default function RequireAuth({ children, requireAdmin = false }) {
  const { token, isAdmin } = useAuth();
  const location = useLocation();

  if (!token) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  if (requireAdmin && !isAdmin) {
    return (
      <div className="py-20 text-center font-sans">
        <p className="text-gray-600">Admin access required.</p>
        <a href="/" className="font-bold text-green-700 hover:underline">Go home</a>
      </div>
    );
  }

  return children;
}
