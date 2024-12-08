import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../../context/AuthContext';
import axiosInstance from '../../../utils/axiosConfig';
import { useNavigate } from 'react-router-dom';
import Header from '../../Header';
import NavigateButton from '../../NavigateButton';

const AdvertiserAccount = () => {
    const navigate = useNavigate();
    const { auth } = useContext(AuthContext); // Get auth context
    const [profile, setProfile] = useState(null); 
    const [error, setError] = useState(null); // State to handle errors
    const [message, setMessage] = useState(null); // State to handle success messages
    const [dropdownOpen, setDropdownOpen] = useState(false);

    useEffect(() => {
        if (!auth.isAuthenticated) {
            navigate('/login');
        }

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
    }, [auth, navigate]);

    const isImageLink = (value) => {
        return value.startsWith('http') || value.startsWith('https') || value.startsWith('www');
    };

    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <Header toggleDropdown={toggleDropdown} dropdownOpen={dropdownOpen} />
            <div className="flex justify-center mt-20">
                <div className="space-y-4 max-w-md mx-auto p-6 bg-white shadow-lg rounded-lg text-sm">
                    <h2 className="text-2xl font-bold mb-4 text-center">Advertiser Account</h2>
                    {error && <p className="text-red-500">{error}</p>}
                    {message && <p className="text-green-500">{message}</p>}
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
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdvertiserAccount;