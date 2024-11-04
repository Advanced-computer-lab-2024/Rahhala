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

    useEffect(() => {
        // Only fetch profile if the user is authenticated
        if (auth.isAuthenticated && auth.user) {
            const fetchSeller = async () => {
                try {
                    const response = await axiosInstance.get('/sellerAccount');
                    delete response.data.profile._id;
                    delete response.data.profile.password;
                    delete response.data.profile.createdAt;
                    delete response.data.profile.__v;
                    delete response.data.profile.updatedAt;
                    setProfile(response.data.profile);
                } catch (err) {
                    setError('Failed to load Seller profile.');
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
    });

    useEffect(() => {
        if (profile) {
            setFormData({
                username: profile.username || '',
                email: profile.email || '',
                name: profile.name || '',
                description: profile.description || '',
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
                await axiosInstance.patch('/updateSeller', formData);
                navigate('/sellerAccount');
            } catch (err) {
                setError('Failed to update Seller profile.');
            }
        }
    };

    return (
        <div>
            <h2>Update Seller Account</h2>
            {error && <p>{error}</p>}
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
                <button type="submit">Update Account</button>
            </form>
            <NavigateButton path={'/seller-dashboard'} text={'Home'} />
        </div>
    );
};

export default UpdateSellerAccount;