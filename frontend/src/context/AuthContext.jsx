import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

// Create Context
export const AuthContext = createContext();

// Provider Component
export const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState({
        token: localStorage.getItem('token') || null,
        isAuthenticated: false,
        loading: true,
        user: null,
    });

    useEffect(() => {
        if (auth.token) {
            // Optionally, fetch user data here
            setAuth((prev) => ({ ...prev, isAuthenticated: true, loading: false }));
        } else {
            setAuth((prev) => ({ ...prev, isAuthenticated: false, loading: false }));
        }
    }, [auth.token]);

    return (
        <AuthContext.Provider value={{ auth, setAuth }}>
            {children}
        </AuthContext.Provider>
    );
};
