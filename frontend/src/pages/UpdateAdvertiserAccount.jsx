import { AuthContext } from '../context/AuthContext';
import axiosInstance from '../utils/axiosConfig';
import { useNavigate } from 'react-router-dom';
import React, { useContext, useEffect, useState } from 'react';
import NavigateButton from '../components/UpdateProfileButton';

const UpdateAdvertiserAccount = () => {
    const navigate = useNavigate();
    const { auth } = useContext(AuthContext); // Get auth context
    if (!auth.isAuthenticated) {
        navigate('/login');
    }

    const [error, setError] = useState(null); // State to handle errors
    const [success, setSuccess] = useState(null); // State to handle success messages
    const [profile, setProfile] = useState(null); // State to hold the advertiser profile
    const [showChangePasswordForm, setShowChangePasswordForm] = useState(false); // State to show/hide change password form
    const [oldPassword, setOldPassword] = useState(''); // State for old password
    const [newPassword, setNewPassword] = useState(''); // State for new password

    useEffect(() => {
        // Only fetch profile if the user is authenticated
        if (auth.isAuthenticated && auth.user) {
            const fetchAdvertiser = async () => {
                try {
                    const response = await axiosInstance.get(`/api/advertiser/${auth.user.id}`);
                    delete response.data.profile._id;
                    delete response.data.profile.password;
                    delete response.data.profile.createdAt;
                    delete response.data.profile.__v;
                    delete response.data.profile.updatedAt;
                    setProfile(response.data.profile);
                } catch (err) {
                    setError('Failed to load Advertiser profile.');
                }
            };

            fetchAdvertiser();
        }
    }, [auth]);

    const [formData, setFormData] = useState({
        email: '',
        websiteLink: '',
        hotline: '',
        companyProfile: '',
        logo: null,
    });

    useEffect(() => {
        if (profile) {
            setFormData({
                email: profile.email || '',
                websiteLink: profile.websiteLink || '',
                hotline: profile.hotline || '',
                companyProfile: profile.companyProfile || '',
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
        setFormData({
            ...formData,
            logo: e.target.files[0],
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (auth.isAuthenticated && auth.user) {
            const formDataToSend = new FormData();
            formDataToSend.append('email', formData.email);
            formDataToSend.append('websiteLink', formData.websiteLink);
            formDataToSend.append('hotline', formData.hotline);
            formDataToSend.append('companyProfile', formData.companyProfile);
            if (formData.logo) {
                formDataToSend.append('logo', formData.logo);
            }

            try {
                await axiosInstance.put(`/api/advertiser/${auth.user.id}`, formDataToSend, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
                navigate('/advertiserAccount');
            } catch (err) {
                setError('Failed to update Advertiser profile.');
            }
        }
    };

    const handleChangePassword = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);
        try {
            await axiosInstance.put(`/api/advertiser/${auth.user.id}`, {
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

    return (
        <div>
            <h2>Update Advertiser Account</h2>
            {error && <p>{error}</p>}
            {success && <p>{success}</p>}
            <form onSubmit={handleSubmit}>
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
                    <label>Website Link:</label>
                    <input
                        type="url"
                        name="websiteLink"
                        value={formData.websiteLink}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label>Hotline:</label>
                    <input
                        type="tel"
                        name="hotline"
                        value={formData.hotline}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label>Company Profile:</label>
                    <textarea
                        name="companyProfile"
                        value={formData.companyProfile}
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
            <button onClick={toggleChangePasswordForm}>
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
            <NavigateButton path={'/advertiser-dashboard'} text={'Home'} />

        </div>
    );
};

export default UpdateAdvertiserAccount;