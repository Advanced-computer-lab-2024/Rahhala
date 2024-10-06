// src/components/ProtectedRoute.jsx
import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
    const { auth } = useContext(AuthContext);

    if (auth.loading) {
        return <div>Loading...</div>; // Show a loading indicator while the auth state is being determined
    }

    // If the user is authenticated, render the children (protected component)
    if (auth.isAuthenticated) {
        return children;
    }

    // If not authenticated, redirect to login
    return <Navigate to="/login" />;
};

export default ProtectedRoute;
