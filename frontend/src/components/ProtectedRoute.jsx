// src/components/ProtectedRoute.jsx
import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const ProtectedRoute = ({ children, roles }) => {
    const { auth } = useContext(AuthContext);

    if (auth.loading) {
        return <div>Loading...</div>; // Show a loading indicator while the auth state is being determined
    }

    // If the user is authenticated and has one of the required roles, render the children (protected component)
    if (auth.isAuthenticated && (!roles || roles.includes(auth.user.type))) {
        return children;
    }

    // If not authenticated or does not have the required role, redirect to login or not authorized page
    return <Navigate to="/login" />;
};

export default ProtectedRoute;