import React, { useEffect, useState } from 'react';
import axiosInstance from '../utils/axiosConfig';
import { useNavigate } from 'react-router-dom';

const ItinerariesPage = () => {
    const navigate = useNavigate();
    const [itineraries, setItineraries] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchItineraries = async () => {
            try {
                const response = await axiosInstance.get('/api/itinerary');
                setItineraries(response.data);
            } catch (err) {
                setError('Failed to fetch itineraries.');
            }
        };

        fetchItineraries();
    }, []);

    const handleHomeClick = () => {
        navigate('/tourguide-dashboard'); // Replace with the correct route for your dashboard
    };

    const handleToggleActive = async (itineraryId, isActive) => {
        try {
            const endpoint = isActive ? `/api/itinerary/deactivate/${itineraryId}` : `/api/itinerary/activate/${itineraryId}`;
            await axiosInstance.put(endpoint);
            setItineraries(itineraries.map(itinerary =>
                itinerary._id === itineraryId ? { ...itinerary, isActive: !isActive } : itinerary
            ));
        } catch (err) {
            setError('Failed to update itinerary status.');
        }
    };

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
                            <h2>
                                {itinerary.name}
                                <button
                                    onClick={() => handleToggleActive(itinerary._id, itinerary.isActive)}
                                    style={{ marginLeft: '10px' }}
                                >
                                    {itinerary.isActive ? 'Deactivate' : 'Activate'}
                                </button>
                            </h2>
                            <p><strong>Timeline:</strong> {itinerary.timeline}</p>
                            <p><strong>Locations:</strong> {itinerary.location ? itinerary.location.map(loc => `(${loc[0]}, ${loc[1]})`).join(', ') : 'N/A'}</p> {/* Displaying derived locations */}
                            <p><strong>Language:</strong> {itinerary.language}</p>
                            <p><strong>Price:</strong> ${itinerary.price}</p>
                            <p><strong>Pickup Location:</strong> {itinerary.pickupLocation}</p>
                            <p><strong>Dropoff Location:</strong> {itinerary.dropoffLocation}</p>
                            <p><strong>Available Dates:</strong> {itinerary.availableDates ? itinerary.availableDates.join(', ') : 'N/A'}</p>
                            <p><strong>Tags:</strong> {itinerary.tags ? itinerary.tags.join(', ') : 'N/A'}</p>
                            <h5>Activities:</h5>
                            <ul>
                                {itinerary.activityDetails && itinerary.activityDetails.length > 0 ? (
                                    itinerary.activityDetails.map(activity => (
                                        <li key={activity.activityId}>
                                            <strong>{activity.name}</strong> - Duration: {activity.duration} - Location: ({activity.location[0]}, {activity.location[1]}) - Time: {activity.time}
                                        </li>
                                    ))
                                ) : (
                                    <li>No activities available.</li>
                                )}
                            </ul>
                            <p><strong>ID:</strong> {itinerary._id}</p>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default ItinerariesPage;
