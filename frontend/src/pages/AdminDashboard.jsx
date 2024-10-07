// src/components/AdminDashboard.jsx
import React, { useState, useEffect } from 'react';
import axiosInstance from '../utils/axiosConfig';

function AdminDashboard() {
    const [governorData, setGovernorData] = useState({
        username: '',
        password: '',
    });
    const [adminData, setAdminData] = useState({
        email: '',
        password: '',
    });

    const [message, setMessage] = useState('');
    const [isGovernorFormVisible, setIsGovernorFormVisible] = useState(false);
    const [isAdminFormVisible, setIsAdminFormVisible] = useState(false);

    // Handle input changes for governor form
    const handleGovernorChange = (e) => {
        const { name, value } = e.target;
        setGovernorData({
            ...governorData,
            [name]: value,
        });
    };

    // Handle input changes for admin form
    const handleAdminChange = (e) => {
        const { name, value } = e.target;
        setAdminData({
            ...adminData,
            [name]: value,
        });
    };

    // Handle form submission for governor
    const handleGovernorSubmit = async (e) => {
        e.preventDefault();
        
        try {
            await axiosInstance.post('/createGovernor', governorData);
            setMessage('Tourism Governor added successfully!');
            setGovernorData({ username: '', password: '' }); // Reset form
            setIsGovernorFormVisible(false); // Hide the form after submission
        } catch (error) {
            setMessage(error.response?.data?.message || 'Failed to add Tourism Governor.');
        }
    };

    // Handle form submission for admin
    const handleAdminSubmit = async (e) => {
        e.preventDefault();
        
        try {
            await axiosInstance.post('/addAdmin', adminData); // Update the backend route accordingly
            setMessage('Admin added successfully!');
            setAdminData({ email: '', password: '' }); // Reset form
            setIsAdminFormVisible(false); // Hide the form after submission
        } catch (error) {
            setMessage(error.response?.data?.message || 'Failed to add Admin.');
        }
    };

    // Toggle governor form visibility
    const toggleGovernorForm = () => {
        setIsGovernorFormVisible(!isGovernorFormVisible);
        setMessage(''); // Clear the message when toggling
    };

    // Toggle admin form visibility
    const toggleAdminForm = () => {
        setIsAdminFormVisible(!isAdminFormVisible);
        setMessage(''); // Clear the message when toggling
    };

    // Effect to clear message after 3 seconds
    useEffect(() => {
        if (message) {
            const timer = setTimeout(() => {
                setMessage('');
            }, 3000); // Clear message after 3 seconds

            return () => clearTimeout(timer); // Cleanup the timer on component unmount
        }
    }, [message]); // Run effect when message changes

    return (
        <div>
            <h2>Admin Dashboard</h2>
            {message && <p>{message}</p>}
            
            {/* Button to toggle Governor form */}
            <button onClick={toggleGovernorForm}>
                {isGovernorFormVisible ? 'Cancel' : 'Add Tourism Governor'}
            </button>
            {isGovernorFormVisible && (
                <form onSubmit={handleGovernorSubmit}>
                    <div>
                        <label>Username:</label>
                        <input
                            type="text"
                            name="username"
                            value={governorData.username}
                            onChange={handleGovernorChange}
                            required
                        />
                    </div>
                    <div>
                        <label>Password:</label>
                        <input
                            type="password"
                            name="password"
                            value={governorData.password}
                            onChange={handleGovernorChange}
                            required
                        />
                    </div>
                    <br />
                    <button type="submit">Add Tourism Governor</button>
                </form>
            )}

            {/* Button to toggle Admin form */}
            <button onClick={toggleAdminForm}>
                {isAdminFormVisible ? 'Cancel' : 'Add Admin'}
            </button>
            {isAdminFormVisible && (
                <form onSubmit={handleAdminSubmit}>
                    <div>
                        <label>Email:</label>
                        <input
                            type="String"
                            name="email"
                            value={adminData.email}
                            onChange={handleAdminChange}
                            required
                        />
                    </div>
                    <div>
                        <label>Password:</label>
                        <input
                            type="password"
                            name="password"
                            value={adminData.password}
                            onChange={handleAdminChange}
                            required
                        />
                    </div>
                    <br />
                    <button type="submit">Add Admin</button>
                </form>
            )}
        </div>
    );
}

export default AdminDashboard;
