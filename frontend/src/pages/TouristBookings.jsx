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
                        delete res.data._id
                        delete res.data.bookingOpen
                        delete res.data.userId
                        delete res.data.createdAt
                        delete res.data.updatedAt
                        delete res.data.__v

                        return res.data;
                    }));

                    const itineraries = await Promise.all(bookedItineraries.map(async (id) => {
                        const res = await axiosInstance.get(`/api/itinerary/${id}`);
                        delete res.data._id
                        delete res.data.createdAt
                        delete res.data.updatedAt
                        delete res.data.__v

                        delete res.data.isActive
                        delete res.data.userId
                        
                        return res.data;
                    }));

                    const museums = await Promise.all(bookedMuseums.map(async (id) => {
                        const res = await axiosInstance.get(`/api/museum/${id}`);
                        delete res.data._id
                        delete res.data.createdAt
                        delete res.data.updatedAt
                        delete res.data.__v

                        delete res.data.userId
                        return res.data;
                    }));

                    setBookings({ activities, itineraries, museums });
                    console.log("itineraries: ", itineraries);
                } catch (err) {
                    setError('Failed to load bookings.');
                }
            };

            fetchBookings();
        }
    }, [auth]);
    useEffect(() => {
        // Log the updated bookings state
        console.log("Updated bookings.itineraries: ", bookings.itineraries);
    }, [bookings]);
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
            <NavigateButton path={"/touristAccount"} text={"Back"} />
            <h2>Booked Activities</h2>
            {bookings.activities.length > 0 ? (
                bookings.activities.map((activity) => (
                    <div key={activity._id}>
                        {Object.entries(activity).map(([key, value]) => (
                            <div key={key}>
                                <strong>{key}:</strong> {Array.isArray(value) ? value.join(', ') : value.toString()}
                            </div>
                        ))}
                    </div>
                ))
            ) : (
                <div>No booked activities.</div>
            )}

            <h2>Booked Itineraries</h2>
            {bookings.itineraries.length > 0 ? (
                bookings.itineraries.map((itinerary) => (
                    <div key={itinerary._id}>
                        {Object.entries(itinerary).map(([key, value]) => (
                            <div key={key}>
                                <strong>{key}:</strong> {Array.isArray(value) ? value.join(', ') : value.toString()}
                            </div>
                        ))}
                    </div>
                ))
            ) : (
                <div>No booked itineraries.</div>
            )}

            <h2>Booked Museums</h2>
            {bookings.museums.length > 0 ? (
                bookings.museums.map((museum) => (
                    <div key={museum._id}>
                        {Object.entries(museum).map(([key, value]) => (
                            <div key={key}>
                                <strong>{key}:</strong> {value}
                            </div>
                        ))}
                    </div>
                ))
            ) : (
                <div>No booked museums.</div>
            )}
            
        </div>
    );
};

export default TouristBookings;