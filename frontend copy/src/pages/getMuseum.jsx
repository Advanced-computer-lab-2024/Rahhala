import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import axiosInstance from '../utils/axiosConfig';
import NavigateButton from '../components/UpdateProfileButton';
import '../table.css';

const GetMuseum = () => {
    const { id } = useParams(); // Get the museum ID from the URL parameters
    const [museum, setMuseum] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [error, setError] = useState('');
    const { auth } = useContext(AuthContext); // Get auth context
    let homePath;
    if (auth.user && auth.user.type === 'tourist') {
        homePath = '/getMuseums';
    }
    else {
        homePath = '/advertiser-dashboard';
    }

    useEffect(() => {
        const fetchMuseum = async () => {
            try {
                const response = await axiosInstance.get(`/api/museum/${id}`);
                setMuseum(response.data);
            } catch (err) {
                setError('Failed to fetch museum');
            }
        };

        // Fetch museum reviews
        const fetchReviews = async () => {
            try {
                const response = await axiosInstance.get(`/api/review/entity/Museum/${id}`);
                setReviews(response.data);
            } catch (err) {
                setError(err.response.data.message);
            }
        };

        fetchMuseum();
        fetchReviews();
    }, [id]);

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
            {museum ? (
                <div>
                    <h1>{museum.name}</h1>
                    <p><strong>Description:</strong> {museum.description}</p>
                    <p><strong>Location:</strong> {museum.location}</p>
                    <p><strong>Opening Hours:</strong> {museum.openingHours}</p>
                    <p><strong>Foreigner Price:</strong> {museum.foreignerPrice}</p>
                    <p><strong>Native Price:</strong> {museum.nativePrice}</p>
                    <p><strong>Student Price:</strong> {museum.studentPrice}</p>
                    <div>
                        <strong>Pictures:</strong>
                        {museum.pictures.map((picture, index) => (
                            <img key={index} src={picture} alt={`Museum ${index}`} style={{ width: '200px', height: 'auto' }} />
                        ))}
                    </div>
                </div>
            ) : (
                <div>Loading museum...</div>
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

export default GetMuseum;