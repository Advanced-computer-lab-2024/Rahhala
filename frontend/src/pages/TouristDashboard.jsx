// src/components/TouristDashboard.jsx
import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import axiosInstance from '../utils/axiosConfig'; // Ensure correct path

const TouristDashboard = () => {
    const { auth } = useContext(AuthContext);
    const [itineraries, setItineraries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchItineraries = async () => {
            if (auth.user && auth.user.id) {
                try {
                    const response = await axiosInstance.get(`/itineraries/user/${auth.user.id}`);
                    setItineraries(response.data);
                } catch (err) {
                    console.error('Error fetching itineraries:', err);
                    setError('Failed to load itineraries.');
                } finally {
                    setLoading(false);
                }
            } else {
                setLoading(false);
            }
        };

        fetchItineraries();
    }, [auth.user]);

    if (auth.loading || loading) {
        return <div>Loading user data...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div>
            <h2>Tourist Dashboard</h2>
            <p><strong>User ID:</strong> {auth.user?.id}</p>
            <p><strong>User Type:</strong> {auth.user?.type}</p>

            <h3>Your Itineraries:</h3>
            {itineraries.length > 0 ? (
                <ul>
                    {itineraries.map(itinerary => (
                        <li key={itinerary._id}>
                            <h4>{itinerary.name}</h4>
                            <p>{itinerary.description}</p>
                            {/* Add more itinerary details as needed */}
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No itineraries found.</p>
            )}
        </div>
    );
};

export default TouristDashboard;
