import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../AuthContext';

const ProtectedRoute = ({ redirectPath = '/login' }) => {
    const { isAuthenticated, loading } = useAuth();
    const location = useLocation();

    // While checking authentication, show a loading indicator
    if (loading) {
        return <div>Loading...</div>;
    }

    // Redirect to login if not authenticated
    if (!isAuthenticated) {
        // Save the intended path before redirecting
        localStorage.setItem("redirectAfterLogin", location.pathname);
        return <Navigate to={redirectPath} replace />;
    }

    // Render the child components if authenticated
    return <Outlet />;
};

export default ProtectedRoute;
