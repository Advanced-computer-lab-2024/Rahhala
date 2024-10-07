import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import axiosInstance from '../utils/axiosConfig';
import { useNavigate } from 'react-router-dom';
import NavigateButton from '../components/UpdateProfileButton';
import '../table.css';

const ViewAll = () => {
    const [activities, setActivities] = useState(null);
    const [itineraries, setItineraries] = useState(null);
    const [museums, setMuseums] = useState(null);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const fetchAll = async () => {
            try {
                const response = await axiosInstance.get('/viewAll');
                setActivities(response.data.activities);
                setItineraries(response.data.itineraries);
                setMuseums(response.data.museums);
            } catch (err) {
                setError('Failed to load tourist profile.');
            }
        }
        fetchAll();
    }, []);

    const handleSearch = (e) => {
        setSearchQuery(e.target.value.toLowerCase());
    };

    const filterByName = (items) => {
        return items.filter(item => item.name.toLowerCase().includes(searchQuery));
    };

    return (
        <div>
            <NavigateButton path='/touristAccount' text='Home'/>{'\u00A0'} <br/><br/>
            <NavigateButton path='/getActivities' text='Activities'/>{'\u00A0'}
            <NavigateButton path='/touristItineraries' text='Itineraries'/>{'\u00A0'}
            <NavigateButton path='/getMuseums' text='Museums'/>

            <br/><br/>

            <input
                type="text"
                placeholder="Search by name"
                value={searchQuery}
                onChange={handleSearch}
            />
            <br/><br/>

            <h2>Activities</h2>
            {activities ? (
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Date</th>
                            <th>Time</th>
                            <th>Location</th>
                            <th>Price</th>
                            <th>Category</th>
                            <th>Tags</th>
                            <th>Special Discounts</th>
                            <th>Booking Open</th>
                            <th>Rating</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filterByName(activities).map((activity, index) => (
                            <tr key={index}>
                                <td>{activity.name}</td>
                                <td>{new Date(activity.date).toLocaleDateString()}</td>
                                <td>{activity.time}</td>
                                <td>{activity.location.join(', ')}</td>
                                <td>{activity.price}</td>
                                <td>{activity.category}</td>
                                <td>{activity.tags.join(', ')}</td>
                                <td>{activity.specialDiscounts}</td>
                                <td>{activity.bookingOpen ? 'Yes' : 'No'}</td>
                                <td>{activity.rating}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <div>Loading activities...</div>
            )}

            <h2>Itineraries</h2>
            {itineraries ? (
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Activities</th>
                            <th>Location</th>
                            <th>Timeline</th>
                            <th>Language</th>
                            <th>Price</th>
                            <th>Available Dates</th>
                            <th>Accessibility</th>
                            <th>Pickup Location</th>
                            <th>Dropoff Location</th>
                            <th>Rating</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filterByName(itineraries).map((itinerary, index) => (
                            <tr key={index}>
                                <td>{itinerary.name}</td>
                                <td>{itinerary.activityDetails.map(detail => detail.name).join(', ')}</td>
                                <td>{itinerary.location.map(loc => loc.join(', ')).join(' | ')}</td>
                                <td>{itinerary.timeline}</td>
                                <td>{itinerary.language}</td>
                                <td>{itinerary.price}</td>
                                <td>{itinerary.availableDates.map(date => new Date(date).toLocaleDateString()).join(', ')}</td>
                                <td>{itinerary.accessibility.join(', ')}</td>
                                <td>{itinerary.pickupLocation}</td>
                                <td>{itinerary.dropoffLocation}</td>
                                <td>{itinerary.rating}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <div>Loading itineraries...</div>
            )}

            <h2>Museums</h2>
            {museums ? (
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Description</th>
                            <th>Location</th>
                            <th>Opening Hours</th>
                            <th>Ticket Prices</th>
                            <th>Tags</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filterByName(museums).map((museum, index) => (
                            <tr key={index}>
                                <td>{museum.name}</td>
                                <td>{museum.description}</td>
                                <td>{museum.location}</td>
                                <td>{museum.openingHours}</td>
                                <td>{museum.ticketPrices}</td>
                                <td>{museum.tags.join(', ')}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <div>Loading museums...</div>
            )}
            <br/>
        </div>
    )
}

export default ViewAll;