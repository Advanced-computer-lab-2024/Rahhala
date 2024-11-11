import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import axiosInstance from '../utils/axiosConfig';
import NavigateButton from '../components/UpdateProfileButton';
import '../table.css';

const GetActivity = () => {
    const { id } = useParams(); // Get the activity ID from the URL parameters
    const [activity, setActivity] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [error, setError] = useState('');
    const [bookingMessage, setBookingMessage] = useState('');
    const { auth } = useContext(AuthContext); // Get auth context
    let homePath;
    if (auth.user && auth.user.type === 'tourist') {
        homePath = '/getActivities';
    }
    else {
        homePath = '/advertiser-dashboard';
    }

    useEffect(() => {
        const fetchActivity = async () => {
            try {
                const response = await axiosInstance.get(`/api/activity/getActivity/${id}`);
                console.log(response.data);
                setActivity(response.data);
            } catch (err) {
                setError('Failed to fetch activity');
            }
        };

        // Fetch activity reviews
        const fetchReviews = async () => {
            try {
                const response = await axiosInstance.get(`/api/review/entity/Activity/${id}`);
                setReviews(response.data);
            } catch (err) {
                setError(err.response.data.message);
            }
        };

        fetchActivity();
        fetchReviews();
    }, [id]);

    const handleBookActivity = async () => {
        try {
            const response = await axiosInstance.post('/api/tourist/bookActivity', { activityId: id });
            setBookingMessage('Activity booked successfully!');
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
            {activity ? (
                <div>
                    <h1>{activity.name}</h1>
                    <p><strong>Price:</strong> {activity.price}</p>
                    <p><strong>Date:</strong> {new Date(activity.date).toLocaleDateString()}</p>
                    <p><strong>Time:</strong> {activity.time}</p>
                    <p><strong>Location:</strong> {activity.location.join(', ')}</p>
                    <p><strong>Category:</strong> {activity.category}</p>
                    <p><strong>Tags:</strong> {activity.tags.join(', ')}</p>
                    <p><strong>Special Discounts:</strong> {activity.specialDiscounts}</p>
                    <p><strong>Booking Open:</strong> {activity.bookingOpen ? 'Yes' : 'No'}</p>
                    <button onClick={handleBookActivity}>Book Activity</button>
                    {bookingMessage && <p>{bookingMessage}</p>}
                </div>
            ) : (
                <div>Loading activity...</div>
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

export default GetActivity;