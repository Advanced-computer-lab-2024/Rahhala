import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import axiosInstance from '../utils/axiosConfig';
import { useNavigate } from 'react-router-dom';
import NavigateButton from '../components/UpdateProfileButton';
import '../table.css';

const Activities = () => {
    const navigate = useNavigate(); // Initialize navigate
    const [activities, setActivities] = useState(null);
    const [error, setError] = useState('');
    const [budget, setBudget] = useState('');
    const [date, setDate] = useState('');
    const [category, setCategory] = useState('');
    const [sortCriteria, setSortCriteria] = useState('');
    const [sortOrder, setSortOrder] = useState('asc');
    const [tags, setTags] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const { auth } = useContext(AuthContext); // Get auth context
    let homePath;
    if (auth.user && auth.user.type === 'tourist') {
        homePath = '/viewAll';
    }
    else {
        homePath = '/advertiser-dashboard';
    }
    useEffect(() => {
        const fetchActivities = async () => {
            try {
                const response = await axiosInstance.get('/api/activity');
                console.log(response.data);
                setActivities(response.data);
            } catch (err) {
                setError('Failed to fetch activities');
            }
        };
        fetchActivities();
    }, []);

    const filterActivities = () => {
        return activities.filter(activity => {
            return (
                (budget ? parseFloat(activity.price.replace(/[^0-9.-]+/g,"")).toString().startsWith(budget) : true) &&
                (date ? new Date(activity.date).toDateString().startsWith(new Date(date).toDateString()) : true) &&
                (category ? activity.category.toLowerCase().startsWith(category.toLowerCase()) : true) &&
                (tags ? tags.split(',').every(tag => activity.tags.some(activityTag => activityTag.toLowerCase().includes(tag.trim().toLowerCase()))) : true) &&
                (searchQuery ? activity.name.toLowerCase().includes(searchQuery.toLowerCase()) : true)
            );
        });
    };

    const sortActivities = (activities) => {
        if (!sortCriteria) return activities;
        return activities.sort((a, b) => {
            if (sortCriteria === 'price') {
                return sortOrder === 'asc' ? parseFloat(a.price.replace(/[^0-9.-]+/g,"")) - parseFloat(b.price.replace(/[^0-9.-]+/g,"")) : parseFloat(b.price.replace(/[^0-9.-]+/g,"")) - parseFloat(a.price.replace(/[^0-9.-]+/g,""));
            } else if (sortCriteria === 'date') {
                return sortOrder === 'asc' ? new Date(a.date) - new Date(b.date) : new Date(b.date) - new Date(a.date);
            }
            return 0;
        });
    };

    const handleTagsChange = (e) => {
        setTags(e.target.value);
    };

    const filteredActivities = activities ? filterActivities() : [];
    const sortedActivities = sortActivities(filteredActivities);

    return (
        <div>
            <div>
                <label>
                    Budget:
                    <input min="0" type="number" value={budget} onChange={(e) => setBudget(e.target.value)} />
                </label>
                <label>
                    Date:
                    <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
                </label>
                <label>
                    Category:
                    <input type="text" value={category} onChange={(e) => setCategory(e.target.value)} />
                </label>
                <label>
                    Tags (comma separated):
                    <input type="text" value={tags} onChange={handleTagsChange} />
                </label>
                <label>
                    Sort by:
                    <select value={sortCriteria} onChange={(e) => setSortCriteria(e.target.value)}>
                        <option value="">None</option>
                        <option value="price">Price</option>
                        <option value="date">Date</option>
                    </select>
                </label>
                <label>
                    Order:
                    <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
                        <option value="asc">Ascending</option>
                        <option value="desc">Descending</option>
                    </select>
                </label>
                <label>
                    Search by name:
                    <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                </label>
            </div>
            {activities ? (
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Price</th>
                            <th>Date</th>
                            <th>Category</th>
                            <th>Tags</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sortedActivities.map(activity => (
                            <tr key={activity._id}>
                                <td>{activity.name}</td>
                                <td>{activity.price}</td>
                                <td>{new Date(activity.date).toLocaleDateString()}</td>
                                <td>{activity.category}</td>
                                <td>{activity.tags.join(', ')}</td>
                                <NavigateButton path={`/getActivity/${activity._id}`} text='More Info'/>{'\u00A0'}
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <div>Loading activities...</div>
            )}
            {error && <div>{error}</div>}
            <NavigateButton path={homePath} text='Back'/>{'\u00A0'}
        </div>
    );
};

export default Activities;