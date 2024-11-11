import { AuthContext } from '../context/AuthContext';
import axiosInstance from '../utils/axiosConfig';
import { useNavigate } from 'react-router-dom';
import React, { useContext, useEffect, useState } from 'react';
import NavigateButton from '../components/UpdateProfileButton';

const UpdateSellerAccount = () => {
    const navigate = useNavigate();
    const { auth } = useContext(AuthContext); // Get auth context
    if (!auth.isAuthenticated) {
        navigate('/login');
    }

    const [error, setError] = useState(null); // State to handle errors
    const [profile, setProfile] = useState(null); // State to hold the seller profile
    const [showChangePasswordForm, setShowChangePasswordForm] = useState(false); // State to show/hide change password form
    const [oldPassword, setOldPassword] = useState(''); // State for old password
    const [newPassword, setNewPassword] = useState(''); // State for new password

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

    const [formData, setFormData] = useState({
        username: '',
        email: '',
        name: '',
        description: '',
        logo: null,
    });

    useEffect(() => {
        if (profile) {
            setFormData({
                username: profile.username || '',
                email: profile.email || '',
                name: profile.name || '',
                description: profile.description || '',
                logo: profile.logo || null,
            });
        }
    }, [profile]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onloadend = () => {
            const base64String = reader.result.replace('data:', '').replace(/^.+,/, '');
            setFormData({
                ...formData,
                logo: base64String,
            });
        };
        reader.readAsDataURL(file);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (auth.isAuthenticated && auth.user) {
            const formDataToSend = {
                username: formData.username,
                email: formData.email,
                name: formData.name,
                description: formData.description,
                logo: formData.logo,
            };

            try {
                await axiosInstance.put('api/seller/edit', formDataToSend);
                navigate('/sellerAccount');
            } catch (err) {
                setError('Failed to update Seller profile.');
            }
        }
    };

    const handleChangePassword = async (e) => {
        e.preventDefault();
        try {
            const response = await axiosInstance.put('api/seller/changePassword', {
                oldPassword,
                newPassword
            });
            setShowChangePasswordForm(false);
            setOldPassword('');
            setNewPassword('');
            setError('Password changed successfully');
        } catch (err) {
            setError('Error changing password');
        }
    };

    return (
        <div>
            <h2>Update Seller Account</h2>
            {error && <p>{error}</p>}
            {profile && (
                <div>
                    {/* Display profile information here */}
                </div>
            )}
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Username:</label>
                    <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label>Email:</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label>Name:</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label>Description:</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label>Logo:</label>
                    <input
                        type="file"
                        name="logo"
                        onChange={handleFileChange}
                    />
                </div>
                <button type="submit">Update Account</button>
            </form>
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
                    <button type="submit">Submit</button>
                </form>
            )}
            <NavigateButton path={'/seller-dashboard'} text={'Home'} />
        </div>
    );
};

export default UpdateSellerAccount;