// src/context/AuthContext.jsx
import React, { createContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

import axiosInstance from '../utils/axiosConfig'; // Ensure correct path

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
        const verifyToken = () => {
            if (auth.token) {
                try {
                    // Decode the token to extract user information
                    const decoded = jwtDecode(auth.token);
                    const userId = decoded.id;
                    const userType = decoded.userType;

                    // Update Auth Context with user information
                    setAuth({
                        token: auth.token,
                        isAuthenticated: true,
                        loading: false,
                        user: {
                            id: userId,
                            type: userType,
                        },
                    });
                } catch (error) {
                    console.error('Invalid token:', error);
                    // If token is invalid, remove it and reset auth state
                    localStorage.removeItem('token');
                    setAuth({
                        token: null,
                        isAuthenticated: false,
                        loading: false,
                        user: null,
                    });
                }
            } else {
                setAuth({
                    ...auth,
                    isAuthenticated: false,
                    loading: false,
                    user: null,
                });
            }
        };

        verifyToken();
    }, [auth.token]);

    const logout = () => {
        localStorage.removeItem('token'); 
        setAuth({
            token: null,
            isAuthenticated: false,
            loading: false,
            user: null,
        });
    };

    return (
        <AuthContext.Provider value={{ auth, setAuth }}>
            {children}
        </AuthContext.Provider>
    );
};
