import React, { useEffect, useState } from 'react';
import axiosInstance from '../utils/axiosConfig';
import NavigateButton from '../components/UpdateProfileButton';
import Logout from '../components/Auth/Logout';
import './PreferenceTagManagement.css';

const PreferenceTagManagement = () => {
    const [tags, setTags] = useState([]);
    const [newTag, setNewTag] = useState('');
    const [editTag, setEditTag] = useState({ id: '', name: '' });
    const [message, setMessage] = useState('');

    useEffect(() => {
        fetchTags();
    }, []);

    const fetchTags = async () => {
        try {
            const response = await axiosInstance.get('/api/preferenceTag');
            setTags(response.data);
        } catch (error) {
            console.error('Error fetching tags:', error);
        }
    };

    const createTag = async () => {
        if (newTag.length < 3) {
            setMessage('Tag name must be at least 3 characters long.');
            return;
        }
        if (tags.some(tag => tag.name.toLowerCase() === newTag.toLowerCase())) {
            setMessage('Tag name already exists. Please choose another name.');
            return;
        }
        try {
            await axiosInstance.post('/api/preferenceTag', { name: newTag });
            setMessage('Tag created successfully!');
            setNewTag('');
            fetchTags(); // Refresh the list after creating
        } catch (error) {
            console.error('Error creating tag:', error);
            setMessage('Error creating tag.');
        }
    };

    const updateTag = async () => {
        if (editTag.name.length < 3) {
            setMessage('Tag name must be at least 3 characters long.');
            return;
        }
        if (tags.some(tag => tag.name.toLowerCase() === editTag.name.toLowerCase() && tag._id !== editTag.id)) {
            setMessage('Tag name already exists. Please choose another name.');
            return;
        }
        try {
            await axiosInstance.put(`/api/preferenceTag/${editTag.id}`, { name: editTag.name });
            setMessage('Tag updated successfully!');
            setEditTag({ id: '', name: '' });
            fetchTags(); // Refresh the list after updating
        } catch (error) {
            console.error('Error updating tag:', error);
            setMessage('Error updating tag.');
        }
    };

    const deleteTag = async (id) => {
        try {
            await axiosInstance.delete(`/api/preferenceTag/${id}`);
            setMessage('Tag deleted successfully!');
            fetchTags(); // Refresh the list after deleting
        } catch (error) {
            console.error('Error deleting tag:', error);
            setMessage('Error deleting tag.');
        }
    };

    return (
        <div className="preference-tag-management">
            <h2>Preference Tag Management</h2>
            {message && <p className={message.includes('successfully') ? 'success' : 'error'}>{message}</p>}
            <div className="controls">
                <label>
                    New Tag:
                    <input
                        type="text"
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value)}
                        placeholder="New Tag Name"
                    />
                </label>
                <button onClick={createTag}>Create Tag</button>
            </div>
            {tags.length > 0 ? (
                <table className="tags-table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>ID</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tags.map(tag => (
                            <tr key={tag._id}>
                                <td>{tag.name}</td>
                                <td>{tag._id}</td>
                                <td>
                                    <button onClick={() => setEditTag({ id: tag._id, name: tag.name })}>Edit</button>
                                    <button onClick={() => deleteTag(tag._id)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <div className="loading">Loading tags...</div>
            )}
            {editTag.id && (
                <div className="controls">
                    <label>
                        Edit Tag:
                        <input
                            type="text"
                            value={editTag.name}
                            onChange={(e) => setEditTag({ ...editTag, name: e.target.value })}
                            placeholder="Edit Tag Name"
                        />
                    </label>
                    <button onClick={updateTag}>Update Tag</button>
                </div>
            )}
            <div className="navigation-buttons">
                <NavigateButton path="/AdminDashboard" text="Back to Dashboard" />
                <Logout />
            </div>
        </div>
    );
};

export default PreferenceTagManagement;