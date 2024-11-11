import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import axiosInstance from '../utils/axiosConfig';
import NavigateButton from '../components/UpdateProfileButton';
import '../table.css';

const GetItinerary = () => {
    const { id } = useParams(); // Get the itinerary ID from the URL parameters
    const [itinerary, setItinerary] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [error, setError] = useState('');
    const [bookingMessage, setBookingMessage] = useState('');
    const { auth } = useContext(AuthContext); // Get auth context
    let homePath;
    if (auth.user && auth.user.type === 'tourist') {
        homePath = '/touristItineraries';
    }
    else {
        homePath = '/advertiser-dashboard';
    }

    useEffect(() => {
        const fetchItinerary = async () => {
            try {
                const response = await axiosInstance.get(`/api/itinerary/${id}`);
                setItinerary(response.data);
            } catch (err) {
                setError('Failed to fetch itinerary');
            }
        };

        // Fetch itinerary reviews
        const fetchReviews = async () => {
            try {
                const response = await axiosInstance.get(`/api/review/entity/Itinerary/${id}`);
                setReviews(response.data);
            } catch (err) {
                setError(err.response.data.message);
            }
        };

        fetchItinerary();
        fetchReviews();
    }, [id]);

    const handleBookItinerary = async () => {
        try {
            const response = await axiosInstance.post('/api/tourist/bookItinerary', { itineraryId: id });
            setBookingMessage('Itinerary booked successfully!');
        } catch (err) {
            setBookingMessage(err.response.data.error);
        }
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(window.location.href)
            .then(() => {
                alert('Link copied to clipboard!');
            })
            .catch(err => {
                console.error('Failed to copy: ', err);
            });
    };

    return (
        <div>
            {itinerary ? (
                <div>
                    <h1>{itinerary.name}</h1>
                    <p><strong>Price:</strong> {itinerary.price}</p>
                    <p><strong>Timeline:</strong> {itinerary.timeline}</p>
                    <p><strong>Language:</strong> {itinerary.language}</p>
                    <p><strong>Pickup Location:</strong> {itinerary.pickupLocation}</p>
                    <p><strong>Dropoff Location:</strong> {itinerary.dropoffLocation}</p>
                    <p><strong>Tags:</strong> {itinerary.tags.join(', ')}</p>
                    <p><strong>Accessibility:</strong> {itinerary.accessibility.join(', ')}</p>
                    <p><strong>Available Dates:</strong> {itinerary.availableDates.map(date => new Date(date).toLocaleDateString()).join(', ')}</p>
                    <p><strong>Activity Details:</strong></p>
                    <ul>
                        {itinerary.activityDetails.map((activity, index) => (
                            <li key={index}>
                                <p><strong>Name:</strong> {activity.name}</p>
                                <p><strong>Location:</strong> {activity.location.join(', ')}</p>
                                <p><strong>Duration:</strong> {activity.duration}</p>
                                <p><strong>Time:</strong> {activity.time}</p>
                            </li>
                        ))}
                    </ul>
                    <button onClick={handleBookItinerary}>Book Itinerary</button>
                    {bookingMessage && <p>{bookingMessage}</p>}
                </div>
            ) : (
                <div>Loading itinerary...</div>
            )}
            {error && <div>{error}</div>}
            <NavigateButton path={homePath} text='Back'/>{'\u00A0'}
            <button onClick={copyToClipboard}>Copy Link</button>

            <div>
                <h2>Reviews</h2>
                {reviews.length > 0 ? (
                    reviews.map(review => (
                        <div key={review._id}>
                            <p><strong>Rating:</strong> {review.rating}</p>
                            <p><strong>Title:</strong> {review.title}</p>
                            <p><strong>Body:</strong> {review.body}</p>
                            <p><strong>Reviewed By:</strong> {review.tourist}</p>
                        </div>
                    ))
                ) : (
                    <p>No reviews available</p>
                )}
            </div>
        </div>
    );
};

export default GetItinerary;