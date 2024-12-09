import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../../context/AuthContext';
import axiosInstance from '../../../utils/axiosConfig';
import { useNavigate } from 'react-router-dom';
import { SpinnerCircular } from 'spinners-react';
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
    const [toast, setToast] = useState({ show: false, message: '', type: '' });
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    const showToast = (message, type = 'info') => {
        setToast({ show: true, message, type });
        setTimeout(() => setToast({ show: false, message: '', type: '' }), 3000);
    };

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
        const { name, files } = e.target;
        if (files[0].size > 5000000) {
            showToast('Image size should be less than 5MB', 'error');
            return;
        }
        const reader = new FileReader();
        reader.onloadend = () => {
            setUpdatedProfile((prev) => ({
                ...prev,
                [name]: reader.result.split(',')[1],
            }));
            showToast('Image uploaded successfully', 'success');
        };
        reader.onerror = () => {
            showToast('Failed to process image', 'error');
        };
        reader.readAsDataURL(files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axiosInstance.put('/api/seller/edit', updatedProfile);
            showToast('Profile updated successfully', 'success');
            window.location.reload();
        } catch (err) {
            console.log(err);
            showToast('Profile update failed', 'error');
        }
    };

    const handleChangePassword = async (e) => {
        e.preventDefault();
        if (passwordData.newPassword === passwordData.confirmNewPassword) {
            try {
                await axiosInstance.put("/api/seller/changePassword", { oldPassword: passwordData.oldPassword, newPassword: passwordData.newPassword });
                showToast('Password changed successfully', 'success');
                setIsPasswordModalOpen(false);
                setPasswordData({ oldPassword: '', newPassword: '', confirmNewPassword: '' });
            } catch (err) {
                console.log(err);
                showToast(err.response?.data?.message || err.response?.data?.error || 'Failed to change password', 'error');
            }
        } else {
            showToast('New passwords do not match', 'error');
        }
    };

    const handleDeleteAccount = async () => {
        try {
            await axiosInstance.post('/api/seller/request-delete');
            showToast('Account deletion request submitted successfully', 'success');
            setIsDeleteModalOpen(false);
        } catch (error) {
            showToast(error.response?.data?.error || 'Failed to request account deletion', 'error');
        }
    };

    const Toast = ({ message, type }) => (
        <div className="fixed top-4 right-4 z-50 animate-fade-in-down">
            <div className={`rounded-lg px-4 py-3 shadow-lg ${type === 'success' ? 'bg-green-100 text-green-700 border border-green-200' :
                type === 'error' ? 'bg-red-100 text-red-700 border border-red-200' :
                    'bg-blue-100 text-blue-700 border border-blue-200'
                }`}>
                <div className="flex items-center space-x-3">
                    {type === 'success' ? (
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                    ) : (
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                    )}
                    <p className="font-medium">{message}</p>
                </div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-100">
            <SellerHeader toggleDropdown={toggleDropdown} dropdownOpen={dropdownOpen} />

            <div className="container mx-auto px-4 mt-4">
                <button
                    onClick={() => navigate(-1)}
                    className="text-blue-500 mb-4 flex items-center"
                >
                    ← Back
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column - Profile Picture & Basic Info */}
                    <div className="space-y-6">
                        <div className="bg-white rounded-lg shadow-lg p-6 text-center">
                            <div className="relative w-40 h-40 mx-auto">
                                <img
                                    src={profile?.logo ? `data:image/jpeg;base64,${profile.logo}` : '/default-logo.png'}
                                    alt="Store Logo"
                                    className="w-full h-full rounded-full cursor-pointer border-4 border-blue-500 mb-4 object-cover"
                                    onClick={() => openModal(profile?.logo ? `data:image/jpeg;base64,${profile.logo}` : '/default-logo.png')}
                                />
                                {isEditing && (
                                    <label className="absolute bottom-0 right-0 cursor-pointer p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-all duration-200">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            name="logo"
                                            onChange={handleFileChange}
                                            className="hidden"
                                        />
                                    </label>
                                )}
                            </div>
                            <h2 className="text-2xl font-bold mb-2">{profile?.name || 'Store Name'}</h2>
                            <p className="text-gray-600">{profile?.email}</p>
                        </div>
                    </div>

                    {/* Right Column - Profile Information */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-lg shadow-lg p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-semibold text-gray-800">Store Information</h2>
                                {!isEditing && (
                                    <button
                                        onClick={() => setIsEditing(true)}
                                        className="py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                                    >
                                        Edit Store
                                    </button>
                                )}
                            </div>

                            {!isEditing ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-4">
                                        <h3 className="text-lg font-semibold">Store Details</h3>
                                        <p><strong>Name:</strong> {profile?.name}</p>
                                        <p><strong>Email:</strong> {profile?.email}</p>
                                        <p><strong>Description:</strong> {profile?.description}</p>
                                    </div>
                                    
                                    <div className="space-y-4">
                                        <h3 className="text-lg font-semibold">Documentation</h3>
                                        <div className="space-y-2">
                                            <p><strong>ID Card:</strong></p>
                                            <img
                                                src={profile?.idCardImage ? `data:image/jpeg;base64,${profile.idCardImage}` : '/default-id.png'}
                                                alt="ID Card"
                                                className="w-20 h-20 object-cover rounded"
                                                onClick={() => openModal(`data:image/jpeg;base64,${profile?.idCardImage}`)}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <p><strong>Tax Registry:</strong></p>
                                            <img
                                                src={profile?.taxationRegistryImage ? `data:image/jpeg;base64,${profile.taxationRegistryImage}` : '/default-tax.png'}
                                                alt="Tax Registry"
                                                className="w-20 h-20 object-cover rounded"
                                                onClick={() => openModal(`data:image/jpeg;base64,${profile?.taxationRegistryImage}`)}
                                            />
                                        </div>
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
                            )}
                        </div>

                        {/* Action Buttons Card */}
                        <div className="bg-white rounded-lg shadow-lg p-6 mt-6">
                            <h2 className="text-xl font-semibold text-gray-800 mb-4">Account Actions</h2>
                            <div className="grid grid-cols-2 gap-4">
                                <button
                                    onClick={() => setIsPasswordModalOpen(true)}
                                    className="py-3 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-all duration-200 flex items-center justify-center space-x-2"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                    </svg>
                                    <span>Change Password</span>
                                </button>
                                <button 
                                    onClick={() => setIsDeleteModalOpen(true)} 
                                    className="py-3 px-4 bg-red-600 text-white rounded-md hover:bg-red-700 transition-all duration-200 flex items-center justify-center space-x-2"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                    <span>Delete Account</span>
                                </button>
                            </div>
                        </div>
                    </div>
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
            {isDeleteModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg max-w-md">
                        <h2 className="text-xl font-semibold mb-4">Confirm Account Deletion</h2>
                        <p className="text-gray-600 mb-6">
                            Are you sure you want to delete your account? This action cannot be undone. 
                            All your active listings and pending transactions must be completed first.
                        </p>
                        <div className="flex justify-end space-x-4">
                            <button
                                onClick={() => setIsDeleteModalOpen(false)}
                                className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDeleteAccount}
                                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                            >
                                Confirm Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {toast.show && <Toast message={toast.message} type={toast.type} />}
        </div>
    );
};

export default SellerDashBoard;
