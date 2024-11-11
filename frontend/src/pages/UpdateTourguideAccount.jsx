import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import axiosInstance from '../utils/axiosConfig';
import NavigateButton from '../components/UpdateProfileButton';
import { useNavigate } from 'react-router-dom';
import Logout from '../components/Auth/Logout';

const UpdateTourguideAccount = () => {
    const navigate = useNavigate();
    const { auth } = useContext(AuthContext); // Get auth context
    if (!auth.isAuthenticated) {
        navigate('/login');
    }
    const [formData, setFormData] = useState({
        email: '',
        mobileNumber: '',
        profilePhoto: '',
        status: '',
        work: '',
        yearsOfExperience: '',
        certificationImages: []
    });
    const [error, setError] = useState(null); // State to handle errors
    const [message, setMessage] = useState(null); // State to handle success messages

    useEffect(() => {
        // Only fetch profile if the user is authenticated
        if (auth.isAuthenticated && auth.user) {
            const fetchTourguide = async () => {
                try {
                    const response = await axiosInstance.get('api/tourguide/');
                    const profile = response.data.profile;
                    setFormData({
                        email: profile.email || '',
                        mobileNumber: profile.mobileNumber || '',
                        profilePhoto: profile.profilePhoto || '',
                        yearsOfExperience: '',
                        certificationImages: profile.certificationImages || []
                    });
                } catch (err) {
                    setError('Failed to load Tourguide profile.');
                }
            };

            fetchTourguide();
        }
    }, [auth]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleCertificationImagesChange = (e) => {
        const { value } = e.target;
        setFormData({
            ...formData,
            certificationImages: value.split(',').map(img => img.trim())
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axiosInstance.put('/api/tourguide/edit', formData);
            setMessage('Account updated successfully');
            setError(null); // Clear any previous errors
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update account');
            setMessage(null); // Clear any previous success messages
        }
    };

    return (
        <div>
            {error && <p>{error}</p>}
            {message && <p>{message}</p>}
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
                    <label>Mobile Number:</label>
                    <input
                        type="tel"
                        name="mobileNumber"
                        value={formData.mobileNumber}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label>Profile Photo URL:</label>
                    <input
                        type="text"
                        name="profilePhoto"
                        value={formData.profilePhoto}
                        onChange={handleChange}
                    />
                </div>
                
                <div>
                    <label>Years of Experience:</label>
                    <input
                        type="number"
                        name="yearsOfExperience"
                        value={formData.yearsOfExperience}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label>Certification Images (comma separated URLs):</label>
                    <input
                        type="text"
                        name="certificationImages"
                        value={formData.certificationImages.join(', ')}
                        onChange={handleCertificationImagesChange}
                    />
                </div>
                <button type="submit">Update Account</button>
            </form>
            <NavigateButton path={'/tourguide-dashboard'} text={'Home'} />
            <Logout />
        </div>
    );
};

export default UpdateTourguideAccount;