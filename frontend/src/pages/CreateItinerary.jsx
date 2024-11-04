// src/components/Itinerary/CreateItinerary.js
import React, { useState, useContext } from 'react';
import axiosInstance from './../utils/axiosConfig';
import { AuthContext } from './../context/AuthContext';

const CreateItinerary = () => {
    const { auth } = useContext(AuthContext);
    const [formData, setFormData] = useState({
        name: '',
        activities: [],
        timeline: '',
        language: '',
        price: '',
        availableDates: [],
        accessibility: [],
        pickupLocation: '',
        dropoffLocation: '',
        tags: [],
    });

    const [message, setMessage] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleActivitiesChange = (e) => {
        const activities = e.target.value.split(',').map(id => id.trim());
        setFormData({
            ...formData,
            activities,
        });
    };

    const handleAvailableDatesChange = (e) => {
        const dates = e.target.value.split(',').map(date => new Date(date.trim()));
        setFormData({
            ...formData,
            availableDates: dates,
        });
    };

    const handleAccessibilityChange = (e) => {
        const accessibility = e.target.value.split(',').map(item => item.trim());
        setFormData({
            ...formData,
            accessibility,
        });
    };

    const handleTagsChange = (e) => {
        const tags = e.target.value.split(',').map(tag => tag.trim());
        setFormData({
            ...formData,
            tags,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axiosInstance.post('/createItinerary', formData);
            setMessage('Itinerary created successfully!');
            // Optionally, redirect or reset form
        } catch (error) {
            setMessage(error.response?.data?.error || 'Failed to create itinerary.');
        }
    };

    return (
        <div>
            <h2>Create Itinerary</h2>
            {message && <p>{message}</p>}
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Name:</label>
                    <input type="text" name="name" value={formData.name} onChange={handleChange} required />
                </div>
                <div>
                    <label>Activities (comma-separated IDs):</label>
                    <input type="text" name="activities" onChange={handleActivitiesChange} required />
                </div>
                <div>
                    <label>Timeline:</label>
                    <input type="text" name="timeline" value={formData.timeline} onChange={handleChange} required />
                </div>
                <div>
                    <label>Language:</label>
                    <input type="text" name="language" value={formData.language} onChange={handleChange} required />
                </div>
                <div>
                    <label>Price:</label>
                    <input type="number" name="price" value={formData.price} onChange={handleChange} required />
                </div>
                <div>
                    <label>Available Dates (comma-separated YYYY-MM-DD):</label>
                    <input type="text" name="availableDates" onChange={handleAvailableDatesChange} required />
                </div>
                <div>
                    <label>Accessibility (comma-separated):</label>
                    <input type="text" name="accessibility" onChange={handleAccessibilityChange} />
                </div>
                <div>
                    <label>Pickup Location:</label>
                    <input type="text" name="pickupLocation" value={formData.pickupLocation} onChange={handleChange} required />
                </div>
                <div>
                    <label>Dropoff Location:</label>
                    <input type="text" name="dropoffLocation" value={formData.dropoffLocation} onChange={handleChange} required />
                </div>
                <div>
                    <label>Tags (comma-separated):</label>
                    <input type="text" name="tags" onChange={handleTagsChange} />
                </div>
                <button type="submit">Create Itinerary</button>
            </form>
        </div>
    );
};

export default CreateItinerary;
