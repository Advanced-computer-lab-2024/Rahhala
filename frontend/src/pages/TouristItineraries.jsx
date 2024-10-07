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

    useEffect(() => {
        filterItineraries();
    }, [minPrice, maxPrice, selectedDate, selectedTags, selectedLanguage, searchQuery, itineraries]);

    const fetchItineraries = async () => {
        try {
            const response = await axiosInstance.get('/getItineraries');
            setItineraries(response.data);
        } catch (err) {
            setError('Failed to fetch itineraries.');
            console.error(err);
        }
    };

    const filterItineraries = () => {
        return itineraries.filter(itinerary => {
            return (
                (!minPrice || itinerary.price >= minPrice) &&
                (!maxPrice || itinerary.price <= maxPrice) &&
                (!selectedDate || itinerary.availableDates.some(date => new Date(date).toDateString() === new Date(selectedDate).toDateString())) &&
                (!selectedTags.length || selectedTags.every(tag => itinerary.tags.includes(tag))) &&
                (!selectedLanguage || itinerary.language === selectedLanguage) &&
                (!searchQuery || itinerary.name.toLowerCase().includes(searchQuery.toLowerCase()))
            );
        });
    };

    const filteredItineraries = itineraries ? filterItineraries() : [];

    return (
        <div>
            <h2>Your Itineraries</h2>
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
                    Date:
                    <input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} />
                </label>
                <label>
                    Tags:
                    <input type="text" value={selectedTags.join(', ')} onChange={(e) => setSelectedTags(e.target.value.split(',').map(tag => tag.trim()))} />
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

            {filteredItineraries.length === 0 ? (
                <p>No itineraries available.</p>
            ) : (
                <table className="itinerary-table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Timeline</th>
                            <th>Locations</th>
                            <th>Language</th>
                            <th>Price</th>
                            <th>Pickup Location</th>
                            <th>Dropoff Location</th>
                            <th>Available Dates</th>
                            <th>Tags</th>
                            <th>Activities</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredItineraries.map(itinerary => (
                            <tr key={itinerary._id}>
                                <td>{itinerary.name}</td>
                                <td>{itinerary.timeline}</td>
                                <td>{itinerary.location.map(loc => `(${loc[0]}, ${loc[1]})`).join(', ')}</td>
                                <td>{itinerary.language}</td>
                                <td>${itinerary.price}</td>
                                <td>{itinerary.pickupLocation}</td>
                                <td>{itinerary.dropoffLocation}</td>
                                <td>{itinerary.availableDates.join(', ')}</td>
                                <td>{itinerary.tags.join(', ')}</td>
                                <td>
                                    <ul>
                                        {itinerary.activityDetails.map(activity => (
                                            <li key={activity.activityId}>
                                                <strong>{activity.name}</strong> - Duration: {activity.duration}
                                            </li>
                                        ))}
                                    </ul>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
            <NavigateButton path='/viewAll' text='Back'/>{'\u00A0'}
        </div>
    );
};

export default TouristItineraries;