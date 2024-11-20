import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../AuthContext';

const ProtectedRoute = ({ redirectPath = '/login' }) => {
    const { isAuthenticated, loading } = useAuth();
    const location = useLocation();

    // While checking authentication, show a loading indicator

    console.log("ProtectedRoute called.. loading - ",loading," isAuthenticated- ",isAuthenticated);
    
    if (loading) {
        return (
            <div className="loading-overlay d-flex justify-content-center align-items-center">
              <div className="text-center">
                <div className="spinner-border text-light" style={{ width: "5rem", height: "5rem" }} role="status">
                </div>
                <div className="text-light mt-2">Loading</div>
              </div>
            </div>
          );
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
