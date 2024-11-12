import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import axiosInstance from '../utils/axiosConfig';
import { useNavigate } from 'react-router-dom';
import NavigateButton from '../components/UpdateProfileButton';
import Logout from '../components/Auth/Logout';

const AdvertiserAccount = () => {
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
            const fetchAdvertiser = async () => {
                try {
                    const response = await axiosInstance.get(`/api/advertiser/${auth.user.id}`);
                    const { profile } = response.data;
                    delete profile._id;
                    delete profile.password;
                    delete profile.createdAt;
                    delete profile.__v;
                    delete profile.updatedAt;
                    delete profile.acceptedTermsAndConditions;
                    setProfile(profile);
                } catch (err) {
                    setError('Failed to load Advertiser profile.');
                }
            };

            fetchAdvertiser();
        }
    }, [auth]);

    const isImageLink = (value) => {
        return value.startsWith('http') || value.startsWith('https') || value.startsWith('www');
    };

    return (
        <div>
            <h2>Advertiser Account</h2>
            {error && <p className="error">{error}</p>}
            {message && <p>{message}</p>}
            {profile ? (
                <div className="profile-details">
                    {Object.entries(profile).map(([key, value]) => (
                        key === 'companyProfile' || key === 'taxationRegistryImage' || key === 'idCardImage' || key === 'logo' ? (
                            <div key={key}>
                                <strong>{key}:</strong>
                                {isImageLink(value) ? (
                                    <img src={value} alt={`${key}`} style={{ maxWidth: '200px', display: 'block', margin: '10px 0' }} />
                                ) : (
                                    <img src={`data:image/jpeg;base64,${value}`} alt={`${key}`} style={{ maxWidth: '200px', display: 'block', margin: '10px 0' }} />
                                )}
                            </div>
                        ) : (
                            <p key={key}><strong>{key}:</strong> {value}</p>
                        )
                    ))}
                </div>
            ) : (
                <p>Loading profile...</p>
            )}
            <div className="navigation-buttons">
                <NavigateButton path="/updateAdvertiserAccount" text="Update Profile" />
                <NavigateButton path="/advertiser-dashboard" text="Home" />
                <Logout />
            </div>
        </div>
    );
};

export default AdvertiserAccount;