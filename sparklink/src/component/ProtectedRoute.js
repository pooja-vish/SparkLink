// ProtectedRoute.js
import React, { useState, useEffect } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../AuthContext';

const ProtectedRoute = ({ children, redirectPath = '/login' }) => {
    const { isAuthenticated, loading } = useAuth();
    const [redirectFlag, setRedirectFlag] = useState(false);
    const location = useLocation();

    useEffect(() => {
        if (!isAuthenticated) {
            console.log("not authenticated")
            //Saving the path they were trying to access
            setRedirectFlag(true);
            localStorage.setItem("redirectAfterLogin", location.pathname);
        } else {
            console.log("authenticateddd");
        }
    }, [isAuthenticated]);

    if (redirectFlag) {
        return <Navigate to={redirectPath} replace />;
    }
    if (loading) return <div>Loading...</div>
    return children;
};

export default ProtectedRoute;
