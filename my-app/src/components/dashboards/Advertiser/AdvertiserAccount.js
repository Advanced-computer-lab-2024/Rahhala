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
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedImage, setSelectedImage] = useState('');

    useEffect(() => {

        // Only fetch profile if the user is authenticated
        if (auth.isAuthenticated && auth.user) {
            const fetchAdvertiser = async () => {
                try {
                    const response = await axiosInstance.get(`/api/advertiser/${auth.user.id}`);
                    const { profile } = response.data;
                    setProfile(profile);
                } catch (err) {
                    setError('Failed to load Advertiser profile.');
                }
            };
            fetchAdvertiser();
        }
    }, [auth, navigate]);

    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    };

    const openModal = (image) => {
        setSelectedImage(image);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedImage('');
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <Header toggleDropdown={toggleDropdown} dropdownOpen={dropdownOpen} />
            <button
                onClick={() => navigate(-1)}
                className="text-blue-500 mt-4 ml-4 flex items-center"
            >
                ← Back
            </button>

            <div className="flex justify-center mt-20">
                <div className="space-y-4 max-w-md mx-auto p-6 bg-white shadow-lg rounded-lg text-sm">
                    <h2 className="text-2xl font-bold mb-4 text-center">Advertiser Account</h2>
                    {error && <p className="text-red-500">{error}</p>}
                    {message && <p className="text-green-500">{message}</p>}
                    {profile ? (
                        <div className="profile-details">
                            <p><strong>Username:</strong> {profile.username}</p>
                            <p><strong>Email:</strong> {profile.email}</p>
                            <p><strong>Website Link:</strong> {profile.websiteLink}</p>
                            <p><strong>Hotline:</strong> {profile.hotline}</p>
                            <p><strong>ID Card Image:</strong></p>
                            <img
                                src={profile.idCardImage ? `data:image/jpeg;base64,${profile.idCardImage}` : '/path/to/default/image.jpg'}
                                alt="idCardImage"
                                className="w-16 h-16 rounded-full"
                                onClick={() => openModal(`data:image/jpeg;base64,${profile.idCardImage}`)}
                            />

                            <p><strong>Taxation Registry Image:</strong></p>
                            <img
                                src={profile.taxationRegistryImage ? `data:image/jpeg;base64,${profile.taxationRegistryImage}` : '/path/to/default/image.jpg'}
                                alt="Taxation Registry"
                                className="w-16 h-16 rounded-full"
                                onClick={() => openModal(`data:image/jpeg;base64,${profile.taxationRegistryImage}`)}
                            />

                            <p><strong>Logo:</strong></p>
                            {profile.logo && (
                                <img
                                    src={profile.logo}
                                    alt="Logo"
                                    style={{ maxWidth: '200px', display: 'block', margin: '10px 0' }}
                                    onClick={() => openModal(profile.logo)}
                                />
                            )}
                            <div className="flex justify-center mt-4">
                                <NavigateButton path="/updateAdvertiserAccount" text="Update Account" />
                            </div>
                        </div>
                    ) : (
                        <p>Loading profile...</p>
                    )}
                </div>
            </div>
            {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white p-4 rounded-lg">
                        <img src={selectedImage} alt="Enlarged" className="max-w-full max-h-full" />
                        <button onClick={closeModal} className="mt-4 px-4 py-2 bg-red-500 text-white rounded-md">
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdvertiserAccount;