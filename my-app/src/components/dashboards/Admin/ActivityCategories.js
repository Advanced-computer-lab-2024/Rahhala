import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../../utils/axiosConfig';
import { AuthContext } from '../../../context/AuthContext';
import AdminHeader from './AdminHeader';

const ActivityCategories = () => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const { auth } = useContext(AuthContext);
    const navigate = useNavigate();
    const [categories, setCategories] = useState([]);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [editCategory, setEditCategory] = useState({});
    const [createModalOpen, setCreateModalOpen] = useState(false);
    const [newCategory, setNewCategory] = useState('');

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axiosInstance.get('/api/activityCategory');
                setCategories(response.data);
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };
        fetchCategories();
    }, []);

    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    };

    const handleEdit = async (id) => {
        if (editCategory.name.length < 3) {
            alert('Category name must be at least 3 characters long.');
            return;
        }
        if (categories.some(category => category.name.toLowerCase() === editCategory.name.toLowerCase() && category._id !== editCategory._id)) {
            alert('Category name already exists. Please choose another name.');
            return;
        }
        try {
            await axiosInstance.put(`/api/activityCategory/${editCategory._id}`, { name: editCategory.name });
            alert('Category updated successfully!');
            setEditCategory({});
            setEditModalOpen(false);
            window.location.reload();
        } catch (error) {
            console.error('Error updating category:', error);
            alert(error.response.data.message || 'Error updating category.');
        }
    };

    const renderEditModal = () => {
        if (!editModalOpen || !editCategory) return null;
        return (
            <div className="fixed top-0 left-0 w-full h-full bg-gray-900 bg-opacity-50 flex items-center justify-center">
                <div className="bg-white p-4 rounded-lg">
                    <h2 className="text-2xl font-bold mb-4">Edit Category</h2>
                    <input 
                        type="text" 
                        value={editCategory.name} 
                        onChange={(e) => setEditCategory({ ...editCategory, name: e.target.value })} 
                        className="w-full border border-gray-300 rounded p-2 mb-4" 
                    />
                    <button 
                        className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded"
                        onClick={() => handleEdit(editCategory._id)}
                    >
                        Save
                    </button>
                    &nbsp;
                    <button 
                        className="bg-gray-500 hover:bg-gray-700 text-white py-2 px-4 rounded"
                        onClick={() => setEditModalOpen(false)}
                    >
                        Cancel
                    </button>
                </div>
            </div>
        );
    };

    const handleDelete = async (id) => {
        try {
            await axiosInstance.delete(`/api/activityCategory/${id}`);
            alert('Category deleted successfully!');
            window.location.reload();
        } catch (error) {
            console.error('Error deleting category:', error);
            alert(error.response.data.message || 'Error deleting category.');
        }
    };

    const renderCreateCategoryModal = () => {
        return (
            <div className="fixed top-0 left-0 w-full h-full bg-gray-900 bg-opacity-50 flex items-center justify-center">
                <div className="bg-white p-4 rounded-lg">
                    <h2 className="text-2xl font-bold mb-4">Create Category</h2>
                    <input
                        type="text"
                        value={newCategory}
                        onChange={(e) => setNewCategory(e.target.value)}
                        className="w-full border border-gray-300 rounded p-2 mb-4"
                    />
                    <button
                        className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded"
                        onClick={() => createCategory()}
                    >
                        Create
                    </button>
                    &nbsp;
                    <button
                        className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded"
                        onClick={() => setCreateModalOpen(false)}
                    >
                        Cancel
                    </button>
                </div>
            </div>
        );
    };

    const createCategory = async () => {
        if (newCategory.length < 3) {
            alert('Category name must be at least 3 characters long.');
            return;
        }
        if (categories.some(category => category.name.toLowerCase() === newCategory.toLowerCase())) {
            alert('Category name already exists. Please choose another name.');
            return;
        }
        try {
            await axiosInstance.post('/api/activityCategory', { name: newCategory });
            alert('Category created successfully!');
            setNewCategory('');
            window.location.reload();
        } catch (error) {
            console.error('Error creating category:', error);
            alert(error.response.data.message || 'Error creating category.');
        }
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <AdminHeader toggleDropdown={toggleDropdown} dropdownOpen={dropdownOpen} />
            <button
                onClick={() => navigate(-1)}
                className="text-blue-500 mt-4 ml-4 flex items-center"
            >
                ← Back
            </button>

            <div className="flex justify-center mt-20">
                <div className="space-y-4 max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg text-sm">
                    <h1 className="text-3xl font-bold mb-4">Activity Categories</h1>
                    {editModalOpen && renderEditModal()}
                    {createModalOpen && renderCreateCategoryModal()}
                    <table className="min-w-full bg-white border border-gray-200 text-lg">
                        <thead>
                            <tr>
                                <th className="py-2 px-4 border-b border-gray-200 text-center">Name</th>
                                <th className="py-2 px-4 border-b border-gray-200 text-center">ID</th>
                                <th className="py-2 px-4 border-b border-gray-200 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {categories.map((category) => (
                                <tr key={category._id} className="hover:bg-gray-100">
                                    <td className="py-2 px-4 border-b border-gray-200 text-center font-bold italic text-blue-800">{category.name}</td>
                                    <td className="py-2 px-8 border-b border-gray-200 text-center">{category._id}</td>
                                    <td className="py-2 px-4 border-b border-gray-200 text-center">
                                        <button 
                                            className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded"
                                            onClick={() => {
                                                setEditCategory(category);
                                                setEditModalOpen(true);
                                            }}
                                        >
                                            Edit
                                        </button>
                                        &nbsp;
                                        <button 
                                            className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded"
                                            onClick={() => handleDelete(category._id)}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <button
                        className="bg-green-500 hover:bg-green-700 text-white py-2 px-4 rounded"
                        onClick={() => {
                            setCreateModalOpen(true);
                            setEditModalOpen(false);
                            setEditCategory({});
                        }}
                    >
                        Create Category
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ActivityCategories;