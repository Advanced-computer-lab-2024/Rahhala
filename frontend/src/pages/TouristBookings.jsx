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
                        const res = await axiosInstance.get(`/api/activity/${id}`);
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
            <NavigateButton path={"/touristAccount"} text={"Back"} />{' '}

            <h2>Booked Activities</h2>
            {bookings.activities.length > 0 ? (
                bookings.activities.map((activity) => (
                    <div key={activity._id}>
                        <strong>{activity.name}</strong>
                        <p>{activity.date}</p>
                        <p>{activity.location.join(', ')}</p>
                        <p>{activity.price}</p>
                    </div>
                ))
            ) : (
                <div>No booked activities.</div>
            )}

            <h2>Booked Itineraries</h2>
            {bookings.itineraries.length > 0 ? (
                bookings.itineraries.map((itinerary) => (
                    <div key={itinerary._id}>
                        <strong>{itinerary.name}</strong>
                        <p>{itinerary.timeline}</p>
                        <p>{itinerary.price}</p>
                    </div>
                ))
            ) : (
                <div>No booked itineraries.</div>
            )}

            <h2>Booked Museums</h2>
            {bookings.museums.length > 0 ? (
                bookings.museums.map((museum) => (
                    <div key={museum._id}>
                        <strong>{museum.name}</strong>
                        <p>{museum.location}</p>
                        <p>{museum.foreignerPrice}</p>
                    </div>
                ))
            ) : (
                <div>No booked museums.</div>
            )}
        </div>
    );
};

export default TouristBookings;