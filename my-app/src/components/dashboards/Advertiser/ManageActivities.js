import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../../context/AuthContext';
import axiosInstance from '../../../utils/axiosConfig';
import Header from "../../Header.js";
import { useNavigate } from 'react-router-dom';

function ManageActivities() {
    const { auth } = useContext(AuthContext);
    const [activities, setActivities] = useState([]);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [error, setError] = useState(null);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [selectedActivity, setSelectedActivity] = useState(null);
    const [editedActivity, setEditedActivity] = useState({});
    const [categories, setCategories] = useState([]);
    const [tags, setTags] = useState([]);
    const [createModalOpen, setCreateModalOpen] = useState(false);
    const [newActivity, setNewActivity] = useState({
        name: '',
        date: '',
        time: '',
        location: [],
        price: '',
        category: '',
        tags: [],
        specialDiscounts: '',
        bookingOpen: true,
    });
    const navigate = useNavigate();

    useEffect(() => {
        const fetchActivities = async () => {
            try {
                const response = await axiosInstance.get('/api/activity/' + auth.user.id);
                setActivities(response.data);
            } catch (err) {
                console.log("Error is", err); // Log error if fetching fails
                setError('Failed to fetch activities');
            }
        };

        const fetchCategories = async () => {
            try {
                const response = await axiosInstance.get('/api/activityCategory');
                setCategories(response.data);
                setNewActivity({ ...newActivity, category: response.data[0]?.name });
            } catch (err) {
                console.log("Error fetching categories", err);
            }
        };

        const fetchTags = async () => {
            try {
                const response = await axiosInstance.get('/api/preferenceTag');
                setTags(response.data);
            } catch (err) {
                console.log("Error fetching tags", err);
            }
        };
        if(auth?.user?.id)
            fetchActivities();  
        fetchCategories();
        fetchTags();
    }, [auth]);

    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    };

    const openEditModal = (activity) => {
        setSelectedActivity(activity);
        setEditedActivity(activity);
        setEditModalOpen(true);
    };

    const closeEditModal = () => {
        setEditModalOpen(false);
        setSelectedActivity(null);
    };

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setEditedActivity((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleTagChange = (e) => {
        console.log("editedActivity is", editedActivity);

        const { value, checked } = e.target;
        setEditedActivity((prev) => {
            const newTags = checked
                ? [...prev.tags, value]
                : prev.tags.filter((tag) => tag !== value);
            return {
                ...prev,
                tags: newTags,
            };
        });
    };

    const handleSaveChanges = async () => {
        try {
            const updatedActivity = { ...editedActivity, tags: editedActivity.tags };
            await axiosInstance.put(`/api/activity/${selectedActivity._id}`, updatedActivity);
            alert('Activity updated successfully');
            window.location.reload();
        } catch (err) {
            console.log("Error is", err); // Log error if update fails
            setError('Failed to update activity');
        }
        closeEditModal();
    };

    const handleDeleteActivity = async (activityId) => {
        try {
            await axiosInstance.delete(`/api/activity/${activityId}`);
            alert('Activity deleted successfully');
            setActivities(activities.filter(activity => activity._id !== activityId));
        } catch (err) {
            console.log("Error is", err); // Log error if delete fails
            alert(err.response?.data?.error || err.response?.data?.message || 'Failed to delete activity');
            setError('Failed to delete activity');
        }
    };

    const openCreateModal = () => {
        setCreateModalOpen(true);
    };

    const closeCreateModal = () => {
        setCreateModalOpen(false);
    };

    const handleNewActivityChange = (e) => {
        const { name, value } = e.target;
        setNewActivity((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleNewTagChange = (e) => {
        const { value, checked } = e.target;
        setNewActivity((prev) => {
            const newTags = checked
                ? [...prev.tags, value]
                : prev.tags.filter((tag) => tag !== value);
            return {
                ...prev,
                tags: newTags,
            };
        });
    };

    const handleSaveNewActivity = async () => {
        try {
            await axiosInstance.post('/api/activity', newActivity);
            alert('Activity created successfully');
            window.location.reload();
        } catch (err) {
            console.log("Error is", err);
            alert(err.response?.data?.error || err.response?.data?.message || 'Failed to create activity');
            setError('Failed to create activity');
        }
        closeCreateModal();
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <Header toggleDropdown={toggleDropdown} dropdownOpen={dropdownOpen} />
            <button
            onClick={() => navigate(-1)}
            className="text-blue-500 mt-4 ml-4 flex items-center"
            >
                ← Back
            </button>

            <div className="flex justify-center items-center mt-20">
                <div className="w-full max-w-4xl bg-white p-6 rounded-lg shadow-lg">
                    <h1 className="text-2xl font-semibold mb-6 text-center">Manage Activities</h1>
                    <button
                        onClick={openCreateModal}
                        className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 mb-4"
                    >
                        Create New Activity
                    </button>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {activities.map((activity) => (
                            <div key={activity._id} className="bg-white shadow-md rounded-lg p-4 text-center w-full lg:w-72 flex flex-col justify-between">
                                <div>
                                    <h3 className="text-xl font-semibold">{activity.name}</h3>
                                    <p className="text-gray-600">{activity.date.split('T')[0]}</p>
                                    <p className="text-gray-600">{activity.time}</p>
                                    <p className="text-lg font-semibold text-blue-500">${activity.price}</p>
                                    <p className="text-gray-600">{activity.category}</p>
                                    <p className="text-gray-600">{activity.tags.join(', ')}</p>
                                    <p className="text-gray-600">{activity.specialDiscounts}</p>
                                    <p className="text-gray-600">{activity.bookingOpen ? 'Booking Open' : 'Booking Closed'}</p>
                                </div>
                                <div className="flex justify-center mt-4 space-x-4">
                                    <button
                                        className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                                        onClick={() => openEditModal(activity)}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                                        onClick={() => handleDeleteActivity(activity._id)}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {editModalOpen && selectedActivity && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg max-h-[80vh] overflow-y-auto">
                        <h2 className="text-xl font-semibold mb-4">Edit Activity</h2>
                        <form onSubmit={(e) => e.preventDefault()}>
                            <div className="mb-4">
                                <label htmlFor="name" className="block text-gray-700 font-medium mb-2">
                                    Name
                                </label>
                                <input
                                    id="name"
                                    name="name"
                                    type="text"
                                    value={editedActivity.name}
                                    onChange={handleEditChange}
                                    className="w-full p-2 border rounded-lg"
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="date" className="block text-gray-700 font-medium mb-2">
                                    Date
                                </label>
                                <input
                                    id="date"
                                    name="date"
                                    type="date"
                                    value={editedActivity.date}
                                    onChange={handleEditChange}
                                    className="w-full p-2 border rounded-lg"
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="time" className="block text-gray-700 font-medium mb-2">
                                    Time
                                </label>
                                <input
                                    id="time"
                                    name="time"
                                    type="text"
                                    value={editedActivity.time}
                                    onChange={handleEditChange}
                                    className="w-full p-2 border rounded-lg"
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="price" className="block text-gray-700 font-medium mb-2">
                                    Price
                                </label>
                                <input
                                    id="price"
                                    name="price"
                                    type="text"
                                    value={editedActivity.price}
                                    onChange={handleEditChange}
                                    className="w-full p-2 border rounded-lg"
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="category" className="block text-gray-700 font-medium mb-2">
                                    Category
                                </label>
                                <select
                                    id="category"
                                    name="category"
                                    value={editedActivity.category}
                                    onChange={handleEditChange}
                                    className="w-full p-2 border rounded-lg"
                                >
                                    {categories.map((category) => (
                                        <option key={category._id} value={category.name}>
                                            {category.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 font-medium mb-2">
                                    Tags
                                </label>
                                <div className="flex flex-wrap">
                                    {tags.map((tag) => (
                                        <div key={tag._id} className="mr-4 mb-2">
                                            <label className="inline-flex items-center">
                                                <input
                                                    type="checkbox"
                                                    value={tag.name}
                                                    checked={editedActivity.tags.includes(tag.name)}
                                                    onChange={handleTagChange}
                                                    className="form-checkbox"
                                                />
                                                <span className="ml-2">{tag.name}</span>
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="mb-4">
                                <label htmlFor="specialDiscounts" className="block text-gray-700 font-medium mb-2">
                                    Special Discounts
                                </label>
                                <input
                                    id="specialDiscounts"
                                    name="specialDiscounts"
                                    type="text"
                                    value={editedActivity.specialDiscounts}
                                    onChange={handleEditChange}
                                    className="w-full p-2 border rounded-lg"
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="bookingOpen" className="block text-gray-700 font-medium mb-2">
                                    Booking Open
                                </label>
                                <select
                                    id="bookingOpen"
                                    name="bookingOpen"
                                    value={editedActivity.bookingOpen}
                                    onChange={handleEditChange}
                                    className="w-full p-2 border rounded-lg"
                                >
                                    <option value={true}>Open</option>
                                    <option value={false}>Closed</option>
                                </select>
                            </div>
                            <div className="flex justify-end space-x-4">
                                <button
                                    type="button"
                                    onClick={closeEditModal}
                                    className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    onClick={handleSaveChanges}
                                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                                >
                                    Save
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {createModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg max-h-[80vh] overflow-y-auto">
                        <h2 className="text-xl font-semibold mb-4">Create New Activity</h2>
                        <form onSubmit={(e) => e.preventDefault()}>
                            <div className="mb-4">
                                <label htmlFor="name" className="block text-gray-700 font-medium mb-2">
                                    Name
                                </label>
                                <input
                                    id="name"
                                    name="name"
                                    type="text"
                                    value={newActivity.name}
                                    onChange={handleNewActivityChange}
                                    className="w-full p-2 border rounded-lg"
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="date" className="block text-gray-700 font-medium mb-2">
                                    Date
                                </label>
                                <input
                                    id="date"
                                    name="date"
                                    type="date"
                                    value={newActivity.date}
                                    onChange={handleNewActivityChange}
                                    className="w-full p-2 border rounded-lg"
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="time" className="block text-gray-700 font-medium mb-2">
                                    Time
                                </label>
                                <input
                                    id="time"
                                    name="time"
                                    type="text"
                                    value={newActivity.time}
                                    onChange={handleNewActivityChange}
                                    className="w-full p-2 border rounded-lg"
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="price" className="block text-gray-700 font-medium mb-2">
                                    Price
                                </label>
                                <input
                                    id="price"
                                    name="price"
                                    type="text"
                                    value={newActivity.price}
                                    onChange={handleNewActivityChange}
                                    className="w-full p-2 border rounded-lg"
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="category" className="block text-gray-700 font-medium mb-2">
                                    Category
                                </label>
                                <select
                                    id="category"
                                    name="category"
                                    value={newActivity.category}
                                    onChange={handleNewActivityChange}
                                    className="w-full p-2 border rounded-lg"
                                >
                                    {categories.map((category) => (
                                        <option key={category._id} value={category.name}>
                                            {category.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 font-medium mb-2">
                                    Tags
                                </label>
                                <div className="flex flex-wrap">
                                    {tags.map((tag) => (
                                        <div key={tag._id} className="mr-4 mb-2">
                                            <label className="inline-flex items-center">
                                                <input
                                                    type="checkbox"
                                                    value={tag.name}
                                                    checked={newActivity.tags.includes(tag.name)}
                                                    onChange={handleNewTagChange}
                                                    className="form-checkbox"
                                                />
                                                <span className="ml-2">{tag.name}</span>
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="mb-4">
                                <label htmlFor="specialDiscounts" className="block text-gray-700 font-medium mb-2">
                                    Special Discounts
                                </label>
                                <input
                                    id="specialDiscounts"
                                    name="specialDiscounts"
                                    type="text"
                                    value={newActivity.specialDiscounts}
                                    onChange={handleNewActivityChange}
                                    className="w-full p-2 border rounded-lg"
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="bookingOpen" className="block text-gray-700 font-medium mb-2">
                                    Booking Open
                                </label>
                                <select
                                    id="bookingOpen"
                                    name="bookingOpen"
                                    value={newActivity.bookingOpen}
                                    onChange={handleNewActivityChange}
                                    className="w-full p-2 border rounded-lg"
                                >
                                    <option value={true}>Open</option>
                                    <option value={false}>Closed</option>
                                </select>
                            </div>
                            <div className="flex justify-end space-x-4">
                                <button
                                    type="button"
                                    onClick={closeCreateModal}
                                    className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    onClick={handleSaveNewActivity}
                                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                                >
                                    Save
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ManageActivities;
