import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import axiosInstance from '../utils/axiosConfig';
import { useNavigate } from 'react-router-dom';

const ItinerariesPage = () => {
    const [itineraries, setItineraries] = useState([]);
    const [error, setError] = useState('');
    const { auth } = useContext(AuthContext);
    const navigate = useNavigate(); // Initialize navigate

    useEffect(() => {
        if (auth.isAuthenticated && auth.user) {
            fetchItineraries();
        }
    }, [auth]);

    const fetchItineraries = async () => {
        try {
            const response = await axiosInstance.get('/getItineraries');
            console.log("response:", response.data);
            setItineraries(response.data); // Adjust based on your backend response
        } catch (err) {
            setError('Failed to fetch itineraries.');
            console.error(err);
        }
    };

    // Handle navigation back to dashboard
    const handleHomeClick = () => {
        navigate('/tourguide-dashboard'); // Replace with the correct route for your dashboard
    };

    // Render the component
    return (
        <div>
            <h2>Your Itineraries</h2>
            <button onClick={handleHomeClick}>Home</button> {/* Home Button */}
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {itineraries.length === 0 ? (
                <p>No itineraries available.</p>
            ) : (
                <ul>
                    {itineraries.map(itinerary => (
                        <li key={itinerary._id}>
                            <h4>{itinerary.name}</h4>
                            <p><strong>Timeline:</strong> {itinerary.timeline}</p>
                            <p><strong>Locations:</strong> {itinerary.location.map(loc => `(${loc[0]}, ${loc[1]})`).join(', ')}</p> {/* Displaying derived locations */}
                            <p><strong>Language:</strong> {itinerary.language}</p>
                            <p><strong>Price:</strong> ${itinerary.price}</p>
                            <p><strong>Pickup Location:</strong> {itinerary.pickupLocation}</p>
                            <p><strong>Dropoff Location:</strong> {itinerary.dropoffLocation}</p>
                            <p><strong>Available Dates:</strong> {itinerary.availableDates.join(', ')}</p>
                            <p><strong>Tags:</strong> {itinerary.tags.join(', ')}</p>
                            <h5>Activities:</h5>
                            <ul>
                                {itinerary.activityDetails.map(activity => (
                                    <li key={activity.activityId}>
                                        <strong>{activity.name}</strong> - Duration: {activity.duration}
                                    </li>
                                ))}
                            </ul>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default ItinerariesPage;
