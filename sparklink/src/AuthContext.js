import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const checkAuthStatus = useCallback(async () => {
        setLoading(true);
        try {
            const response = await axios.get('/api/users/auth-status', { withCredentials: true });
            setUser(response.data.user);
            setIsAuthenticated(response.data.isAuthenticated);
        } catch (error) {
            console.error("Error fetching auth status:", error);
            setUser(null);
            setIsAuthenticated(false);
        } finally {
            setLoading(false);
        }
    });

    useEffect(() => {
        console.log("First time check Auth Status :", isAuthenticated);
        checkAuthStatus();
    }, []);

    useEffect(() => {
        console.log("Authentication Status Changed:", isAuthenticated);
    }, [isAuthenticated]);

    return (
        <AuthContext.Provider value={{ 
            isAuthenticated, 
            user, 
            setUser, 
            setIsAuthenticated, 
            loading, 
            refreshAuth: checkAuthStatus 
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};
