import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import axiosInstance from '../utils/axiosConfig';
import { useNavigate } from 'react-router-dom';
import NavigateButton from '../components/UpdateProfileButton';
import '../table.css';

const MuseumTags = () => {
    const [museumTags, setMuseumTags] = useState([]);
    const [formData, setFormData] = useState({ type: '', historicalPeriod: '' });
    const [editingTag, setEditingTag] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchMuseumTags();
    }, []);

    const fetchMuseumTags = async () => {
        try {
            const response = await axiosInstance.get('/api/museumTags');
            setMuseumTags(response.data);
        } catch (error) {
            setError('Failed to fetch museum tags');
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingTag) {
                await axiosInstance.put(`/api/museumTags/${editingTag._id}`, formData);
            } else {
                await axiosInstance.post('/api/museumTags', formData);
            }
            setFormData({ type: '', historicalPeriod: '' });
            setEditingTag(null);
            fetchMuseumTags();
        } catch (error) {
            setError('Failed to save museum tag');
        }
    };

    const handleEdit = (tag) => {
        setFormData({ type: tag.type, historicalPeriod: tag.historicalPeriod });
        setEditingTag(tag);
    };

    const handleDelete = async (id) => {
        try {
            await axiosInstance.delete(`/api/museumTags/${id}`);
            fetchMuseumTags();
        } catch (error) {
            setError('Failed to delete museum tag');
        }
    };

    return (
        <div>
            <h1>Museum Tags</h1>
            {error && <div>{error}</div>}
            <form onSubmit={handleSubmit}>
                <label>
                    Type:
                    <select name="type" value={formData.type} onChange={handleChange} required>
                        <option value="">Select Type</option>
                        <option value="Monuments">Monuments</option>
                        <option value="Museums">Museums</option>
                        <option value="Religious Sites">Religious Sites</option>
                        <option value="Palaces/Castles">Palaces/Castles</option>
                    </select>
                </label>
                <label>
                    Historical Period:
                    <input
                        type="text"
                        name="historicalPeriod"
                        value={formData.historicalPeriod}
                        onChange={handleChange}
                        required
                    />
                </label>
                <button type="submit">{editingTag ? 'Update' : 'Create'}</button>
            </form>
            <table>
                <thead>
                    <tr>
                        <th>Type</th>
                        <th>Historical Period</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {museumTags.map((tag) => (
                        <tr key={tag._id}>
                            <td>{tag.type}</td>
                            <td>{tag.historicalPeriod}</td>
                            <td>
                                <button onClick={() => handleEdit(tag)}>Edit</button>
                                <button onClick={() => handleDelete(tag._id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <NavigateButton path="/" text="Back" />
        </div>
    );
};

export default MuseumTags;