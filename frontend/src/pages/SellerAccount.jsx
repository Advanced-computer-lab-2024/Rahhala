import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import axiosInstance from '../utils/axiosConfig';
import { useNavigate } from 'react-router-dom';
import NavigateButton from '../components/UpdateProfileButton';
import Logout from '../components/Auth/Logout';

const SellerAccount = () => {
    const navigate = useNavigate();
    const { auth } = useContext(AuthContext); // Get auth context
    if (!auth.isAuthenticated) {
        navigate('/login');
    }
    const [profile, setProfile] = useState(null); 
    const [error, setError] = useState(null); // State to handle errors
    const [message, setMessage] = useState(null); // State to handle success messages

    useEffect(() => {
        // Only fetch profile if the user is authenticated
        if (auth.isAuthenticated && auth.user) {
            const fetchSeller = async () => {
                try {
                    const response = await axiosInstance.get('api/seller/');
                    delete response.data.profile._id;
                    delete response.data.profile.password;
                    delete response.data.profile.createdAt;
                    delete response.data.profile.__v;
                    delete response.data.profile.updatedAt;
                    setProfile(response.data.profile);
                } catch (err) {
                    setError('Error fetching seller profile');
                }
            };
            fetchSeller();
        }
    }, [auth]);

    const handleAccountDeletionRequest = async () => {
        try {
            const response = await axiosInstance.post('api/accountDeletionRequest/');
            setMessage('Account deletion request submitted successfully');
            setError(null); // Clear any previous errors
        } catch (err) {
            setError(err.response?.data?.error || 'Error submitting account deletion request');
        }
    };

    return (
        <div>
            <h1>Seller Account</h1>
            {error && <p>{error}</p>}
            {message && <p>{message}</p>}
            {profile && (
                <div>
                    <p>Username: {profile.username}</p>
                    <p>Email: {profile.email}</p>
                    <p>Name: {profile.name}</p>
                    <p>Description: {profile.description}</p>
                    {profile.logo && (
                        <div>
                            <p>Logo:</p>
                            <img
                                src={`data:image/jpeg;base64,${profile.logo}`}
                                alt="Logo"
                                style={{ width: '100px', height: '100px' }}
                            />
                        </div>
                    )}
                    <button onClick={handleAccountDeletionRequest}>Request My Account to be Deleted</button>
                </div>
            )}
            <NavigateButton path='/updateSellerAccount' text='Update Account'/>{'\u00A0'} 
            <NavigateButton path={"/seller-dashboard"} text={"Home"}/>{'\u00A0'}

            <Logout />
        </div>
    );
};

export default SellerAccount;