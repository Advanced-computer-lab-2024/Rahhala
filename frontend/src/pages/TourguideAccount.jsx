import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import axiosInstance from '../utils/axiosConfig';
import NavigateButton from '../components/UpdateProfileButton';
import { useNavigate } from 'react-router-dom';
import Logout from '../components/Auth/Logout';
import Profile from '../components/Profile'; // Import the Profile component

const TourguideAccount = () => {
    const navigate = useNavigate();
    const { auth } = useContext(AuthContext); // Get auth context
    if (!auth.isAuthenticated) {
        navigate('/login');
    }
    const [profile, setProfile] = useState(null); 
    const [error, setError] = useState(null); // State to handle errors
    const [oldPassword, setOldPassword] = useState(''); // State for old password
    const [newPassword, setNewPassword] = useState(''); // State for new password
    const [message, setMessage] = useState(null); // State to handle success messages
    const [showChangePasswordForm, setShowChangePasswordForm] = useState(false); // State to show/hide change password form
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false); // State to show/hide delete confirmation

    useEffect(() => {
        // Only fetch profile if the user is authenticated
        if (auth.isAuthenticated && auth.user) {
            const fetchTourguide = async () => {
                try {
                    const response = await axiosInstance.get('api/tourguide/');
                    delete response.data.profile.password;
                    delete response.data.profile.createdAt;
                    delete response.data.profile.__v;
                    delete response.data.profile.updatedAt;
                    delete response.data.profile.acceptedTermsAndConditions;
                    delete response.data.profile._id;
                    delete response.data.profile.status;
                    console.log("Tourguide profile:", response.data.profile); // Log the profile data
                    setProfile(response.data.profile);
                } catch (err) {
                    setError('Failed to load Tourguide profile.');
                }
            };

            fetchTourguide();
        }
    }, [auth]);

    const handleChangePassword = async (e) => {
        e.preventDefault();
        try {
            const response = await axiosInstance.put('/api/tourguide/edit/changePassword', {
                oldPassword,
                newPassword
            });
            setMessage('Password changed successfully');
            setError(null); // Clear any previous errors
            setOldPassword(''); // Clear the input fields
            setNewPassword(''); // Clear the input fields
            setShowChangePasswordForm(false); // Hide the form after successful password change
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to change password');
            setMessage(null); // Clear any previous success messages
        }
    };

    const handleAccountDeletionRequest = async () => {
        try {
            await axiosInstance.post('/api/accountDeletionRequest');
            setMessage('Account deletion request submitted successfully');
            setError(null); // Clear any previous errors
            setShowDeleteConfirmation(false); // Hide the confirmation message
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to submit account deletion request');
            setMessage(null); // Clear any previous success messages
        }
    };

    return (
        <div>
            {error && <p>{error}</p>}
            {message && <p>{message}</p>}
            {profile ? (
                <Profile data={profile} /> // Use the Profile component
            ) : (
                <p>Loading profile...</p>
            )}
            <button onClick={() => setShowChangePasswordForm(!showChangePasswordForm)}>
                {showChangePasswordForm ? 'Cancel' : 'Change Password'}
            </button>
            {showChangePasswordForm && (
                <form onSubmit={handleChangePassword}>
                    <div>
                        <label>Old Password:</label>
                        <input
                            type="password"
                            value={oldPassword}
                            onChange={(e) => setOldPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label>New Password:</label>
                        <input
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit">Change Password</button>
                </form>
            )}
            <button onClick={() => setShowDeleteConfirmation(true)}>
                Request My Account to be Deleted
            </button>
            {showDeleteConfirmation && (
                <div>
                    <p>Are you sure you want to request your account to be deleted?</p>
                    <button onClick={handleAccountDeletionRequest}>Yes, Delete My Account</button>
                    <button onClick={() => setShowDeleteConfirmation(false)}>Cancel</button>
                </div>
            )}
            <NavigateButton path='/updateTourguideAccount' text='Update Account'/>{'\u00A0'} 
            <NavigateButton path='/tourguide-dashboard' text='Home'/>{'\u00A0'} 
            <Logout />
        </div>
    );
};

export default TourguideAccount;