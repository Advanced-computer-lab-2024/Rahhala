import React, { useEffect, useState } from 'react';
import axiosInstance from '../utils/axiosConfig';
import NavigateButton from '../components/UpdateProfileButton';
import Logout from '../components/Auth/Logout';
import './ActivityCategories.css';

const ActivityCategories = () => {
    const [categories, setCategories] = useState([]);
    const [newCategory, setNewCategory] = useState('');
    const [editCategory, setEditCategory] = useState({ id: '', name: '' });
    const [message, setMessage] = useState('');

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const response = await axiosInstance.get('/api/activityCategory');
            setCategories(response.data);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    const createCategory = async () => {
        if (newCategory.length < 3) {
            setMessage('Category name must be at least 3 characters long.');
            return;
        }
        if (categories.some(category => category.name.toLowerCase() === newCategory.toLowerCase())) {
            setMessage('Category name already exists. Please choose another name.');
            return;
        }
        try {
            await axiosInstance.post('/api/activityCategory', { name: newCategory });
            setMessage('Category created successfully!');
            setNewCategory('');
            fetchCategories(); // Refresh the list after creating
        } catch (error) {
            console.error('Error creating category:', error);
            setMessage('Error creating category.');
        }
    };

    const updateCategory = async () => {
        if (editCategory.name.length < 3) {
            setMessage('Category name must be at least 3 characters long.');
            return;
        }
        if (categories.some(category => category.name.toLowerCase() === editCategory.name.toLowerCase() && category._id !== editCategory.id)) {
            setMessage('Category name already exists. Please choose another name.');
            return;
        }
        try {
            await axiosInstance.put(`/api/activityCategory/${editCategory.id}`, { name: editCategory.name });
            setMessage('Category updated successfully!');
            setEditCategory({ id: '', name: '' });
            fetchCategories(); // Refresh the list after updating
        } catch (error) {
            console.error('Error updating category:', error);
            setMessage('Error updating category.');
        }
    };

    const deleteCategory = async (id) => {
        try {
            await axiosInstance.delete(`/api/activityCategory/${id}`);
            setMessage('Category deleted successfully!');
            fetchCategories(); // Refresh the list after deleting
        } catch (error) {
            console.error('Error deleting category:', error);
            setMessage('Error deleting category.');
        }
    };

    return (
        <div className="activity-categories">
            <h2>Activity Categories</h2>
            {message && <p className={message.includes('successfully') ? 'success' : 'error'}>{message}</p>}
            <div className="controls">
                <label>
                    New Category:
                    <input
                        type="text"
                        value={newCategory}
                        onChange={(e) => setNewCategory(e.target.value)}
                        placeholder="New Category Name"
                    />
                </label>
                <button onClick={createCategory}>Create Category</button>
            </div>
            {categories.length > 0 ? (
                <table className="categories-table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>ID</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {categories.map(category => (
                            <tr key={category._id}>
                                <td>{category.name}</td>
                                <td>{category._id}</td>
                                <td>
                                    <button onClick={() => setEditCategory({ id: category._id, name: category.name })}>Edit</button>
                                    <button onClick={() => deleteCategory(category._id)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <div className="loading">Loading categories...</div>
            )}
            {editCategory.id && (
                <div className="controls">
                    <label>
                        Edit Category:
                        <input
                            type="text"
                            value={editCategory.name}
                            onChange={(e) => setEditCategory({ ...editCategory, name: e.target.value })}
                            placeholder="Edit Category Name"
                        />
                    </label>
                    <button onClick={updateCategory}>Update Category</button>
                </div>
            )}
            <div className="navigation-buttons">
                <NavigateButton path="/AdminDashboard" text="Back to Dashboard" />
                <Logout />
            </div>
        </div>
    );
};

export default ActivityCategories;