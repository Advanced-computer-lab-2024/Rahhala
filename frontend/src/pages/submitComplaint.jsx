import { AuthContext } from '../context/AuthContext';
import axiosInstance from '../utils/axiosConfig';
import { useNavigate } from 'react-router-dom';
import React, { useContext, useState } from 'react';
import NavigateButton from '../components/UpdateProfileButton';

const SubmitComplaint = () => {
    const navigate = useNavigate();
    const { auth } = useContext(AuthContext); // Get auth context
    if (!auth.isAuthenticated) {
        navigate('/login');
    }

    const [formData, setFormData] = useState({
        title: '',
        body: ''
    });

    const [error, setError] = useState(null); // State to handle errors

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
                const response = await axiosInstance.post('/api/complaint/', formData);
                navigate('/touristAccount');
            } catch (err) {
                setError('Failed to submit complaint.');
            }
        }
    };

    return (
        <div>
            <h2>Submit Complaint</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Title:</label>
                    <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label>Body:</label>
                    <textarea
                        name="body"
                        value={formData.body}
                        onChange={handleChange}
                    />
                </div>
                <button type="submit">Submit Complaint</button>
            </form>
            {error && <p>{error}</p>}
            <NavigateButton path='/touristAccount' text='Back'/>
        </div>
    );
};

export default SubmitComplaint;