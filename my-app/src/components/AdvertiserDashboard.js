import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import axiosInstance from '../utils/axiosConfig';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import NavigateButton from '../components/NavigateButton';

const AdvertiserDashboard = () => {
    const navigate = useNavigate();
    const { auth } = useContext(AuthContext); // Get auth context
    const [profile, setProfile] = useState(null);
    const [error, setError] = useState(null); // State to handle errors
    const [message, setMessage] = useState(null); // State to handle success messages
    const [deletionRequested, setDeletionRequested] = useState(false); // State to track if deletion was requested
    const [requestId, setRequestId] = useState(null); // State to store the request ID
    const [dropdownOpen, setDropdownOpen] = useState(false);

    useEffect(() => {
        if (!auth.isAuthenticated) {
            navigate('/login');
        }

        

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

        // Fetch profile
        const fetchProfile = async () => {
            try {
                const response = await axiosInstance.get(`/api/advertiser/${auth.user.id}`);
                setProfile(response.data.profile);
            } catch (err) {
                setError('Failed to load profile.');
            }
        };

        if (auth.isAuthenticated && auth.user) {
            fetchProfile();
        }
    }, [auth, navigate]);

    

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

    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <Header toggleDropdown={toggleDropdown} dropdownOpen={dropdownOpen} />
            <div className="max-w-4xl mx-auto p-6">
                <h2 className="text-2xl font-bold mb-4">Advertiser Dashboard</h2>
                {error && <p className="text-red-500">{error}</p>}
                {message && <p className="text-green-500">{message}</p>}
                {profile && (
                    <div className="space-y-4">
                        <div>
                            <strong>Logo:</strong>
                            {profile.logo && (
                                <img
                                    src={profile.logo}
                                    alt="Logo"
                                    style={{ maxWidth: '200px', display: 'block', margin: '10px 0' }}
                                />
                            )}
                        </div>
                    </div>
                )}
                <div className="flex flex-wrap justify-between space-y-4">
                    <NavigateButton path="/advertiserAccount" text="View Account" />
                    <NavigateButton path="/updateAdvertiserAccount" text="Update Account" />
                    <NavigateButton path="/getActivities" text="Manage Activities" />
                    <NavigateButton path="/createActivity" text="Create Activity" />
                    <NavigateButton path="/getMyActivities" text="View My Activities" />
                    {deletionRequested ? (
                        <button
                            onClick={handleCancelDeletionRequest}
                            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
                        >
                            Cancel Account Deletion Request
                        </button>
                    ) : (
                        <button
                            onClick={handleAccountDeletionRequest}
                            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
                        >
                            Request My Account to be Deleted
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdvertiserDashboard;