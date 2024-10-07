import { AuthContext } from '../context/AuthContext';
import axiosInstance from '../utils/axiosConfig';
import { useNavigate } from 'react-router-dom';
import React, { useContext, useEffect, useState } from 'react';

const UpdateTouristAccount = () => {
    const navigate = useNavigate();
    const { auth } = useContext(AuthContext); // Get auth context
    if (!auth.isAuthenticated) {
        navigate('/login');
    }
    const [error, setError] = useState(null); // State to handle errors
    const [profile, setProfile] = useState(null); // State to hold the tourist profile

    useEffect(() => {
        // Only fetch profile if the user is authenticated
        if (auth.isAuthenticated && auth.user) {
            const fetchTourist = async () => {
                try {
                    const response = await axiosInstance.get('/touristAccount');

                    delete response.data.profile._id;
                    delete response.data.profile.password;
                    delete response.data.profile.createdAt;
                    delete response.data.profile.__v;
                    delete response.data.profile.updatedAt;
                    setProfile(response.data.profile);

                } catch (err) {
                    setError('Failed to load tourist profile.');
                }
            };

            fetchTourist();
        }
        

    }, [auth]);


    

    
    const [formData, setFormData] = useState({
        
        email: '',
        mobileNumber: '',
        nationality: '',
        dob : '',
        occupation : '',
    });

    useEffect(() => {
        if (profile) {
            const formattedDob = profile.dob ? new Date(profile.dob).toISOString().split('T')[0] : '';
            setFormData({
                email: profile.email || '',
                mobileNumber: profile.mobileNumber || '',
                nationality: profile.nationality || '',
                dob: formattedDob || '',
                occupation: profile.occupation || '',
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
            const response = await axiosInstance.patch('/updateTourist', formData);
            navigate('/touristAccount');
            } catch (err) {
                setError('Failed to load tourist profile.');
            }
        } 
    }
    return (
        <div>
            <h2>Update Account</h2>
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
                    <label>Nationality:</label>
                    <input
                        type="text"
                        name="nationality"
                        value={formData.nationality}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label>Date of Birth:</label>
                    <input
                        type="date"
                        name="dob"
                        value={formData.dob}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label>Occupation:</label>
                    <input
                        type="text"
                        name="occupation"
                        value={formData.occupation}
                        onChange={handleChange}
                    />
                </div>
                <button type="submit">Update Account</button>

            </form>

        </div>
    )
}

export default UpdateTouristAccount