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
            const fetchTourist = async () => {
                try {
                    const response = await axiosInstance.get(`/touristAccount/${auth.user.id}`);
                    console.log("response:", response.data.profile);
                } catch (err) {
                    setError('Failed to load tourist profile.');
                }
            };

            fetchTourist();
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
            {error && <p>{error}</p>}
            {itineraries ? (
                <ul>
                    {itineraries.map((itinerary) => (
                        <li key={itinerary._id}>{itinerary.name}</li>
                    ))}
                </ul>
            ) : (
                <p>No itineraries found.</p>
            )}
        </div>
    );
};

export default TouristAccount;
