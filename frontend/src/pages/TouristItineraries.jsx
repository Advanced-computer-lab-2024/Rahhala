import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import axiosInstance from '../utils/axiosConfig';
import { useNavigate } from 'react-router-dom';
import NavigateButton from '../components/UpdateProfileButton';
import '../table.css';

const TouristItineraries = () => {
    const [itineraries, setItineraries] = useState([]);
    const [error, setError] = useState('');
    const { auth } = useContext(AuthContext);
    const navigate = useNavigate();

    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedTags, setSelectedTags] = useState([]);
    const [selectedLanguage, setSelectedLanguage] = useState('');
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        if (auth.isAuthenticated && auth.user) {
            fetchItineraries();
        }
    }, [auth]);

    const fetchItineraries = async () => {
        try {
            const response = await axiosInstance.get('/api/itinerary');
            setItineraries(response.data);
        } catch (err) {
            setError('Failed to fetch itineraries');
        }
    };

    const filterItineraries = () => {
        return itineraries.filter(itinerary => {
            return (
                (minPrice ? parseFloat(itinerary.price.replace(/[^0-9.-]+/g,"")) >= parseFloat(minPrice) : true) &&
                (maxPrice ? parseFloat(itinerary.price.replace(/[^0-9.-]+/g,"")) <= parseFloat(maxPrice) : true) &&
                (selectedDate ? new Date(itinerary.date).toDateString() === new Date(selectedDate).toDateString() : true) &&
                (selectedTags.length ? selectedTags.every(tag => itinerary.tags.includes(tag)) : true) &&
                (selectedLanguage ? itinerary.language === selectedLanguage : true) &&
                (searchQuery ? itinerary.name.toLowerCase().includes(searchQuery.toLowerCase()) : true)
            );
        });
    };

    const handleTagsChange = (e) => {
        const tagsArray = e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag);
        setSelectedTags(tagsArray);
    };

    const filteredItineraries = filterItineraries();

    return (
        <div>
            <div>
                <label>
                    Min Price:
                    <input min="0" type="number" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} />
                </label>
                <label>
                    Max Price:
                    <input min="0" type="number" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} />
                </label>
                <label>
                    Date:
                    <input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} />
                </label>
                <label>
                    Tags (comma separated):
                    <input type="text" value={selectedTags.join(', ')} onChange={handleTagsChange} />
                </label>
                <label>
                    Language:
                    <input type="text" value={selectedLanguage} onChange={(e) => setSelectedLanguage(e.target.value)} />
                </label>
                <label>
                    Search by name:
                    <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                </label>
            </div>
            {itineraries.length > 0 ? (
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Price</th>
                            <th>Date</th>
                            <th>Tags</th>
                            <th>Language</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredItineraries.map(itinerary => (
                            <tr key={itinerary._id}>
                                <td>{itinerary.name}</td>
                                <td>{itinerary.price}</td>
                                <td>{new Date(itinerary.date).toLocaleDateString()}</td>
                                <td>{itinerary.tags.join(', ')}</td>
                                <td>{itinerary.language}</td>
                                <td>
                                    <NavigateButton path={`/getItinerary/${itinerary._id}`} text='More Info' />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <div>Loading itineraries...</div>
            )}
            {error && <div>{error}</div>}
            <NavigateButton path='/viewAll' text='Back' />
        </div>
    );
};

export default TouristItineraries;
