import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import axiosInstance from '../utils/axiosConfig';

const TouristAccount = () => {
    const { auth } = useContext(AuthContext); // Get auth context
    console.log(auth);
    const [itineraries, setItineraries] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Only make API call if user is authenticated
        if (auth.isAuthenticated && auth.user) {
            const fetchTourist = async () => {
                try {
                    const response = await axiosInstance.get(`/touristAccount/${auth.user.id}`);
                    console.log("response:", response.data.profile);
                } catch (err) {
                    setError('Failed to load itineraries.');
                }
            };

            fetchTourist();
        }
    }, [auth]);

    if (auth.loading) {
        return <div>Loading user data...</div>;
    }

    if (!auth.isAuthenticated) {
        return <div>You are not authenticated.</div>;
    }

    return (
        <div>
            <h2>Tourist Account</h2>
        </div>
    );
};

export default TouristAccount;
