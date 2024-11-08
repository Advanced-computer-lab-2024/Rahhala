import React, { useEffect, useState } from 'react';
import axiosInstance from '../utils/axiosConfig';
import { useNavigate } from 'react-router-dom';
import NavigateButton from '../components/UpdateProfileButton';
import '../table.css';

function ActivityCategories() {
    const [categories, setCategories] = useState([]);
    const [error, setError] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [sortOrder, setSortOrder] = useState('asc');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axiosInstance.get('/api/activityCategory');
                setCategories(response.data);
            } catch (error) {
                setError('Failed to fetch categories');
            }
        };

        fetchCategories();
    }, []);

    const filterCategories = () => {
        return categories.filter(category => {
            return searchQuery ? category.name.toLowerCase().includes(searchQuery.toLowerCase()) : true;
        });
    };

    const sortCategories = (categories) => {
        return categories.sort((a, b) => {
            return sortOrder === 'asc' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
        });
    };

    const filteredCategories = filterCategories();
    const sortedCategories = sortCategories(filteredCategories);

    const handleHomeClick = () => {
        navigate('/AdminDashboard'); // Replace with the correct route for your dashboard
    };

    return (
        <div>
            <h2>Activity Categories</h2>
            <div>
                <label>
                    Sort by name:
                    <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
                        <option value="asc">Ascending</option>
                        <option value="desc">Descending</option>
                    </select>
                </label>
                <label>
                    Search by name:
                    <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                </label>
            </div>
            {categories.length > 0 ? (
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>ID</th>
                            <th>Created At</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sortedCategories.map(category => (
                            <tr key={category._id}>
                                <td>{category.name}</td>
                                <td>{category._id}</td>
                                <td>{new Date(category.createdAt).toLocaleString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <div>Loading categories...</div>
            )}
            {error && <div>{error}</div>}
            <NavigateButton path='/AdminDashboard' text='Back' />
        </div>
    );
}

export default ActivityCategories;