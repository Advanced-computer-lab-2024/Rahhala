import React, { useEffect, useState, useContext } from 'react';
import axiosInstance from '../utils/axiosConfig';
import { AuthContext } from '../context/AuthContext';
import NavigateButton from '../components/UpdateProfileButton';
import Logout from '../components/Auth/Logout';
import { useNavigate } from 'react-router-dom';
import '../table.css';

const Activities = () => {
    const [activities, setActivities] = useState([]);
    const [editActivity, setEditActivity] = useState({ id: '', name: '', price: '', date: '', category: '', tags: '', bookingOpen: true });
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [budget, setBudget] = useState('');
    const [date, setDate] = useState('');
    const [category, setCategory] = useState('');
    const [sortCriteria, setSortCriteria] = useState('');
    const [sortOrder, setSortOrder] = useState('asc');
    const [tags, setTags] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const { auth } = useContext(AuthContext);
    const navigate = useNavigate();
    let homePath;
    if (auth.user && auth.user.type === 'tourist') {
        homePath = '/viewAll';
    }
    else {
        homePath = '/advertiser-dashboard';
    }
    useEffect(() => {
        fetchActivities();
    }, []);

    const fetchActivities = async () => {
        try {
            const response = await axiosInstance.get('/api/activity');
            if (auth.user.type === 'tourist') {
                response.data = response.data.filter(activity => activity.bookingOpen);
            }
            setActivities(response.data);
        } catch (err) {
            setError('Failed to fetch activities');
        }
    };

    const updateActivity = async () => {
        try {
            console.log(editActivity.bookingOpen);
            await axiosInstance.put(`/api/activity/${editActivity.id}`, editActivity);
            setMessage('Activity updated successfully!');
            setEditActivity({ id: '', name: '', price: '', date: '', category: '', tags: '', bookingOpen: true });
            fetchActivities();
        } catch (error) {
            setMessage('Error updating activity.');
        }
    };

    const deleteActivity = async (id) => {
        try {
            await axiosInstance.delete(`/api/activity/${id}`);
            setMessage('Activity deleted successfully!');
            fetchActivities();
        } catch (error) {
            setMessage('Error deleting activity.');
        }
    };

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
        <div className="manage-activities">
            <h2>Manage Activities</h2>
            {message && <p className={message.includes('successfully') ? 'success' : 'error'}>{message}</p>}
            <div className="filters">
                <label>
                    Budget:
                    <input
                        type="text"
                        value={budget}
                        onChange={(e) => setBudget(e.target.value)}
                        placeholder="Budget"
                    />
                </label>
                <label>
                    Date:
                    <input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                    />
                </label>
                <label>
                    Category:
                    <input
                        type="text"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        placeholder="Category"
                    />
                </label>
                <label>
                    Tags:
                    <input
                        type="text"
                        value={tags}
                        onChange={handleTagsChange}
                        placeholder="Tags"
                    />
                </label>
                <label>
                    Search:
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Name"
                    />
                </label>
                <label>
                    Sort By:
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
            </div>
            {activities.length > 0 ? (
                <table className="activities-table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Price</th>
                            <th>Date</th>
                            <th>Category</th>
                            <th>Tags</th>
                            <th>Actions</th>
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
                                <td>
                                    {auth.user && auth.user.type !== 'tourist' && (
                                        <>
                                            <button onClick={() => setEditActivity({ id: activity._id, name: activity.name, price: activity.price, date: activity.date, category: activity.category, tags: activity.tags.join(', '), bookingOpen: activity.bookingOpen })}>Edit</button>
                                            <button onClick={() => deleteActivity(activity._id)}>Delete</button>
                                        </>
                                    )}
                                    <button onClick={() => navigate(`/getActivity/${activity._id}`)}>More Info</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <div className="loading">Loading activities...</div>
            )}
            {editActivity.id && (
                <div className="controls">
                    <label>
                        Edit Activity Name:
                        <input
                            type="text"
                            value={editActivity.name}
                            onChange={(e) => setEditActivity({ ...editActivity, name: e.target.value })}
                            placeholder="Activity Name"
                        />
                    </label>
                    <label>
                        Price:
                        <input
                            type="text"
                            value={editActivity.price}
                            onChange={(e) => setEditActivity({ ...editActivity, price: e.target.value })}
                            placeholder="Price"
                        />
                    </label>
                    <label>
                        Date:
                        <input
                            type="date"
                            value={editActivity.date}
                            onChange={(e) => setEditActivity({ ...editActivity, date: e.target.value })}
                        />
                    </label>
                    <label>
                        Category:
                        <input
                            type="text"
                            value={editActivity.category}
                            onChange={(e) => setEditActivity({ ...editActivity, category: e.target.value })}
                            placeholder="Category"
                        />
                    </label>
                    <label>
                        Tags (comma separated):
                        <input
                            type="text"
                            value={editActivity.tags}
                            onChange={(e) => setEditActivity({ ...editActivity, tags: e.target.value })}
                            placeholder="Tags"
                        />
                    </label>
                    <label>
                        Bookable? :
                        <input
                            type="checkbox"
                            checked={editActivity.bookingOpen}
                            value={editActivity.bookingOpen}
                            onChange={(e) => setEditActivity({ ...editActivity, bookingOpen: e.target.checked })}
                        />
                    </label>
                    <button onClick={updateActivity}>Update Activity</button>
                </div>
            )}
            <div className="navigation-buttons">
                <NavigateButton path={homePath} text="Back to Dashboard" />
                <Logout />
            </div>
        </div>
    );
};

export default Activities;