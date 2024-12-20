import React, { useState, useEffect, useContext } from 'react';
import axiosInstance from '../utils/axiosConfig';
import { useNavigate } from 'react-router-dom';
import NavigateButton from '../components/UpdateProfileButton';
import Logout from '../components/Auth/Logout';
import ChangePassword from './ChangePassword';
import DeleteAccount from '../components/DeleteAccount';
import { AuthContext } from '../context/AuthContext';
import './AdminDashboard.css';

function AdminDashboard() {
    const navigate = useNavigate();
    const { auth } = useContext(AuthContext); // Get auth context
    const [message, setMessage] = useState('');
    const [isGovernorFormVisible, setIsGovernorFormVisible] = useState(false);
    const [isAdminFormVisible, setIsAdminFormVisible] = useState(false);
    const [isChangePasswordFormVisible, setIsChangePasswordFormVisible] = useState(false);
    const [isDeleteAccountFormVisible, setIsDeleteAccountFormVisible] = useState(false);
    const [governorData, setGovernorData] = useState({ username: '', password: '' });
    const [adminData, setAdminData] = useState({ username: '', password: '' });
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [flaggedId, setFlaggedId] = useState('');

    const hideAllForms = () => {
        setIsGovernorFormVisible(false);
        setIsAdminFormVisible(false);
        setIsChangePasswordFormVisible(false);
        setIsDeleteAccountFormVisible(false);
    };

    const toggleGovernorForm = () => {
        hideAllForms();
        setIsGovernorFormVisible(!isGovernorFormVisible);
        setMessage('');
    };

    const toggleAdminForm = () => {
        hideAllForms();
        setIsAdminFormVisible(!isAdminFormVisible);
        setMessage('');
    };

    const toggleChangePasswordForm = () => {
        hideAllForms();
        setIsChangePasswordFormVisible(!isChangePasswordFormVisible);
        setMessage('');
    };

    const toggleDeleteAccountForm = () => {
        hideAllForms();
        setIsDeleteAccountFormVisible(!isDeleteAccountFormVisible);
        setMessage('');
    };

    useEffect(() => {
        if (message) {
            const timer = setTimeout(() => {
                setMessage('');
            }, 3000);

            return () => clearTimeout(timer);
        }
    }, [message]);

    const handleGovernorSubmit = async (e) => {
        e.preventDefault();
        try {
            await axiosInstance.post('/api/governor', governorData);
            setMessage('Tourism Governor added successfully!');
            setGovernorData({ username: '', password: '' });
            setIsGovernorFormVisible(false);
        } catch (error) {
            setMessage(error.response?.data?.message || 'Failed to add Tourism Governor.');
        }
    };

    const handleAdminSubmit = async (e) => {
        e.preventDefault();
        try {
            await axiosInstance.post('/api/admin/', adminData);
            setMessage('Admin added successfully!');
            setAdminData({ username: '', password: '' });
            setIsAdminFormVisible(false);
        } catch (error) {
            setMessage(error.response?.data?.message || 'Failed to add Admin.');
        }
    };

    const handleChangePassword = async (currentPassword, newPassword, confirmNewPassword) => {
        if (newPassword !== confirmNewPassword) {
            setMessage('New passwords do not match.');
            return;
        }

        try {
            await axiosInstance.put('/api/admin/changePassword', { oldPassword: currentPassword, newPassword });
            setMessage('Password changed successfully!');
            setCurrentPassword('');
            setNewPassword('');
            setConfirmNewPassword('');
            setIsChangePasswordFormVisible(false);
        } catch (error) {
            setMessage(error.response?.data?.message || 'Failed to change password.');
        }
    };

    const handleFlagItinerary = async (id) => {
        try {
            await axiosInstance.put(`/api/itinerary/flag/${id}`);
            setMessage('Itinerary flagged successfully');
        } catch (err) {
            console.error('Failed to flag itinerary', err);
            setMessage('Failed to flag itinerary');
        }
    };

    const handleUnflagItinerary = async (id) => {
        try {
            await axiosInstance.put(`/api/itinerary/unflag/${id}`);
            setMessage('Itinerary unflagged successfully');
        } catch (err) {
            console.error('Failed to unflag itinerary', err);
            setMessage('Failed to unflag itinerary');
        }
    };

    const handleFlagSubmit = (e) => {
        e.preventDefault();
        handleFlagItinerary(flaggedId);
        setFlaggedId('');
    };

    const handleUnflagSubmit = (e) => {
        e.preventDefault();
        handleUnflagItinerary(flaggedId);
        setFlaggedId('');
    };

    return (
        <div className="admin-dashboard">
            <h2>Admin Dashboard</h2>
            {message && <p className="message">{message}</p>}
            
            <div className="buttons">
                <button onClick={toggleGovernorForm}>
                    {isGovernorFormVisible ? 'Cancel' : 'Add Tourism Governor'}
                </button>
                <button onClick={toggleAdminForm}>
                    {isAdminFormVisible ? 'Cancel' : 'Add Admin'}
                </button>
            </div>

            <div className="form-container">
                {isGovernorFormVisible && (
                    <form onSubmit={handleGovernorSubmit}>
                        <div>
                            <label>Username:</label>
                            <input
                                type="text"
                                name="username"
                                value={governorData.username}
                                onChange={(e) => setGovernorData({ ...governorData, username: e.target.value })}
                                required
                            />
                        </div>
                        <div>
                            <label>Password:</label>
                            <input
                                type="password"
                                name="password"
                                value={governorData.password}
                                onChange={(e) => setGovernorData({ ...governorData, password: e.target.value })}
                                required
                            />
                        </div>
                        <button type="submit">Add Tourism Governor</button>
                    </form>
                )}

                {isAdminFormVisible && (
                    <form onSubmit={handleAdminSubmit}>
                        <div>
                            <label>Username:</label>
                            <input
                                type="text"
                                name="username"
                                value={adminData.username}
                                onChange={(e) => setAdminData({ ...adminData, username: e.target.value })}
                                required
                            />
                        </div>
                        <div>
                            <label>Password:</label>
                            <input
                                type="password"
                                name="password"
                                value={adminData.password}
                                onChange={(e) => setAdminData({ ...adminData, password: e.target.value })}
                                required
                            />
                        </div>
                        <button type="submit">Add Admin</button>
                    </form>
                )}

                {isChangePasswordFormVisible && (
                    <ChangePassword
                        userRole="admin"
                        handleChangePassword={handleChangePassword}
                    />
                )}

                {isDeleteAccountFormVisible && (
                    <DeleteAccount userType={auth.user.type} userId={auth.user.id} />
                )}
            </div>

            <div className="section">
                <h3>Product Management</h3>
                <div className="buttons">
                    <NavigateButton path="/products" text="View Products" />
                    <NavigateButton path='/createProduct' text='Create Product'/>
                </div>
            </div>

            <div className="section">
                <h3>Management Panel</h3>
                <div className="buttons">
                    <NavigateButton path="/userManagement" text="Pending Users Management" />
                </div>
                <div className="buttons">
                    <NavigateButton path="/preferenceTagManagement" text="Preference Tags Management" />
                </div>
                <div className="buttons">
                    <NavigateButton path="/activityCategories" text="Activity Categories" />
                </div>
                <div className="buttons">
                    <NavigateButton path="/complaintManagement" text="Complaint Management" />
                </div>
                <div className="buttons">
                    <NavigateButton path="/accountDeletionRequests" text="Account Deletion Requests" />
                </div>
            </div>

            <div className="section">
                <h3>Others</h3>
                <div className="buttons">
                    <button onClick={toggleChangePasswordForm}>
                        {isChangePasswordFormVisible ? 'Cancel' : 'Change Password'}
                    </button>
                    <button onClick={toggleDeleteAccountForm}>
                        {isDeleteAccountFormVisible ? 'Cancel' : 'Delete Account'}
                    </button>
                </div>
                <Logout />
            </div>

            <div className="section">
                <h3>Flag Itinerary</h3>
                <form onSubmit={handleFlagSubmit}>
                    <label>
                        Itinerary ID:
                        <input
                            type="text"
                            value={flaggedId}
                            onChange={(e) => setFlaggedId(e.target.value)}
                            required
                        />
                    </label>
                    <button type="submit">Flag as Inappropriate</button>
                </form>
                <form onSubmit={handleUnflagSubmit}>
                    <label>
                        Itinerary ID:
                        <input
                            type="text"
                            value={flaggedId}
                            onChange={(e) => setFlaggedId(e.target.value)}
                            required
                        />
                    </label>
                    <button type="submit">Unflag as Inappropriate</button>
                </form>
            </div>
        </div>
    );
}

export default AdminDashboard;