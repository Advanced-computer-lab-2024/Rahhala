import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import axiosInstance from '../utils/axiosConfig';
import { useNavigate, useParams } from 'react-router-dom';
import Profile from '../components/Profile'; // Import the Profile component

const TouristViewTourGuide = () => {
    const navigate = useNavigate();
    const { auth } = useContext(AuthContext); // Get auth context
    const { id } = useParams(); // Get tour guide ID from URL parameters
    const [profile, setProfile] = useState(null);
    const [error, setError] = useState(null); // State to handle errors
    const [message, setMessage] = useState(null); // State to handle success messages
    const [reviews, setReviews] = useState([]); // State to handle reviews

    useEffect(() => {
        // Only fetch profile if the user is authenticated
        if (auth.isAuthenticated && auth.user) {
            const fetchTourGuide = async () => {
                try {
                    const response = await axiosInstance.get(`/api/tourGuide/${id}`);
                    delete response.data.profile.password;
                    delete response.data.profile.createdAt;
                    delete response.data.profile.__v;
                    delete response.data.profile.updatedAt;
                    delete response.data.profile.acceptedTermsAndConditions;
                    delete response.data.profile._id;
                    delete response.data.profile.status;
                    console.log("Tourguide profile:", response.data.profile); // Log the profile data
                    setProfile(response.data.profile);
                } catch (err) {
                    setError(err.response.data.error || 'Failed to load Tourguide profile.');
                }
            };

            const fetchReviews = async () => {
                try {
                    const response = await axiosInstance.get(`/api/review/entity/TourGuide/${id}`);
                    setReviews(response.data);
                } catch (err) {
                    setError('Failed to fetch reviews.');
                }
            };

            fetchTourGuide();
            fetchReviews();
        }
    }, [auth, id]);

    const handleSubmitReview = async (e) => {
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
                reviewedEntity: id,
                reviewedEntityType: 'TourGuide'
            });
            setMessage('Review submitted successfully');
            alert('Review submitted successfully');
            setError(null); // Clear any previous errors
        } catch (err) {
            setError('Failed to submit review.');
            setMessage(null); // Clear any previous success messages
        }
    };

    const renderReviewForm = () => (
        <form onSubmit={handleSubmitReview}>
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
            {error && <p>{error}</p>}
            {message && <p>{message}</p>}
            {profile ? (
                <Profile data={profile} /> // Use the Profile component
            ) : (
                <p>Loading profile...</p>
            )}
            {renderReviewForm()}
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

export default TouristViewTourGuide;