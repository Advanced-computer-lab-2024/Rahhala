// src/pages/TouristDashboard.jsx
import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const TouristDashboard = () => {
    const { auth } = useContext(AuthContext);

    if (!auth.user) {
        return <div>Loading user data...</div>;
    }

    return (
        <div>
            <h1>Tourist Dashboard</h1>
            <p><strong>User ID:</strong> {auth.user.id}</p>
            <p><strong>User Type:</strong> {auth.user.type}</p>
        </div>
    );
};

export default TouristDashboard;
