// ProtectedRoute.js
import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../AuthContext';

const ProtectedRoute = ({ children, redirectPath = '/login' }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) return <div>Loading...</div>;
   
  if (!isAuthenticated) {
    console.log("not authenticated")
    // Save the path they were trying to access
    localStorage.setItem("redirectAfterLogin", location.pathname);
    return <Navigate to={redirectPath} replace />;
  }
  console.log("authenticateddd")
  return children;
};

export default ProtectedRoute;
