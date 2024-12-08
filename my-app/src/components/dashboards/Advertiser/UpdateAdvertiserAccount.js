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
        logo: ''
    });
    const [error, setError] = useState(null); // State to handle errors
    const [success, setSuccess] = useState(null); // State to handle success messages
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [showChangePasswordForm, setShowChangePasswordForm] = useState(false);
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

    useEffect(() => {

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
        if (newPassword !== confirmPassword) {
            alert('New passwords do not match.');
            return;
        }
        try {
            await axiosInstance.put(`/api/advertiser/changePassword`, {
                oldPassword,
                newPassword
            });
            setShowChangePasswordForm(false);
            setOldPassword('');
            setNewPassword('');
            setConfirmPassword('');
            alert('Password changed successfully.');
        } catch (err) {
            alert(err.response?.data?.message || err.response?.data?.error || 'Error changing password.');
        }
    };

    const toggleChangePasswordForm = () => {
        setIsPasswordModalOpen(!isPasswordModalOpen);
        setError(null);
        setSuccess(null);
    };

    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
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
                        Change Password
                    </button>
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
                                            value={oldPassword}
                                            onChange={(e) => setOldPassword(e.target.value)}
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
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                            className="p-2 border rounded"
                                            required
                                        />
                                    </div>
                                    <div className="flex justify-between gap-6">
                                        <label className="font-bold" htmlFor="confirmPassword">Confirm Password:</label>
                                        <input
                                            type="password"
                                            id="confirmPassword"
                                            name="confirmPassword"
                                            placeholder='Confirm Password'
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
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
                                                setOldPassword('');
                                                setNewPassword('');
                                                setConfirmPassword('');
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
            </div>
        </div>
    );
};

export default UpdateAdvertiserAccount;