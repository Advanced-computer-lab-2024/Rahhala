// src/components/ActivityCategories.jsx
import React, { useEffect, useState } from 'react';
import axiosInstance from '../utils/axiosConfig';

function ActivityCategories() {
    const [categories, setCategories] = useState([]);
    const [message, setMessage] = useState('');

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

    return (
        <div>
            <h2>Activity Categories</h2>
            {message && <p>{message}</p>}
            <ul>
                {categories.map((category) => (
                    <li key={category._id}>{category.name}</li>
                ))}
            </ul>
        </div>
    );
}

export default ActivityCategories;
