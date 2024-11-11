import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import axiosInstance from '../utils/axiosConfig';
import { useNavigate } from 'react-router-dom';
import NavigateButton from '../components/UpdateProfileButton';
import Logout from '../components/Auth/Logout';

const AdvertiserDashboard = () => {
    const navigate = useNavigate();
    const { auth } = useContext(AuthContext); // Get auth context
    if (!auth.isAuthenticated) {
        navigate('/login');
    }
    const [error, setError] = useState(null); // State to handle errors
    const [message, setMessage] = useState(null); // State to handle success messages
    const [deletionRequested, setDeletionRequested] = useState(false); // State to track if deletion was requested
    const [requestId, setRequestId] = useState(null); // State to store the request ID

    useEffect(() => {
        // Check if the user has already requested account deletion
        const checkDeletionRequest = async () => {
            try {
                const response = await axiosInstance.get('/api/accountDeletionRequest/');
                const userRequest = response.data.find(request => request.userId === auth.user.id);
                if (userRequest) {
                    setDeletionRequested(true);
                    setRequestId(userRequest._id);
                } else {
                    setDeletionRequested(false);
                }
            } catch (err) {
                setError('Failed to check account deletion request status.');
            }
        };

        if (auth.isAuthenticated && auth.user) {
            checkDeletionRequest();
        }
    }, [auth]);

    const handleAccountDeletionRequest = async () => {
        try {
            const response = await axiosInstance.post('/api/accountDeletionRequest/');
            setMessage('Account deletion request submitted successfully');
            setError(null); // Clear any previous errors
            setDeletionRequested(true); // Update the state to reflect the deletion request
            setRequestId(response.data._id); // Store the request ID
        } catch (err) {
            setError(err.response?.data?.error || 'Error submitting account deletion request');
        }
    };

    const handleCancelDeletionRequest = async () => {
        try {
            await axiosInstance.delete(`/api/accountDeletionRequest/${requestId}`);
            setMessage('Account deletion request canceled successfully');
            setError(null); // Clear any previous errors
            setDeletionRequested(false); // Update the state to reflect the cancellation
            setRequestId(null); // Clear the request ID
        } catch (err) {
            setError(err.response?.data?.error || 'Error canceling account deletion request');
        }
    };

    return (
        <div>
            <h2>Advertiser Dashboard</h2>
            {error && <p className="error">{error}</p>}
            {message && <p>{message}</p>}
            <NavigateButton path="/advertiserAccount" text="View Account" />{' '}
            <NavigateButton path="/updateAdvertiserAccount" text="Update Account" />{' '}
            <NavigateButton path="/getActivities" text="Manage Activities" />{' '}
            <NavigateButton path="/createActivity" text="Create Activity" />{' '}
            <NavigateButton path="/getMyActivities" text="View My Activities" />{' '}
            {deletionRequested ? (
                <button onClick={handleCancelDeletionRequest}>Cancel Account Deletion Request</button>
            ) : (
                <button onClick={handleAccountDeletionRequest}>Request My Account to be Deleted</button>
            )}
            <Logout />
        </div>
    );
};

export default AdvertiserDashboard;