// src/components/AdminDashboard.jsx
import React, { useState } from 'react';
import axiosInstance from '../utils/axiosConfig';

function AdminDashboard() {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
    });

    const [message, setMessage] = useState('');

    // Handle input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            console.log(formData)
            const response = await axiosInstance.post('/createGovernor', formData);
            setMessage('Tourism Governor added successfully!');
            setFormData({ username: '', password: '' }); // Reset form
        } catch (error) {
            setMessage(error.response?.data?.message || 'Failed to add Tourism Governor.');
        }
    };

    return (
        <div>
            <h2>Admin Dashboard</h2>
            {message && <p>{message}</p>}
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Username:</label>
                    <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label>Password:</label>
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                </div>
                <br />
                <button type="submit">Add Tourism Governor</button>
            </form>
        </div>
    );
}

export default AdminDashboard;
