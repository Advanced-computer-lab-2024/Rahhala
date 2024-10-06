import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import axiosInstance from '../utils/axiosConfig';

const TouristAccount = () => {
    const { auth } = useContext(AuthContext); // Get auth context
    const [profile, setProfile] = useState(null); // State to hold the tourist profile
    const [error, setError] = useState(null); // State to handle errors

    useEffect(() => {
        // Only fetch profile if the user is authenticated
        if (auth.isAuthenticated && auth.user) {
            const fetchProfile = async () => {
                try {
                    const response = await axiosInstance.get(`/touristAccount/${auth.user.id}`);
                    setProfile(response.data.profile); // Assuming 'profile' is the field returned by the backend
                } catch (err) {
                    setError('Failed to load tourist profile.');
                }
            };

            fetchProfile();
        }
    }, [auth]);

    // Loading state while fetching the user data
    if (auth.loading) {
        return <div>Loading user data...</div>;
    }

    // Check if the user is authenticated
    if (!auth.isAuthenticated) {
        return <div>You are not authenticated.</div>;
    }

    return (
        <div>
            <h2>Tourist Account</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>} {/* Display error if there's one */}

            {/* If profile data is available, display it */}
            {profile ? (
                <div>
                    <p><strong>Name:</strong> {profile.name}</p>
                    <p><strong>Email:</strong> {profile.email}</p>
                    <p><strong>Phone:</strong> {profile.phone}</p>
                    {/* Add more fields based on your tourist model */}
                </div>
            ) : (
                <p>No profile data available.</p> // In case profile is not found
            )}
        </div>
    );
};

export default TouristAccount;
