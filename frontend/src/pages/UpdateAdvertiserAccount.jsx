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
    const [profile, setProfile] = useState(null); // State to hold the advertiser profile

    useEffect(() => {
        // Only fetch profile if the user is authenticated
        if (auth.isAuthenticated && auth.user) {
            const fetchAdvertiser = async () => {
                try {
                    const response = await axiosInstance.get('/advertiserAccount');
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
    });

    useEffect(() => {
        if (profile) {
            setFormData({
                email: profile.email || '',
                websiteLink: profile.websiteLink || '',
                hotline: profile.hotline || '',
                companyProfile: profile.companyProfile || '',
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (auth.isAuthenticated && auth.user) {
            try {
                await axiosInstance.patch('/updateAdvertiser', formData);
                navigate('/advertiserAccount');
            } catch (err) {
                setError('Failed to update Advertiser profile.');
            }
        }
    };

    return (
        <div>
            <h2>Update Advertiser Account</h2>
            {error && <p>{error}</p>}
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
                <button type="submit">Update Account</button>
            </form>
            <NavigateButton path={'/advertiser-dashboard'} text={'Home'} />
        </div>
    );
};

export default UpdateAdvertiserAccount;