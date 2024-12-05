import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axiosConfig';
import { AuthContext } from '../../context/AuthContext';

const TourGuideDashboard = () => {
    const { auth } = useContext(AuthContext);
    const [accepted, setAccepted] = useState(false);
    const [selectedItinerary, setSelectedItinerary] = useState(null);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [updatedItinerary, setUpdatedItinerary] = useState({});
    const [itineraries, setItineraries] = useState([]);

    const [showNewItineraryForm, setShowNewItineraryForm] = useState(false);
    const [newItinerary, setNewItinerary] = useState({
        name: '',
        timeline: '',
        language: '',
        price: '',
        pickupLocation: '',
        dropoffLocation: '',
        availableDates: [],
        tags: [],
        activityDetails: [{ name: '', duration: '', location: [], time: '' }],
    });

    useEffect(() => {
        const fetchTourGuide = async () => {
            try
            {
                const tourGuide = await axiosInstance.get('/api/tourGuide');
                setAccepted(tourGuide.data.profile.acceptedTermsAndConditions);
            }
            catch (error)
            {
                console.log('Error:', error);
            }
        }
        fetchTourGuide();

        const fetchItineraries = async () => {
            try {
                const itineraries = await axiosInstance.get('/api/itinerary/user');
                setItineraries(itineraries.data);
            } catch (error) {
                console.log('Error:', error);
            }
        }
        fetchItineraries();
    }, [auth]);

    const navigate = useNavigate();

    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    };


    const handleAccept = async () => {
        try{
            await axiosInstance.put('/api/tourGuide/acceptTerms');
            setAccepted(true);
        }
        catch (error)
        {
            console.log('Error:', error);
        }
    };

    const handleActivate = (id) => {
        try{
            if(itineraries.find(itinerary => itinerary._id === id).isActive)
            {
                axiosInstance.put(`/api/itinerary/deactivate/${id}`);
            }
            else
                axiosInstance.put(`/api/itinerary/activate/${id}`);
            window.location.reload();
        }
        catch (error)
        {
            console.log('Error:', error);
        }
    };

    const handleUpdateItinerary = async (id) => {
        console.log("Updated Itinerary", updatedItinerary)
        console.log(itineraries)
        try{
            await axiosInstance.put(`/api/itinerary/update/${updatedItinerary._id}`, updatedItinerary);
            window.location.reload();
        }
        catch (error)
        {
            console.log('Error:', error);
        }
    };

    const handleDeleteItinerary = (id) => {
        try{
            axiosInstance.delete(`/api/itinerary/delete/${id}`);

        } catch (error) {
            console.log('Error:', error);
        }
        window.location.reload();
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUpdatedItinerary((prev) => ({
        ...prev,
        [name]: value,
        }));
    };

    const handleNewItineraryChange = (e) => {
        const { name, value } = e.target;
        setNewItinerary((prev) => ({
        ...prev,
        [name]: value,
        }));
    };

    const handleAddNewItinerary = async (e) => {
        e.preventDefault();
        try {
            const response = await axiosInstance.post('/api/itinerary', newItinerary);
    
            if (response.status === 201) {
                console.log('Itinerary added successfully:', response.data);
                // Optionally, you can reset the form or update the state to reflect the new itinerary
                setNewItinerary({
                    name: '',
                    activityDetails: [],
                    timeline: '',
                    language: '',
                    price: '',
                    availableDates: [],
                    pickupLocation: '',
                    dropoffLocation: '',
                    accessibility: [],
                    tags: []
                });
                alert("Itinerary Added Successfully")
                window.location.reload();
            }
        } catch (error) {
            console.error('Error adding itinerary:', error);
        }
            setShowNewItineraryForm(false);
    };

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col">
        <header className="text-white flex justify-between items-center p-4 w-full relative" style={{ backgroundColor: '#334EAC' }}>
        <h1 className="text-2xl font-bold">Welcome</h1>
        <div className="flex items-center ml-auto space-x-4 relative">
            <button onClick={toggleDropdown} className="p-2">
            <span className="block w-6 h-1 bg-white mb-1"></span>
            <span className="block w-6 h-1 bg-white mb-1"></span>
            <span className="block w-6 h-1 bg-white mb-1"></span>
            <span className="block w-6 h-1 bg-white"></span>
            </button>
            {dropdownOpen && (
            <div className="absolute right-0 top-full w-48 bg-white border border-gray-300 shadow-lg rounded-lg z-10">
                <ul className="text-sm text-gray-700">
                <li className="px-4 py-2 hover:bg-gray-200 cursor-pointer" onClick={() => navigate('/tour-guide')}>Home</li>
                <li className="px-4 py-2 hover:bg-gray-200 cursor-pointer" onClick={() => navigate('/tour-guide-profile')}>Profile</li>
                <li className="px-4 py-2 hover:bg-gray-200 cursor-pointer" onClick={() => navigate('/tourGuideSales')}>Sales Report</li>
                <li className="px-4 py-2 hover:bg-red-200 cursor-pointer text-red-600" onClick={() => (window.location.href = '/login')}>Sign Out</li>
                </ul>
            </div>
            )}
        </div>
        </header>

        {!accepted ? (
            <div className="flex-1 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96 text-center">
                <h2 className="text-xl font-semibold mb-4">You must accept the terms and conditions to use the dashboard</h2>
                <p className="text-sm mb-6">Please read and accept the terms and conditions before proceeding.</p>
                <button
                onClick={handleAccept}
                className="py-2 px-4 bg-blue-500 text-white rounded-md"
                >
                Accept Terms and Conditions
                </button>
            </div>
            </div>
        ) : (
            <div className="flex-1 p-6 flex flex-col items-center">
            <button
                onClick={() => setShowNewItineraryForm(!showNewItineraryForm)}
                className="mb-2 py-1 px-2 bg-blue-500 text-white rounded-md text-sm"
            >
                {showNewItineraryForm ? 'Cancel New Itinerary' : 'Create New Itinerary'}
            </button>

            {showNewItineraryForm && (
                <form onSubmit={handleAddNewItinerary} className="bg-white p-6 rounded-lg shadow-lg mb-6 w-full max-w-md">
                <h2 className="text-lg font-semibold mb-4">New Itinerary</h2>
                <div className="space-y-4">
                    <input
                    type="text"
                    name="name"
                    placeholder="Itinerary Name"
                    value={newItinerary.name}
                    onChange={handleNewItineraryChange}
                    className="border rounded-md p-2 w-full"
                    required
                    />
                    <input
                    type="text"
                    name="timeline"
                    placeholder="Timeline"
                    value={newItinerary.timeline}
                    onChange={handleNewItineraryChange}
                    className="border rounded-md p-2 w-full"
                    required
                    />
                    <input
                    type="text"
                    name="language"
                    placeholder="Language"
                    value={newItinerary.language}
                    onChange={handleNewItineraryChange}
                    className="border rounded-md p-2 w-full"
                    required
                    />
                    <input
                    type="text"
                    name="price"
                    placeholder="Price"
                    value={newItinerary.price}
                    onChange={handleNewItineraryChange}
                    className="border rounded-md p-2 w-full"
                    required
                    />
                    <input
                    type="text"
                    name="pickupLocation"
                    placeholder="Pickup Location"
                    value={newItinerary.pickupLocation}
                    onChange={handleNewItineraryChange}
                    className="border rounded-md p-2 w-full"
                    required
                    />
                    <input
                    type="text"
                    name="dropoffLocation"
                    placeholder="Dropoff Location"
                    value={newItinerary.dropoffLocation}
                    onChange={handleNewItineraryChange}
                    className="border rounded-md p-2 w-full"
                    required
                    />
                    <input
                    type="text"
                    name="availableDates"
                    placeholder="Available Dates (comma separated)"
                    value={newItinerary.availableDates.join(',') || '' }
                    onChange={(e) => setNewItinerary({ ...newItinerary, availableDates: e.target.value ? e.target.value.split(',').map(date => date.trim()) : [] })}
                    className="border rounded-md p-2 w-full"
                    required
                    />
                    <input
                    type="text"
                    name="tags"
                    placeholder="Tags (comma separated)"
                    value={newItinerary.tags.join(',') || ''}
                    onChange={(e) => setNewItinerary({ ...newItinerary, tags: e.target.value ? e.target.value.split(',').map(tag => tag.trim()) : [] })}
                    className="border rounded-md p-2 w-full"
                    />
                    {newItinerary.activityDetails.map((activity, index) => (
                        <div key={index} className="space-y-2">
                            <input
                                type="text"
                                name={`activityName${index}`}
                                placeholder="Activity Name"
                                value={activity.name}
                                onChange={(e) => {
                                    const updatedActivities = [...newItinerary.activityDetails];
                                    updatedActivities[index].name = e.target.value;
                                    setNewItinerary({ ...newItinerary, activityDetails: updatedActivities });
                                }}
                                className="border rounded-md p-2 w-full"
                                required
                            />
                            <input
                            type="text"
                            name={`activityLocation${index}`}
                            placeholder="Activity Location (comma separated)"
                            value={activity.location.join(', ')}
                            onChange={(e) => {
                                const updatedActivities = [...newItinerary.activityDetails];
                                updatedActivities[index].location = e.target.value ? e.target.value.split(',').map(loc => loc.trim()) : [];
                                setNewItinerary({ ...newItinerary, activityDetails: updatedActivities });
                            }}
                            className="border rounded-md p-2 w-full"
                            required
                        />
                            <input
                                type="text"
                                name={`activityDuration${index}`}
                                placeholder="Activity Duration"
                                value={activity.duration}
                                onChange={(e) => {
                                    const updatedActivities = [...newItinerary.activityDetails];
                                    updatedActivities[index].duration = e.target.value;
                                    setNewItinerary({ ...newItinerary, activityDetails: updatedActivities });
                                }}
                                className="border rounded-md p-2 w-full"
                                required
                            />
                            <input
                                type="text"
                                name={`activityTime${index}`}
                                placeholder="Activity Time"
                                value={activity.time}
                                onChange={(e) => {
                                    const updatedActivities = [...newItinerary.activityDetails];
                                    updatedActivities[index].time = e.target.value;
                                    setNewItinerary({ ...newItinerary, activityDetails: updatedActivities });
                                }}
                                className="border rounded-md p-2 w-full"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => {
                                    const updatedActivities = newItinerary.activityDetails.filter((_, i) => i !== index);
                                    setNewItinerary({ ...newItinerary, activityDetails: updatedActivities });
                                }}
                                className="py-1 px-2 bg-red-500 text-white rounded-md text-sm"
                            >
                                Remove Activity
                            </button>
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={() => setNewItinerary({ ...newItinerary, activityDetails: [...newItinerary.activityDetails, { name: '', location: '', duration: '', time: '' }] })}
                        className="py-1 px-2 bg-green-500 text-white rounded-md text-sm"
                    >
                        Add Activity
                    </button>
                    <button
                    type="submit"
                    class ="py-2 px-4 bg-blue-500 text-white rounded-md"
                    >
                    Add Itinerary
                    </button>
                </div>
                </form>
            )}

            <div className="space-y-6 w-full max-w-4xl flex flex-col items-center">
                {itineraries.map((itinerary) => (
                <div
                    key={itinerary._id}
                    className="bg-white p-6 rounded-lg shadow-lg flex flex-col w-full text-sm relative"
                >
                    <div className="w-full mb-4">
                    <h3 className="text-lg font-semibold">{itinerary.name}</h3>
                    <div className="space-y-2">
                        <div>
                        <strong>Timeline:</strong>
                        {selectedItinerary?._id === itinerary._id ? (
                            <input
                            type="text"
                            name="timeline"
                            value={updatedItinerary.timeline || itinerary.timeline}
                            onChange={(e) => setUpdatedItinerary({ ...updatedItinerary, timeline: e.target.value })}
                            className="border rounded-md p-1"
                            />
                        ) : (
                            <p>{itinerary.timeline}</p>
                        )}
                        </div>
                        <div>
                        <strong>Language:</strong>
                        {selectedItinerary?._id === itinerary._id ? (
                            <input
                            type="text"
                            name="language"
                            value={updatedItinerary.language || itinerary.language}
                            onChange={(e) => setUpdatedItinerary({ ...updatedItinerary, language: e.target.value })}
                            className="border rounded-md p-1"
                            />
                        ) : (
                            <p>{itinerary.language}</p>
                        )}
                        </div>
                        <div>
                        <strong>Price:</strong>
                        {selectedItinerary?._id === itinerary._id ? (
                            <input
                            type="text"
                            name="price"
                            value={updatedItinerary.price || itinerary.price}
                            onChange={(e) => setUpdatedItinerary({ ...updatedItinerary, price: e.target.value })}
                            className="border rounded-md p-1"
                            />
                        ) : (
                            <p>{itinerary.price}</p>
                        )}
                        </div>
                        <div>
                        <strong>Pickup Location:</strong>
                        {selectedItinerary?._id === itinerary._id ? (
                            <input
                            type="text"
                            name="pickupLocation"
                            value={updatedItinerary.pickupLocation || itinerary.pickupLocation}
                            onChange={(e) => setUpdatedItinerary({ ...updatedItinerary, pickupLocation: e.target.value })}
                            className="border rounded-md p-1"
                            />
                        ) : (
                            <p>{itinerary.pickupLocation}</p>
                        )}
                        </div>
                        <div>
                        <strong>Dropoff Location:</strong>
                        {selectedItinerary?._id === itinerary._id ? (
                            <input
                            type="text"
                            name="dropoffLocation"
                            value={updatedItinerary.dropoffLocation || itinerary.dropoffLocation}
                            onChange={(e) => setUpdatedItinerary({ ...updatedItinerary, dropoffLocation: e.target.value })}
                            className="border rounded-md p-1"
                            />
                        ) : (
                            <p>{itinerary.dropoffLocation}</p>
                        )}
                        </div>
                        <div>
                        <strong>Available Dates:</strong>
                        {selectedItinerary?._id === itinerary._id ? (
                            <input
                            type="text"
                            name="availableDates"
                            value={updatedItinerary.availableDates.map(date => date.split('T')[0]).join(', ') || itinerary.availableDates.map(date => date.split('T')[0]).join(', ')}
                            onChange={(e) => setUpdatedItinerary({ ...updatedItinerary, availableDates: e.target.value.split(',').map(date => date.trim()) })}
                            className="border rounded-md p-1"
                            />
                        ) : (
                            <p>{itinerary.availableDates.map(date => date.split('T')[0]).join(', ')}</p>
                        )}
                        </div>
                        <div>
                        <strong>Tags:</strong>
                        {selectedItinerary?._id === itinerary._id ? (
                            <input
                            type="text"
                            name="tags"
                            value={updatedItinerary.tags || itinerary.tags.join(', ')}
                            onChange={(e) => setUpdatedItinerary({ ...updatedItinerary, tags: e.target.value.split(',').map(tag => tag.trim()) })}
                            className="border rounded-md p-1"
                            />
                        ) : (
                            <p>{itinerary.tags.join(', ')}</p>
                        )}
                        </div>
                        <div>
                        <strong>Activities:</strong>
                        <ul className="list-disc pl-5">
                        {itinerary.activityDetails.map((activity, idx) => (
                            <li key={idx}>
                                {selectedItinerary?._id === itinerary._id ? (
                                    <li key={idx}>
                                    <input
                                        type="text"
                                        name="activityDetailsName"
                                        placeholder='Name'
                                        value={updatedItinerary.activityDetails[idx].name || activity.name}
                                        onChange={(e) => {
                                            const updatedActivities = [...updatedItinerary.activityDetails];
                                            updatedActivities[idx].name = e.target.value;
                                            setUpdatedItinerary({ ...updatedItinerary, activityDetails: updatedActivities });
                                        }}
        
                                        // onChange={(e) => setUpdatedItinerary({ ...updatedItinerary, activityDetails: { ...updatedItinerary.activityDetails, [idx]: { ...updatedItinerary.activityDetails[idx], name: e.target.value } } })}
                                        className="border rounded-md p-1"
                                    />
                                    <input
                                        type="text"
                                        name="activityDetailsLocation"
                                        placeholder='Location (Comma seperated)'
                                        value={updatedItinerary.activityDetails[idx].location || activity.location}
                                        onChange={(e) => {
                                            const updatedActivities = [...updatedItinerary.activityDetails];
                                            updatedActivities[idx].location = e.target.value ? e.target.value.split(',').map(loc => loc.trim()) : [];
                                            setUpdatedItinerary({ ...updatedItinerary, activityDetails: updatedActivities });
                                        }}
                                        className="border rounded-md p-1"
                                    />
                                    <input
                                        type="text"
                                        name="activityDetailsDuration"
                                        placeholder='Duration'
                                        value={updatedItinerary.activityDetails[idx].duration || activity.duration}
                                        onChange={(e) => {
                                            const updatedActivities = [...updatedItinerary.activityDetails];
                                            updatedActivities[idx].duration = e.target.value;
                                            setUpdatedItinerary({ ...updatedItinerary, activityDetails: updatedActivities });
                                        }}
        
                                        className="border rounded-md p-1"
                                    />
                                    <input
                                        type="text"
                                        name="activityDetailsTime"
                                        placeholder='Time'
                                        value={activity.time}
                                        onChange={(e) => {
                                            console.log(updatedItinerary)
                                            const updatedActivities = [...updatedItinerary.activityDetails];
                                            updatedActivities[idx].time = e.target.value;
                                            setUpdatedItinerary({ ...updatedItinerary, activityDetails: updatedActivities });
                                        }}
                                        className="border rounded-md p-1"
                                    />
                                    </li>
                                ) : (
                                    <p>{activity.name} - {activity.duration} - {activity.location.join(', ')} at {activity.time}</p>
                                )}
                            </li>
                        ))}
                    </ul>                
                    </div>
                    </div>
                    </div>
                    <div className="flex items-center space-x-4">
                    <button
                        onClick={() => handleActivate(itinerary._id)}
                        className="py-2 px-4 bg-green-500 text-white rounded-md"
                    >
                        {itinerary.isActive ? 'Deactivate' : 'Activate'}
                    </button>
                    {selectedItinerary?._id === itinerary._id ? (
                        <div className="flex space-x-4">
                        <button
                        onClick={() => handleUpdateItinerary(itinerary._id)}
                        className="py-2 px-4 bg-blue-500 text-white rounded-md"
                        >
                        Save
                        </button>
                                                
                        <button
                        onClick={() => setSelectedItinerary("")}
                        className="py-2 px-4 bg-gray-500 text-white rounded-md"
                        >
                        Cancel
                        </button>
                        </div>
                    ) : (
                        <button
                        onClick={() => {
                            setSelectedItinerary(itinerary);
                            setUpdatedItinerary(itinerary);
                        }}                        
                        className="py-2 px-4 bg-blue-500 text-white rounded-md"
                        >
                        Update
                        </button>
                    )}
                    </div>
                    <button
                    onClick={() => handleDeleteItinerary(itinerary._id)}
                    className="absolute bottom-4 right-4 py-2 px-4 bg-red-500 text-white rounded-md"
                    >
                    Delete
                    </button>
                </div>
                ))}
            </div>
            </div>
        )}
        </div>
    );
};

export default TourGuideDashboard;