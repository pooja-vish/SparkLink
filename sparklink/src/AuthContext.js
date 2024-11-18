import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const checkAuthStatus = async () => {
        // Set loading to true before starting the request
        setLoading(true);
        try {
            const response = await axios.get('/api/users/auth-status', { withCredentials: true });
            console.log("Auth Response:", response.data);
            
            setUser(response.data.user);
            setIsAuthenticated(response.data.isAuthenticated);
        } catch (error) {
            console.error("Error fetching auth status:", error);
            setUser(null); // Reset user if authentication check fails
            setIsAuthenticated(false);
        } finally {
            setLoading(false); // Set loading to false regardless of success or failure
        }
    };

    useEffect(() => {
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
            loading 
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};
