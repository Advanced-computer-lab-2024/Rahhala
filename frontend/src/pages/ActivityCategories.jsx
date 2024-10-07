import React, { useEffect, useState } from 'react';
import axiosInstance from '../utils/axiosConfig';
import { useNavigate } from 'react-router-dom';

function ActivityCategories() {
    const [categories, setCategories] = useState([]);
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axiosInstance.get('/getCategories');
                setCategories(response.data);
            } catch (error) {
                setMessage(error.response?.data?.message || 'Failed to fetch categories.');
            }
        };

        fetchCategories();
    }, []);

    const handleHomeClick = () => {
        navigate('/AdminDashboard'); // Replace with the correct route for your dashboard
    };

    return (
        <div>
            <button onClick={handleHomeClick}>Home</button> {/* Home Button */}
            <h2>Activity Categories</h2>
            {message && <p>{message}</p>}
            <ul>
                {categories.map((category) => (
                    <li key={category._id}>
                        <pre>{JSON.stringify(category, null, 2)}</pre>
                        {/* This will display each category object as a pretty-printed JSON string */}
                        <hr />
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default ActivityCategories;
