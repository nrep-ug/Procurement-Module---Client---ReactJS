// src/context/AuthContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';
import { signin } from '../services/auth.js';
import storageUtil from '../utils/storageUtil';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check localStorage when the component mounts
        const storedAuth = storageUtil.getItem('isAuthenticated');
        if (storedAuth === true) {
            setIsAuthenticated(true);
        }
        setLoading(false);
    }, []);

    const login = async (email, password, userType) => {
        const response = await signin(email, password, userType);

        if (response.ok) {
            const result = await response.json();
            if (result.success) {
                setIsAuthenticated(true);
                storageUtil.setItem('isAuthenticated', true); // Store authentication state in localStorage
                storageUtil.setItem('userInfo', result.data); // Store the user info in localStorage
                return true;
            }
        }

        return false;
    };

    const logout = () => {
        setIsAuthenticated(false);
        storageUtil.removeItem('isAuthenticated'); // Remove authentication state from localStorage
        storageUtil.removeItem('userInfo'); // Remove userInfo from localStorage
    };

    if (loading) {
        return <div>Loading...</div>; // or return a loading spinner
    }

    return (
        <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};
