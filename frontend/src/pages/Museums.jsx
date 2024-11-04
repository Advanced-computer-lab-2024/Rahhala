import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import axiosInstance from '../utils/axiosConfig';
import { useNavigate } from 'react-router-dom';
import NavigateButton from '../components/UpdateProfileButton';
import '../table.css';

const Museums = () => {
    const navigate = useNavigate(); // Initialize navigate
    const [museums, setMuseums] = useState(null);
    const [error, setError] = useState('');
    const [tags, setTags] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const fetchMuseums = async () => {
            const response = await axiosInstance.get('/museums');
            setMuseums(response.data);
        }
        fetchMuseums();
    }, []);

    const filterMuseums = () => {
        return museums.filter(museum => {
            return (
                (tags.length ? tags.every(tag => museum.tags.includes(tag)) : true) &&
                (searchQuery ? museum.name.toLowerCase().includes(searchQuery.toLowerCase()) : true)
            );
        });
    };

    const handleTagsChange = (e) => {
        const tagsArray = e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag);
        setTags(tagsArray);
    };

    const filteredMuseums = museums ? filterMuseums() : [];

    return (
        <div>
            <div>
                <label>
                    Tags (comma separated):
                    <input type="text" value={tags.join(', ')} onChange={handleTagsChange} />
                </label>
                <label>
                    Search by name:
                    <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                </label>
            </div>
            <h1>Museums</h1>
            {museums ? (
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Location</th>
                            <th>Tags</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredMuseums.map((museum, index) => (
                            <tr key={index}>
                                <td>{museum.name}</td>
                                <td>{museum.location}</td>
                                <td>{museum.tags.join(', ')}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <div>Loading profile...</div>
            )}
            <br/>
            <NavigateButton path='/viewAll' text='Back'/>{'\u00A0'}
        </div>
    )
}

export default Museums;