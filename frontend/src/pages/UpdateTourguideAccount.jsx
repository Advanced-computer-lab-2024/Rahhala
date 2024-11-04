import { AuthContext } from '../context/AuthContext';
import axiosInstance from '../utils/axiosConfig';
import { useNavigate } from 'react-router-dom';
import React, { useContext, useEffect, useState } from 'react';
import NavigateButton from '../components/UpdateProfileButton';
const UpdateTourguideAccount = () => {
    const navigate = useNavigate();
    const { auth } = useContext(AuthContext); // Get auth context
    if (!auth.isAuthenticated) {
        navigate('/login');
    }

    const [error, setError] = useState(null); // State to handle errors
    const [profile, setProfile] = useState(null); // State to hold the tour guide profile

    useEffect(() => {
        // Only fetch profile if the user is authenticated
        if (auth.isAuthenticated && auth.user) {
            const fetchTourguide = async () => {
                try {
                    const response = await axiosInstance.get('/tourguideAccount');
                    delete response.data.profile._id;
                    delete response.data.profile.password;
                    delete response.data.profile.createdAt;
                    delete response.data.profile.__v;
                    delete response.data.profile.updatedAt;
                    setProfile(response.data.profile);
                } catch (err) {
                    setError('Failed to load Tourguide profile.');
                }
            };

            fetchTourguide();
        }
    }, [auth]);

    const [formData, setFormData] = useState({
        email: '',
        mobileNumber: '',
        yearsOfExperience: '',
        previousWork: '',
    });

    useEffect(() => {
        if (profile) {
            setFormData({
                email: profile.email || '',
                mobileNumber: profile.mobileNumber || '',
                yearsOfExperience: profile.yearsOfExperience || '',
                previousWork: profile.previousWork || '',
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
                await axiosInstance.patch('/updateTourguide', formData);
                navigate('/tourguideAccount');
            } catch (err) {
                setError('Failed to update Tourguide profile.');
            }
        }
    };

    return (
        <div>
            <h2>Update Tourguide Account</h2>
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
                    <label>Mobile Number:</label>
                    <input
                        type="tel"
                        name="mobileNumber"
                        value={formData.mobileNumber}
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
                    <label>Previous Work:</label>
                    <input
                        type="text"
                        name="previousWork"
                        value={formData.previousWork}
                        onChange={handleChange}
                    />
                </div>
                <button type="submit">Update Account</button>
            </form>
            <NavigateButton path={'/tourguide-dashboard'} text={'Home'} />
        </div>
    );
};

export default UpdateTourguideAccount;