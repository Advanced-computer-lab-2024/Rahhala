import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../../context/AuthContext';
import axiosInstance from '../../../utils/axiosConfig';
import { useNavigate } from 'react-router-dom';
import Header from '../../Header';

const UpdateAdvertiserAccount = () => {
    const navigate = useNavigate();
    const { auth } = useContext(AuthContext); // Get auth context
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        websiteLink: '',
        hotline: '',
        idCardImage: '',
        taxationRegistryImage: '',
        logo: ''
    });
    const [error, setError] = useState(null); // State to handle errors
    const [success, setSuccess] = useState(null); // State to handle success messages
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [showChangePasswordForm, setShowChangePasswordForm] = useState(false);
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');

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
                    setFormData({
                        username: profile.username,
                        email: profile.email,
                        websiteLink: profile.websiteLink,
                        hotline: profile.hotline,
                        idCardImage: profile.idCardImage,
                        taxationRegistryImage: profile.taxationRegistryImage,
                        logo: profile.logo
                    });
                } catch (err) {
                    setError('Failed to load Advertiser profile.');
                }
            };
            fetchAdvertiser();
        }
    }, [auth, navigate]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onloadend = () => {
            setFormData({
                ...formData,
                [e.target.name]: reader.result
            });
        };
        reader.readAsDataURL(file);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axiosInstance.put(`/api/advertiser/${auth.user.id}`, formData);
            setSuccess('Profile updated successfully.');
            setError(null);
        } catch (err) {
            setError('Error updating profile.');
        }
    };

    const handleChangePassword = async (e) => {
        e.preventDefault();
        try {
            await axiosInstance.put(`/api/advertiser/changePassword`, {
                oldPassword,
                newPassword
            });
            setShowChangePasswordForm(false);
            setOldPassword('');
            setNewPassword('');
            setSuccess('Password changed successfully.');
        } catch (err) {
            setError('Error changing password.');
        }
    };

    const toggleChangePasswordForm = () => {
        setShowChangePasswordForm(!showChangePasswordForm);
        setError(null);
        setSuccess(null);
    };

    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <Header toggleDropdown={toggleDropdown} dropdownOpen={dropdownOpen} />
            <div className="flex justify-center mt-20">
                <div className="space-y-4 max-w-md mx-auto p-6 bg-white shadow-lg rounded-lg text-sm">
                    <h2 className="text-2xl font-bold mb-4 text-center">Update Advertiser Account</h2>
                    {error && <p className="text-red-500">{error}</p>}
                    {success && <p className="text-green-500">{success}</p>}
                    <form onSubmit={handleSubmit}>
                        <div>
                            <label className="block text-gray-700">Username:</label>
                            <input
                                type="text"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border rounded"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700">Email:</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border rounded"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700">Website Link:</label>
                            <input
                                type="text"
                                name="websiteLink"
                                value={formData.websiteLink}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border rounded"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700">Hotline:</label>
                            <input
                                type="text"
                                name="hotline"
                                value={formData.hotline}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border rounded"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700">ID Card Image:</label>
                            <input
                                type="text"
                                name="idCardImage"
                                value={formData.idCardImage}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border rounded"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700">Taxation Registry Image:</label>
                            <input
                                type="text"
                                name="taxationRegistryImage"
                                value={formData.taxationRegistryImage}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border rounded"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700">Logo:</label>
                            <input
                                type="file"
                                name="logo"
                                onChange={handleFileChange}
                                className="w-full px-3 py-2 border rounded"
                            />
                        </div>
                        <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded mt-4">
                            Update Profile
                        </button>
                    </form>
                    <button
                        onClick={toggleChangePasswordForm}
                        className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded mt-4"
                    >
                        {showChangePasswordForm ? 'Cancel' : 'Change Password'}
                    </button>
                    {showChangePasswordForm && (
                        <form onSubmit={handleChangePassword} className="mt-4">
                            <div>
                                <label className="block text-gray-700">Old Password:</label>
                                <input
                                    type="password"
                                    name="oldPassword"
                                    value={oldPassword}
                                    onChange={(e) => setOldPassword(e.target.value)}
                                    className="w-full px-3 py-2 border rounded"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700">New Password:</label>
                                <input
                                    type="password"
                                    name="newPassword"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    className="w-full px-3 py-2 border rounded"
                                />
                            </div>
                            <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded mt-4">
                                Change Password
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UpdateAdvertiserAccount;