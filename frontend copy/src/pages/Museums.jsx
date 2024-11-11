import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import axiosInstance from '../utils/axiosConfig';
import { useNavigate } from 'react-router-dom';
import NavigateButton from '../components/UpdateProfileButton';
import '../table.css';

const Museums = () => {
    const [museums, setMuseums] = useState([]);
    const [error, setError] = useState('');
    const { auth } = useContext(AuthContext);
    const navigate = useNavigate();

    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [selectedTags, setSelectedTags] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        if (auth.isAuthenticated && auth.user) {
            fetchMuseums();
        }
    }, [auth]);

    useEffect(() => {
        filterMuseums();
    }, [minPrice, maxPrice, selectedTags, searchQuery, museums]);

    const fetchMuseums = async () => {
        try {
            const response = await axiosInstance.get('/api/museum');
            setMuseums(response.data);
        } catch (err) {
            setError('Failed to fetch museums.');
            console.error(err);
        }
    };

    const filterMuseums = () => {
        return museums.filter(museum => {
            return (
                (!minPrice || museum.foreignerPrice >= minPrice) &&
                (!maxPrice || museum.foreignerPrice <= maxPrice) &&
                (!selectedTags.length || selectedTags.every(tag => museum.tags.includes(tag))) &&
                (!searchQuery || museum.name.toLowerCase().includes(searchQuery.toLowerCase()))
            );
        });
    };

    const handleTagsChange = (e) => {
        const tagsArray = e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag);
        setSelectedTags(tagsArray);
    };

    const filteredMuseums = museums ? filterMuseums() : [];

    return (
        <div>
            <h2>Museums</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}

            <div>
                <label>
                    Min Price:
                    <input type="number" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} />
                </label>
                <label>
                    Max Price:
                    <input type="number" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} />
                </label>
                <label>
                    Tags (comma separated):
                    <input type="text" value={selectedTags.join(', ')} onChange={handleTagsChange} />
                </label>
                <label>
                    Search by name:
                    <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                </label>
            </div>

            {filteredMuseums.length === 0 ? (
                <p>No museums available.</p>
            ) : (
                <table className="itinerary-table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Description</th>
                            <th>Location</th>
                            <th>Opening Hours</th>
                            <th>Foreigner Price</th>
                            <th>Native Price</th>
                            <th>Student Price</th>
                            <th>Tags</th>
                            <th>More Info</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredMuseums.map(museum => (
                            <tr key={museum._id}>
                                <td>{museum.name}</td>
                                <td>{museum.description}</td>
                                <td>{museum.location}</td>
                                <td>{museum.openingHours}</td>
                                <td>${museum.foreignerPrice}</td>
                                <td>${museum.nativePrice}</td>
                                <td>${museum.studentPrice}</td>
                                <td>{Array.isArray(museum.tags) ? museum.tags.map(tag => tag.name).join(', ') : ''}</td>
                                <td><NavigateButton path={`/getMuseum/${museum._id}`} text='More Info'/>{'\u00A0'}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
            <NavigateButton path='/viewAll' text='Back'/>{'\u00A0'}
        </div>
    );
};

export default Museums;