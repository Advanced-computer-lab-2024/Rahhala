import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import axiosInstance from '../utils/axiosConfig';
import NavigateButton from '../components/UpdateProfileButton';
import { useNavigate } from 'react-router-dom';

const TouristBookings = () => {
    const navigate = useNavigate();
    const { auth } = useContext(AuthContext); // Get auth context
    const [bookings, setBookings] = useState({
        activities: [],
        itineraries: [],
        museums: []
    });
    const [error, setError] = useState(null); // State to handle errors

    useEffect(() => {
        // Only fetch bookings if the user is authenticated
        if (auth.isAuthenticated && auth.user) {
            const fetchBookings = async () => {
                try {
                    const response = await axiosInstance.get('/api/tourist/');
                    const { bookedActivities, bookedItineraries, bookedMuseums } = response.data.profile;

                    const activities = await Promise.all(bookedActivities.map(async (id) => {
                        const res = await axiosInstance.get(`/api/activity/getActivity/${id}`);
                        return res.data;
                    }));

                    const itineraries = await Promise.all(bookedItineraries.map(async (id) => {
                        const res = await axiosInstance.get(`/api/itinerary/${id}`);
                        return res.data;
                    }));

                    const museums = await Promise.all(bookedMuseums.map(async (id) => {
                        const res = await axiosInstance.get(`/api/museum/${id}`);
                        return res.data;
                    }));

                    setBookings({ activities, itineraries, museums });
                } catch (err) {
                    setError('Failed to load bookings.');
                }
            };

            fetchBookings();
        }
    }, [auth]);

    const handleUnbookActivity = async (activityId) => {
        try {
            await axiosInstance.put('/api/tourist/cancelActivityBooking', { activityId });
            setBookings((prevBookings) => ({
                ...prevBookings,
                activities: prevBookings.activities.filter(activity => activity._id !== activityId)
            }));
        } catch (err) {
            setError(err.response.data.error);
        }
    };

    const handleUnbookItinerary = async (itineraryId) => {
        try {
            await axiosInstance.put('/api/tourist/cancelItineraryBooking', { itineraryId });
            setBookings((prevBookings) => ({
                ...prevBookings,
                itineraries: prevBookings.itineraries.filter(itinerary => itinerary._id !== itineraryId)
            }));
        } catch (err) {
            setError(err.response.data.error);
        }
    };

    const handleUnbookMuseum = async (museumId) => {
        try {
            await axiosInstance.put('/api/tourist/cancelMuseumBooking', { museumId });
            setBookings((prevBookings) => ({
                ...prevBookings,
                museums: prevBookings.museums.filter(museum => museum._id !== museumId)
            }));
        } catch (err) {
            setError(err.response.data.error);
        }
    };

    const isPastDate = (date) => {
        return new Date(date) < new Date();
    };

    const handleSubmitReview = async (e, entityId, entityType) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const rating = formData.get('rating');
        const title = formData.get('title');
        const body = formData.get('body');

        try {
            await axiosInstance.post('/api/review', {
                rating,
                title,
                body,
                reviewedEntity: entityId,
                reviewedEntityType: entityType
            });
            alert('Review submitted successfully');
            window.location.reload();
        } catch (err) {
            setError('Failed to submit review.');
        }
    };

    const renderReviewForm = (entityId, entityType) => (
        <form onSubmit={(e) => handleSubmitReview(e, entityId, entityType)}>
            <div>
                <label>Rating:</label>
                <input type="number" name="rating" min="0" max="5" required />
            </div>
            <div>
                <label>Title:</label>
                <input type="text" name="title" />
            </div>
            <div>
                <label>Body:</label>
                <textarea name="body"></textarea>
            </div>
            <button type="submit">Submit Review</button>
        </form>
    );

    return (
        <div>
            <NavigateButton path={"/touristAccount"} text={"Back"} />
            <h2>Booked Activities</h2>
            {bookings.activities.length > 0 ? (
                bookings.activities.map((activity) => (
                    <div key={activity._id} style={{ border: '1px solid #ccc', padding: '10px', marginBottom: '10px' }}>
                        {Object.entries(activity).map(([key, value]) => (
                            <div key={key}>
                                <strong>{key}:</strong> {Array.isArray(value) ? value.join(', ') : value.toString()}
                            </div>
                        ))}
                        {isPastDate(activity.date) ? (
                            <div>
                                <div style={{ color: 'green', fontWeight: 'bold' }}>Done</div>
                                {renderReviewForm(activity._id, 'Activity')}
                            </div>
                        ) : (
                            <button onClick={() => handleUnbookActivity(activity._id)} style={{ backgroundColor: 'red', color: 'white' }}>Unbook</button>
                        )}
                    </div>
                ))
            ) : (
                <div>No booked activities.</div>
            )}

            <h2>Booked Itineraries</h2>
            {bookings.itineraries.length > 0 ? (
                bookings.itineraries.map((itinerary) => (
                    <div key={itinerary._id} style={{ border: '1px solid #ccc', padding: '10px', marginBottom: '10px' }}>
                        {Object.entries(itinerary).map(([key, value]) => (
                            <div key={key}>
                                <strong>{key}:</strong> {Array.isArray(value) ? value.join(', ') : value.toString()}

                            </div>
                            
                        ))}
                        {isPastDate(itinerary.availableDates[itinerary.availableDates.length - 1]) ? (
                            <div>
                                <div style={{ color: 'green', fontWeight: 'bold' }}>Done</div>
                                {renderReviewForm(itinerary._id, 'Itinerary')}
                                <NavigateButton path={"/viewTourGuide/"+itinerary.userId} text={"View Tour Guide"} />

                            </div>
                        ) : (
                            <button onClick={() => handleUnbookItinerary(itinerary._id)} style={{ backgroundColor: 'red', color: 'white' }}>Unbook</button>
                        )}

                    </div>
                ))
            ) : (
                <div>No booked itineraries.</div>
            )}

            <h2>Booked Museums</h2>
            {bookings.museums.length > 0 ? (
                bookings.museums.map((museum) => (
                    <div key={museum._id} style={{ border: '1px solid #ccc', padding: '10px', marginBottom: '10px' }}>
                        {Object.entries(museum).map(([key, value]) => (
                            <div key={key}>
                                <strong>{key}:</strong> {Array.isArray(value) ? value.join(', ') : value.toString()}
                            </div>
                        ))}
                        {isPastDate(museum.openingHours) ? (
                            <div>
                                <div style={{ color: 'green', fontWeight: 'bold' }}>Done</div>
                                {renderReviewForm(museum._id, 'Museum')}
                            </div>
                        ) : (
                            <button onClick={() => handleUnbookMuseum(museum._id)} style={{ backgroundColor: 'red', color: 'white' }}>Unbook</button>
                        )}
                    </div>
                ))
            ) : (
                <div>No booked museums.</div>
            )}
            {error && <div style={{ color: 'red', fontWeight: 'bold' }}>{error}</div>}
        </div>
    );
};

export default TouristBookings;