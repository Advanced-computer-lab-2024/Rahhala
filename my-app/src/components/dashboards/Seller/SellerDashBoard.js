import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../../context/AuthContext';
import axiosInstance from '../../../utils/axiosConfig';
import { useNavigate } from 'react-router-dom';
import NavigateButton from '../../NavigateButton';
import SellerHeader from './SellerHeader';

const SellerDashBoard = () => {
    const navigate = useNavigate();
    const { auth } = useContext(AuthContext);
    const [profile, setProfile] = useState(null);
    const [error, setError] = useState(null);
    const [message, setMessage] = useState(null);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedImage, setSelectedImage] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [updatedProfile, setUpdatedProfile] = useState({ ...profile });
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
    const [passwordData, setPasswordData] = useState({
        oldPassword: '',
        newPassword: '',
        confirmNewPassword: '',
    });

    useEffect(() => {
        if (auth.isAuthenticated && auth.user) {
            const fetchSeller = async () => {
                try {
                    const response = await axiosInstance.get(`/api/seller/`);
                    const { profile } = response.data;
                    setProfile(profile);
                } catch (err) {
                    setError('Failed to load Seller profile.');
                }
            };
            fetchSeller();
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

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUpdatedProfile((prev) => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        console.log(updatedProfile);
        const { name, files } = e.target;
        const reader = new FileReader();
        reader.onloadend = () => {
            setUpdatedProfile((prev) => ({
                ...prev,
                [name]: reader.result.split(',')[1], // Assuming you want to store the base64 string without the prefix
            }));
        };
        reader.readAsDataURL(files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axiosInstance.put('/api/seller/edit', updatedProfile);
            alert('Profile updated successfully');
            window.location.reload();
        } catch (err) {
            console.log(err);
            alert('Profile update failed');
        }
    };

    const handleChangePassword = async (e) => {
        e.preventDefault();
        if (passwordData.newPassword === passwordData.confirmNewPassword) {
            try {
                await axiosInstance.put("/api/seller/changePassword", { oldPassword: passwordData.oldPassword, newPassword: passwordData.newPassword });
                alert('Password changed successfully');
                setIsPasswordModalOpen(false);
                setPasswordData({ oldPassword: '', newPassword: '', confirmNewPassword: '' });
            } catch (err) {
                console.log(err);
                alert(err.response?.data?.message || err.response?.data?.error || 'Failed to change password');
            }
        } else {
            alert('New passwords do not match');
        }
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <SellerHeader toggleDropdown={toggleDropdown} dropdownOpen={dropdownOpen} />

            <div className="flex justify-center mt-20">

                <div className={`space-y-6 w-full ${isEditing ? 'max-w-xl' : 'max-w-md'} mx-auto p-8 bg-white shadow-lg rounded-lg text-lg`}>
                    <h2 className="text-3xl font-bold mb-6 text-center">Seller Account</h2>
                    {error && <p className="text-red-500">{error}</p>}
                    {message && <p className="text-green-500">{message}</p>}
                    {profile ? (
                        !isEditing ? (
                            <div className="profile-details space-y-4 px-5">
                                <p><strong>Username:</strong> {profile.username}</p>
                                <p><strong>Email:</strong> {profile.email}</p>
                                <p><strong>Name:</strong> {profile.name}</p>
                                <p><strong>ID Card Image:</strong></p>
                                <img
                                    src={profile.idCardImage ? `data:image/jpeg;base64,${profile.idCardImage}` : '/path/to/default/image.jpg'}
                                    alt="idCardImage"
                                    className="w-20 h-20 rounded-full"
                                    onClick={() => openModal(`data:image/jpeg;base64,${profile.idCardImage}`)}
                                />

                                <p><strong>Taxation Registry Image:</strong></p>
                                <img
                                    src={profile.taxationRegistryImage ? `data:image/jpeg;base64,${profile.taxationRegistryImage}` : '/path/to/default/image.jpg'}
                                    alt="Taxation Registry"
                                    className="w-20 h-20 rounded-full"
                                    onClick={() => openModal(`data:image/jpeg;base64,${profile.taxationRegistryImage}`)}
                                />

                                <p><strong>Logo:</strong></p>
                                {profile.logo && (
                                    <img
                                        src={profile.logo ? `data:image/jpeg;base64,${profile.logo}` : '/path/to/default/image.jpg'}
                                        alt="Logo"
                                        style={{ maxWidth: '250px', display: 'block', margin: '10px 0' }}
                                        onClick={() => openModal(`data:image/jpeg;base64,${profile.logo}`)}
                                    />
                                )}
                                <p><strong>Description:</strong> {profile.description}</p>
                                <div className="flex justify-center mt-6">
                                    <button
                                        onClick={() => {
                                            setIsEditing(true);
                                            setUpdatedProfile({ ...profile });
                                        }}
                                        className="py-2 px-4 bg-blue-500 text-white rounded-md"
                                    >
                                        Update Account
                                    </button>
                                    <button
                                        onClick={() => setIsPasswordModalOpen(true)}
                                        className="py-2 px-4 bg-white text-blue-500 border-2 border-blue-500 rounded-md ml-4"
                                    >
                                        Change Password
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-4 px-5">
                                <div className="flex flex-col gap-4">
                                    <label className="font-bold" htmlFor="email">Email:</label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={updatedProfile.email}
                                        onChange={handleInputChange}
                                        className="p-2 border rounded"
                                        required
                                    />
                                </div>
                                <div className="flex flex-col">
                                    <label className="font-bold" htmlFor="name">Name:</label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={updatedProfile.name}
                                        onChange={handleInputChange}
                                        className="p-2 border rounded"
                                        required
                                    />
                                </div>
                                <div className="flex flex-col">
                                    <label className="font-bold" htmlFor="idCardImage">ID Card Image:</label>
                                    <input
                                        type="file"
                                        id="idCardImage"
                                        name="idCardImage"
                                        accept="image/*"
                                        onChange={handleFileChange}
                                        className="p-2"
                                    />
                                </div>
                                <div className="flex flex-col">
                                    <label className="font-bold" htmlFor="taxationRegistryImage">Taxation Registry Image:</label>
                                    <input
                                        type="file"
                                        id="taxationRegistryImage"
                                        name="taxationRegistryImage"
                                        accept="image/*"
                                        onChange={handleFileChange}
                                        className="p-2"
                                    />
                                </div>
                                <div className="flex flex-col gap-4">
                                    <label className="font-bold" htmlFor="logo">Logo:</label>
                                    <input
                                        type="file"
                                        id="logo"
                                        name="logo"
                                        accept="image/*"
                                        onChange={handleFileChange}
                                        className="p-2"
                                    />
                                </div>
                                <div className="flex flex-col gap-4">
                                    <label className="font-bold" htmlFor="description">Description:</label>
                                    <textarea
                                        id="description"
                                        name="description"
                                        value={updatedProfile.description}
                                        onChange={handleInputChange}
                                        className="p-2 border rounded"
                                        required
                                    />
                                </div>
                                <div className="flex justify-center mt-6 space-x-4">
                                    <button
                                        type="submit"
                                        className="py-2 px-4 bg-blue-500 text-white rounded-md"
                                    >
                                        Save Changes
                                    </button>
                                    <button
                                        onClick={() => {
                                            setIsEditing(false);
                                            setUpdatedProfile(profile);
                                        }}
                                        type="button"
                                        className="py-2 px-4 bg-gray-500 text-white rounded-md"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        )
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
            {isPasswordModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg">
                        <h2 className="text-xl font-semibold mb-4">Change Password</h2>
                        <form onSubmit={handleChangePassword} className="space-y-4">
                            <div className="flex justify-between">
                                <label className="font-bold" htmlFor="oldPassword">Old Password:</label>
                                <input
                                    type="password"
                                    id="oldPassword"
                                    name="oldPassword"
                                    placeholder='Old Password'
                                    value={passwordData.oldPassword}
                                    onChange={(e) => setPasswordData({ ...passwordData, oldPassword: e.target.value })}
                                    className="p-2 border rounded"
                                    required
                                />
                            </div>
                            <div className="flex justify-between">
                                <label className="font-bold" htmlFor="newPassword">New Password:</label>
                                <input
                                    type="password"
                                    id="newPassword"
                                    name="newPassword"
                                    placeholder='New Password'
                                    value={passwordData.newPassword}
                                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                    className="p-2 border rounded"
                                    required
                                />
                            </div>
                            <div className="flex justify-between gap-6">
                                <label className="font-bold" htmlFor="confirmNewPassword">Confirm Password:</label>
                                <input
                                    type="password"
                                    id="confirmNewPassword"
                                    name="confirmNewPassword"
                                    placeholder='Confirm New Password'
                                    value={passwordData.confirmNewPassword}
                                    onChange={(e) => setPasswordData({ ...passwordData, confirmNewPassword: e.target.value })}
                                    className="p-2 border rounded"
                                    required
                                />
                            </div>
                            <div className="flex justify-center mt-6 space-x-4">
                                <button
                                    type="submit"
                                    className="py-2 px-4 bg-blue-500 text-white rounded-md"
                                >
                                    Change Password
                                </button>
                                <button
                                    onClick={() => {
                                        setIsPasswordModalOpen(false);
                                        setPasswordData({ oldPassword: '', newPassword: '', confirmNewPassword: '' });
                                    }}
                                    type="button"
                                    className="py-2 px-4 bg-gray-500 text-white rounded-md"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SellerDashBoard;
