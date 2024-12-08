import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../../utils/axiosConfig';
import { AuthContext } from '../../../context/AuthContext';
import AdminHeader from './AdminHeader';

const PreferenceTags = () => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const { auth } = useContext(AuthContext);
    const navigate = useNavigate();
    const [preferenceTags, setPreferenceTags] = useState([]);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [editTag, setEditTag] = useState({});
    const [createModalOpen, setCreateModalOpen] = useState(false);
    const [newTag, setNewTag] = useState('');

    useEffect(() => {
        const fetchTags = async () => {
            try {
                const response = await axiosInstance.get('/api/preferenceTag');
                setPreferenceTags(response.data);
            } catch (error) {
                console.error('Error fetching tags:', error);
            }
        };
        fetchTags();
    }, []);

    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    };

    const handleEdit = async (id) => {
        if (editTag.name.length < 3) {
            alert('Tag name must be at least 3 characters long.');
            return;
        }
        if (preferenceTags.some(tag => tag.name.toLowerCase() === editTag.name.toLowerCase() && tag._id !== editTag._id)) {
            alert('Tag name already exists. Please choose another name.');
            return;
        }
        try {
            await axiosInstance.put(`/api/preferenceTag/${editTag._id}`, { name: editTag.name });
            alert('Tag updated successfully!');
            setEditTag({});
            setEditModalOpen(false);
            window.location.reload();
        } catch (error) {
            console.error('Error updating tag:', error);
            alert(error.response.data.message || 'Error updating tag.');
        }

    };

    const renderEditModal = () => {
        if (!editModalOpen || !editTag) return null;
        return (
            <div className="fixed top-0 left-0 w-full h-full bg-gray-900 bg-opacity-50 flex items-center justify-center">
                <div className="bg-white p-4 rounded-lg">
                    <h2 className="text-2xl font-bold mb-4">Edit Tag</h2>
                    <input 
                        type="text" 
                        value={editTag.name} 
                        onChange={(e) => setEditTag({ ...editTag, name: e.target.value })} 
                        className="w-full border border-gray-300 rounded p-2 mb-4" 
                    />
                    <button 
                        className="bg-blue-500 hover:bg-blue-700 text-white  py-2 px-4 rounded"
                        onClick={() => handleEdit(editTag._id)}
                        >
                        Save
                    </button>
                    &nbsp;
                    <button 
                        className="bg-gray-500 hover:bg-gray-700 text-white  py-2 px-4 rounded"
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
            await axiosInstance.delete(`/api/preferenceTag/${id}`);
            alert('Tag deleted successfully!');
            window.location.reload();
        } catch (error) {
            console.error('Error deleting tag:', error);
            alert(error.response.data.message || 'Error updating tag.');
        }

    }

    const renderCreateTagModal = () => {
        return (
            <div className="fixed top-0 left-0 w-full h-full bg-gray-900 bg-opacity-50 flex items-center justify-center">
                <div className="bg-white p-4 rounded-lg">
                    <h2 className="text-2xl font-bold mb-4">Create Tag</h2>
                    <input
                        type="text"
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value)}
                        className="w-full border border-gray-300 rounded p-2 mb-4"
                    />
                    <button
                        className="bg-blue-500 hover:bg-blue-700 text-white  py-2 px-4 rounded"
                        onClick={() => createTag()}
                    >
                        Create
                    </button>
                    &nbsp;
                    <button
                        className="bg-red-600 hover:bg-red-700 text-white  py-2 px-4 rounded"
                        onClick={() => setCreateModalOpen(false)}
                    >
                        Cancel
                    </button>
                </div>
            </div>
        );
    };

    const createTag = async () => {
        if (newTag.length < 3) {
            alert('Tag name must be at least 3 characters long.');
            return;
        }
        if (preferenceTags.some(tag => tag.name.toLowerCase() === newTag.toLowerCase())) {
            alert('Tag name already exists. Please choose another name.');
            return;
        }
        try {
            await axiosInstance.post('/api/preferenceTag', { name: newTag });
            alert('Tag created successfully!');
            setNewTag('');
            window.location.reload();
        } catch (error) {
            console.error('Error creating tag:', error);
            alert(error.response.data.message || 'Error creating tag.');
        }

    }
    
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
                    <h1 className="text-3xl font-bold mb-4">Preference Tags</h1>
                    {editModalOpen && renderEditModal()}
                    {createModalOpen && renderCreateTagModal()}
                    <table className="min-w-full bg-white border border-gray-200 text-lg">
                        <thead>
                            <tr>
                                <th className="py-2 px-4 border-b border-gray-200 text-center">Name</th>
                                <th className="py-2 px-4 border-b border-gray-200 text-center">ID</th>
                                <th className="py-2 px-4 border-b border-gray-200 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {preferenceTags.map((tag) => (
                                <tr key={tag._id} className="hover:bg-gray-100">
                                    <td className="py-2 px-4 border-b border-gray-200 text-center font-bold italic text-blue-800">{tag.name}</td>
                                    <td className="py-2 px-8 border-b border-gray-200 text-center">{tag._id}</td>
                                    <td className="py-2 px-4 border-b border-gray-200 text-center">
                                        <button 
                                            className="bg-blue-500 hover:bg-blue-700 text-white  py-2 px-4 rounded"
                                            onClick={() => {
                                                setEditTag(tag);
                                                setEditModalOpen(true);
                                            }}
                                            >
                                            Edit
                                        </button>
                                        &nbsp;
                                        <button 
                                            className="bg-red-600 hover:bg-red-700 text-white  py-2 px-4 rounded"
                                            onClick={() => handleDelete(tag._id)}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <button
                        className="bg-green-500 hover:bg-green-700 text-white  py-2 px-4 rounded"
                        onClick={() => {
                            setCreateModalOpen(true)
                            setEditModalOpen(false);
                            setEditTag({});                    
                        }}
                    >
                        Create Tag
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PreferenceTags;