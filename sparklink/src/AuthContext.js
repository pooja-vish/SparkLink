// AuthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const checkAuthStatus = async () => {
        try {
            const response = await axios.get('/api/users/auth-status', { withCredentials: true });
            console.log("whattt" + response.data.user);
            setUser(response.data.user);
            setIsAuthenticated(response.data.isAuthenticated);
        } catch {
            setUser(null); // Reset user if authentication check fails
            setIsAuthenticated(false);

        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        checkAuthStatus();
    }, []);

    useEffect(() => {
        console.log("IS AUTH >?>?>?>?>?", isAuthenticated);
    }, [isAuthenticated]);

    return (
        <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};
