import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const TourGuideDashboard = () => {
  const [accepted, setAccepted] = useState(false);
  const [selectedItinerary, setSelectedItinerary] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [updatedItinerary, setUpdatedItinerary] = useState({});
  const [itineraries, setItineraries] = useState([
    {
      id: 1,
      name: 'Weekend Getaway to Paris',
      timeline: '2 Days',
      locations: ['Paris', 'Versailles'],
      language: 'English, French',
      price: '$500',
      pickupLocation: 'Hotel A',
      dropoffLocation: 'Hotel B',
      availableDates: ['2024-12-01', '2024-12-15'],
      tags: ['Romantic', 'Weekend', 'Adventure'],
      activities: [
        { name: 'Eiffel Tower Tour', duration: '2 hours', location: 'Eiffel Tower', time: '10:00 AM' },
        { name: 'Louvre Museum', duration: '3 hours', location: 'Louvre', time: '2:00 PM' },
      ],
    },
    {
      id: 2,
      name: 'City Tour of New York',
      timeline: '3 Days',
      locations: ['New York'],
      language: 'English',
      price: '$700',
      pickupLocation: 'Central Park',
      dropoffLocation: 'Times Square',
      availableDates: ['2024-11-20', '2024-12-05'],
      tags: ['Urban', 'Sightseeing'],
      activities: [
        { name: 'Central Park Walking Tour', duration: '1 hour', location: 'Central Park', time: '9:00 AM' },
        { name: 'Statue of Liberty Visit', duration: '4 hours', location: 'Statue of Liberty', time: '12:00 PM' },
      ],
    },
  ]);

  const [showNewItineraryForm, setShowNewItineraryForm] = useState(false);
  const [newItinerary, setNewItinerary] = useState({
    name: '',
    timeline: '',
    locations: '',
    language: '',
    price: '',
    pickupLocation: '',
    dropoffLocation: '',
    availableDates: '',
    tags: '',
    activities: [{ name: '', duration: '', location: '', time: '' }],
  });

  const navigate = useNavigate();

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };


  const handleAccept = () => {
    setAccepted(true);
  };

  const handleActivate = (id) => {
    console.log(`Activating itinerary with ID: ${id}`);
  };

  const handleUpdateItinerary = (id) => {
    const updatedItineraries = itineraries.map((itinerary) =>
      itinerary.id === id ? { ...itinerary, ...updatedItinerary } : itinerary
    );
    console.log('Updated itinerary:', updatedItinerary);
    setItineraries(updatedItineraries);
    setSelectedItinerary(null);
    setUpdatedItinerary({});
  };

  const handleDeleteItinerary = (id) => {
    const updatedItineraries = itineraries.filter((itinerary) => itinerary.id !== id);
    setItineraries(updatedItineraries);
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

  const handleAddNewItinerary = (e) => {
    e.preventDefault();
    const itineraryToAdd = {
      ...newItinerary,
      id: itineraries.length + 1,
      locations: newItinerary.locations.split(',').map((loc) => loc.trim()),
      availableDates: newItinerary.availableDates.split(',').map((date) => date.trim()),
      tags: newItinerary.tags.split(',').map((tag) => tag.trim()),
      activities: newItinerary.activities.map((activity) => ({
        name: activity.name,
        duration: activity.duration,
        location: activity.location,
        time: activity.time,
      })),
    };
    setItineraries([...itineraries, itineraryToAdd]);
    setNewItinerary({
      name: '',
      timeline: '',
      locations: '',
      language: '',
      price: '',
      pickupLocation: '',
      dropoffLocation: '',
      availableDates: '',
      tags: '',
      activities: [{ name: '', duration: '', location: '', time: '' }],
    });
    setShowNewItineraryForm(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <header className="text-white flex justify-between items-center p-4 w-full relative" style={{ backgroundColor: '#334EAC' }}>
      <h1 className="text-2xl font-bold">Welcome, Username</h1>
      <div className="flex items-center ml-auto space-x-4 relative">
        <button onClick={toggleDropdown} className="p-2">
          <span className="block w-6 h-1 bg-white mb-1"></span>
          <span className="block w-6 h-1 bg-white mb-1"></span>
          <span className="block w-6 h-1 bg-white"></span>
        </button>
        {dropdownOpen && (
          <div className="absolute right-0 top-full w-48 bg-white border border-gray-300 shadow-lg rounded-lg z-10">
            <ul className="text-sm text-gray-700">
            <li className="px-4 py-2 hover:bg-gray-200 cursor-pointer" onClick={() => navigate('/tour-guide')}>Home</li>
              <li className="px-4 py-2 hover:bg-gray-200 cursor-pointer" onClick={() => navigate('/tour-guide-profile')}>Profile</li>
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
                  name="locations"
                  placeholder="Locations (comma separated)"
                  value={newItinerary.locations}
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
                  value={newItinerary.availableDates}
                  onChange={handleNewItineraryChange}
                  className="border rounded-md p-2 w-full"
                  required
                />
                <input
                  type="text"
                  name="tags"
                  placeholder="Tags (comma separated)"
                  value={newItinerary.tags}
                  onChange={handleNewItineraryChange}
                  className="border rounded-md p-2 w-full"
                />
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
                key={itinerary.id}
                className="bg-white p-6 rounded-lg shadow-lg flex flex-col w-full text-sm relative"
              >
                <div className="w-full mb-4">
                  <h3 className="text-lg font-semibold">{itinerary.name}</h3>
                  <div className="space-y-2">
                    <div>
                      <strong>Timeline:</strong>
                      {selectedItinerary?.id === itinerary.id ? (
                        <input
                          type="text"
                          name="timeline"
                          value={updatedItinerary.timeline || itinerary.timeline}
                          onChange={handleInputChange}
                          className="border rounded-md p-1"
                        />
                      ) : (
                        <p>{itinerary.timeline}</p>
                      )}
                    </div>
                    <div>
                      <strong>Locations:</strong>
                      {selectedItinerary?.id === itinerary.id ? (
                        <input
                          type="text"
                          name="locations"
                          value={updatedItinerary.locations || itinerary.locations.join(', ')}
                          onChange={handleInputChange}
                          className="border rounded-md p-1"
                        />
                      ) : (
                        <p>{itinerary.locations.join(', ')}</p>
                      )}
                    </div>
                    <div>
                      <strong>Language:</strong>
                      {selectedItinerary?.id === itinerary.id ? (
                        <input
                          type="text"
                          name="language"
                          value={updatedItinerary.language || itinerary.language}
                          onChange={handleInputChange}
                          className="border rounded-md p-1"
                        />
                      ) : (
                        <p>{itinerary.language}</p>
                      )}
                    </div>
                    <div>
                      <strong>Price:</strong>
                      {selectedItinerary?.id === itinerary.id ? (
                        <input
                          type="text"
                          name="price"
                          value={updatedItinerary.price || itinerary.price}
                          onChange={handleInputChange}
                          className="border rounded-md p-1"
                        />
                      ) : (
                        <p>{itinerary.price}</p>
                      )}
                    </div>
                    <div>
                      <strong>Pickup Location:</strong>
                      {selectedItinerary?.id === itinerary.id ? (
                        <input
                          type="text"
                          name="pickupLocation"
                          value={updatedItinerary.pickupLocation || itinerary.pickupLocation}
                          onChange={handleInputChange}
                          className="border rounded-md p-1"
                        />
                      ) : (
                        <p>{itinerary.pickupLocation}</p>
                      )}
                    </div>
                    <div>
                      <strong>Dropoff Location:</strong>
                      {selectedItinerary?.id === itinerary.id ? (
                        <input
                          type="text"
                          name="dropoffLocation"
                          value={updatedItinerary.dropoffLocation || itinerary.dropoffLocation}
                          onChange={handleInputChange}
                          className="border rounded-md p-1"
                        />
                      ) : (
                        <p>{itinerary.dropoffLocation}</p>
                      )}
                    </div>
                    <div>
                      <strong>Available Dates:</strong>
                      {selectedItinerary?.id === itinerary.id ? (
                        <input
                          type="text"
                          name="availableDates"
                          value={updatedItinerary.availableDates || itinerary.availableDates.join(', ')}
                          onChange={handleInputChange}
                          className="border rounded-md p-1"
                        />
                      ) : (
                        <p>{itinerary.availableDates.join(', ')}</p>
                      )}
                    </div>
                    <div>
                      <strong>Tags:</strong>
                      {selectedItinerary?.id === itinerary.id ? (
                        <input
                          type="text"
                          name="tags"
                          value={updatedItinerary.tags || itinerary.tags.join(', ')}
                          onChange={handleInputChange}
                          className="border rounded-md p-1"
                        />
                      ) : (
                        <p>{itinerary.tags.join(', ')}</p>
                      )}
                    </div>
                    <div>
                      <strong>Activities:</strong>
                      <ul className="list-disc pl-5">
                        {itinerary.activities.map((activity, idx) => (
                          <li key={idx}>
                            {selectedItinerary?.id === itinerary.id ? (
                              <input
                                type="text"
                                name="activities"
                                value={updatedItinerary.activities || activity.name}
                                onChange={handleInputChange}
 className="border rounded-md p-1"
                              />
                            ) : (
                              <p>{activity.name} - {activity.duration} - {activity.location} at {activity.time}</p>
                            )}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => handleActivate(itinerary.id)}
                    className="py-2 px-4 bg-green-500 text-white rounded-md"
                  >
                    Activate
                  </button>
                  {selectedItinerary?.id === itinerary.id ? (
                    <button
                      onClick={() => handleUpdateItinerary(itinerary.id)}
                      className="py-2 px-4 bg-blue-500 text-white rounded-md"
                    >
                      Save
                    </button>
                  ) : (
                    <button
                      onClick={() => setSelectedItinerary(itinerary)}
                      className="py-2 px-4 bg-blue-500 text-white rounded-md"
                    >
                      Update
                    </button>
                  )}
                </div>
                <button
                  onClick={() => handleDeleteItinerary(itinerary.id)}
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