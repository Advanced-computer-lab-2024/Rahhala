import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import axiosInstance from '../utils/axiosConfig';
import { useNavigate } from 'react-router-dom';

const TourGuideDashboard = () => {
    const { auth } = useContext(AuthContext);
    const navigate = useNavigate();
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState(''); // Fixed typo from errorMesage to errorMessage
    const [showForm, setShowForm] = useState(false); // Control create form visibility
    const [showUpdateForm, setShowUpdateForm] = useState(false); // Control update form visibility
    const [showDeleteForm, setShowDeleteForm] = useState(false); // Control delete form visibility
    const [formData, setFormData] = useState({
        name: '',
        activities: '',
        timeline: '',
        language: '',
        price: '',
        availableDates: '',
        pickupLocation: '',
        dropoffLocation: '',
        accessibility: '',
        tags: ''
    });
    const [deleteId, setDeleteId] = useState(''); // State for the delete itinerary 
    const [updateId, setUpdateId] = useState(''); // State for the itinerary ID to be updated

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        try {
            const formattedData = {
                ...formData,
                activities: formData.activities.split(',').map(item => item.trim()),
                tags: formData.tags.split(',').map(tag => tag.trim()), 
                availableDates: formData.availableDates.split(',').map(date => new Date(date.trim())),
                accessibility: formData.accessibility.split(',').map(item => item.trim())  
            };
            await axiosInstance.post('/createItinerary', formattedData);
            setShowForm(false);
            setSuccessMessage('Itinerary created successfully!');
            setTimeout(() => setSuccessMessage(''), 3000); 
        } catch (err) {
            setErrorMessage('Failed to create itinerary.');
            setTimeout(() => setErrorMessage(''), 3000); 
        }
    };

    const handleDeleteSubmit = async (e) => {
        e.preventDefault();
        try {
            await axiosInstance.delete(`/deleteItineraryByName/${deleteId}`);
            setShowDeleteForm(false);
            setSuccessMessage('Itinerary deleted successfully!');
            setTimeout(() => setSuccessMessage(''), 3000); 
        } catch (err) {
            setErrorMessage('Failed to delete itinerary.');
            setTimeout(() => setErrorMessage(''), 3000); 
        }
    };

    const handleUpdateSubmit = async (e) => {
        e.preventDefault();
        try {
            const formattedData = {
                ...formData,
                activities: formData.activities.split(',').map(item => item.trim()),
                tags: formData.tags.split(',').map(tag => tag.trim()), 
                availableDates: formData.availableDates.split(',').map(date => new Date(date.trim())),
                accessibility: formData.accessibility.split(',').map(item => item.trim())  
            };
            await axiosInstance.put(`/updateItinerary/${updateId}`, formattedData); // Assuming your API has this endpoint
            setShowUpdateForm(false);
            setSuccessMessage('Itinerary updated successfully!');
            setTimeout(() => setSuccessMessage(''), 3000); 
        } catch (err) {
            setErrorMessage('Failed to update itinerary.');
            setTimeout(() => setErrorMessage(''), 3000); 
        }
    };

    // Loading state while fetching the user data
    if (auth.loading) {
        return <div>Loading user data...</div>;
    }

    // Check if the user is authenticated
    if (!auth.isAuthenticated) {
        return <div>You are not authenticated. Please log in.</div>;
    }

    return (
        <div>
            <h2>Tour Guide Dashboard</h2>
            {successMessage && <div className="success-message">{successMessage}</div>}
            {errorMessage && <div className="error-message">{errorMessage}</div>}

            <button onClick={() => setShowForm(true)}>Create New Itinerary</button>
            <button onClick={() => setShowUpdateForm(true)}>Update Itinerary</button> {/* Update button */}
            <button onClick={() => navigate('/showItineraries')}>Show Itineraries</button>
            <button onClick={() => setShowDeleteForm(true)}>Delete Itinerary</button>

            {/* Create Itinerary Modal form */}
            {showForm && (
                <div className="modal">
                    <div className="modal-content">
                        <h3>Create Itinerary</h3>
                        <form onSubmit={handleFormSubmit}>
                            <div>
                                <label>Name:</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div>
                                <label>Activities (comma separated IDs):</label>
                                <input
                                    type="text"
                                    name="activities"
                                    value={formData.activities}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div>
                                <label>Timeline:</label>
                                <input
                                    type="text"
                                    name="timeline"
                                    value={formData.timeline}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div>
                                <label>Language:</label>
                                <input
                                    type="text"
                                    name="language"
                                    value={formData.language}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div>
                                <label>Price:</label>
                                <input
                                    type="number"
                                    name="price"
                                    value={formData.price}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div>
                                <label>Available Dates (comma separated):</label>
                                <input
                                    type="text"
                                    name="availableDates"
                                    value={formData.availableDates}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div>
                                <label>Pickup Location:</label>
                                <input
                                    type="text"
                                    name="pickupLocation"
                                    value={formData.pickupLocation}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div>
                                <label>Dropoff Location:</label>
                                <input
                                    type="text"
                                    name="dropoffLocation"
                                    value={formData.dropoffLocation}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div>
                                <label>Accessibility (comma separated):</label>
                                <input
                                    type="text"
                                    name="accessibility"
                                    value={formData.accessibility}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div>
                                <label>Tags (comma separated):</label>
                                <input
                                    type="text"
                                    name="tags"
                                    value={formData.tags}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <button type="submit">Submit</button>
                            <button type="button" onClick={() => setShowForm(false)}>Cancel</button>
                        </form>
                    </div>
                </div>
            )}

            {/* Update Itinerary Modal form */}
            {showUpdateForm && (
                <div className="modal">
                    <div className="modal-content">
                        <h3>Update Itinerary</h3>
                        <form onSubmit={handleUpdateSubmit}>
                            <div>
                                <label>Itinerary ID:</label>
                                <input
                                    type="text"
                                    value={updateId}
                                    onChange={(e) => setUpdateId(e.target.value)} // Manage update ID
                                    required
                                />
                            </div>
                            {/* Same input fields as create itinerary */}
                            <div>
                                <label>Name:</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div>
                                <label>Activities (comma separated IDs):</label>
                                <input
                                    type="text"
                                    name="activities"
                                    value={formData.activities}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div>
                                <label>Timeline:</label>
                                <input
                                    type="text"
                                    name="timeline"
                                    value={formData.timeline}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div>
                                <label>Language:</label>
                                <input
                                    type="text"
                                    name="language"
                                    value={formData.language}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div>
                                <label>Price:</label>
                                <input
                                    type="number"
                                    name="price"
                                    value={formData.price}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div>
                                <label>Available Dates (comma separated):</label>
                                <input
                                    type="text"
                                    name="availableDates"
                                    value={formData.availableDates}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div>
                                <label>Pickup Location:</label>
                                <input
                                    type="text"
                                    name="pickupLocation"
                                    value={formData.pickupLocation}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div>
                                <label>Dropoff Location:</label>
                                <input
                                    type="text"
                                    name="dropoffLocation"
                                    value={formData.dropoffLocation}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div>
                                <label>Accessibility (comma separated):</label>
                                <input
                                    type="text"
                                    name="accessibility"
                                    value={formData.accessibility}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div>
                                <label>Tags (comma separated):</label>
                                <input
                                    type="text"
                                    name="tags"
                                    value={formData.tags}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <button type="submit">Update</button>
                            <button type="button" onClick={() => setShowUpdateForm(false)}>Cancel</button>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Itinerary Modal form */}
            {showDeleteForm && (
                <div className="modal">
                    <div className="modal-content">
                        <h3>Delete Itinerary</h3>
                        <form onSubmit={handleDeleteSubmit}>
                            <div>
                                <label>Itinerary ID:</label>
                                <input
                                    type="text"
                                    value={deleteId}
                                    onChange={(e) => setDeleteId(e.target.value)}
                                    required
                                />
                            </div>
                            <button type="submit">Delete</button>
                            <button type="button" onClick={() => setShowDeleteForm(false)}>Cancel</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TourGuideDashboard;