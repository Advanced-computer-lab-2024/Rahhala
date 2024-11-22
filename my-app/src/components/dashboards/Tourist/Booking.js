import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../Header.js';
const BookingPage = () => {
  const [activities, setActivities] = useState([
    {
      id: 1,
      name: "Snorkeling Trip",
      date: "2024-11-20",
      rating: 0,
      title: "",
      body: "",
      showReviewForm: false,
    },
    {
      id: 2,
      name: "City Tour",
      date: "2024-11-25",
      rating: 0,
      title: "",
      body: "",
      showReviewForm: false,
    },
  ]);

  const [itineraries, setItineraries] = useState([
    {
      id: 1,
      name: "7 Days in Bali",
      startDate: "2024-12-01",
      endDate: "2024-12-07",
      rating: 0,
      title: "",
      body: "",
      showReviewForm: false,
    },
    {
      id: 2,
      name: "Weekend Getaway to Paris",
      startDate: "2024-12-10",
      endDate: "2024-12-12",
      rating: 0,
      title: "",
      body: "",
      showReviewForm: false,
    },
  ]);

  const [dropdownOpen, setDropdownOpen] = useState(false);

  const navigate = useNavigate();

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleRatingChange = (type, id, rating) => {
    if (type === 'activity') {
      setActivities((prev) =>
        prev.map((activity) =>
          activity.id === id ? { ...activity, rating: rating } : activity
        )
      );
    } else if (type === 'itinerary') {
      setItineraries((prev) =>
        prev.map((itinerary) =>
          itinerary.id === id ? { ...itinerary, rating: rating } : itinerary
        )
      );
    }
  };

  const handleTitleChange = (type, id, value) => {
    if (type === 'activity') {
      setActivities((prev) =>
        prev.map((activity) =>
          activity.id === id ? { ...activity, title: value } : activity
        )
      );
    } else if (type === 'itinerary') {
      setItineraries((prev) =>
        prev.map((itinerary) =>
          itinerary.id === id ? { ...itinerary, title: value } : itinerary
        )
      );
    }
  };

  const handleBodyChange = (type, id, value) => {
    if (type === 'activity') {
      setActivities((prev) =>
        prev.map((activity) =>
          activity.id === id ? { ...activity, body: value } : activity
        )
      );
    } else if (type === 'itinerary') {
      setItineraries((prev) =>
        prev.map((itinerary) =>
          itinerary.id === id ? { ...itinerary, body: value } : itinerary
        )
      );
    }
  };

  const handleSubmit = (type, id) => {
    if (type === 'activity') {
      const activity = activities.find((activity) => activity.id === id);
      alert(`Submitted Review for Activity: ${activity.name}`);
    } else if (type === 'itinerary') {
      const itinerary = itineraries.find((itinerary) => itinerary.id === id);
      alert(`Submitted Review for Itinerary: ${itinerary.name}`);
    }
  };

  const toggleReviewForm = (type, id) => {
    if (type === 'activity') {
      setActivities((prev) => 
        prev.map((activity) => 
          activity.id === id
            ? { ...activity, showReviewForm: !activity.showReviewForm }
            : { ...activity, showReviewForm: false } // Close other forms
        )
      );
    } else if (type === 'itinerary') {
      setItineraries((prev) => 
        prev.map((itinerary) => 
          itinerary.id === id
            ? { ...itinerary, showReviewForm: !itinerary.showReviewForm }
            : { ...itinerary, showReviewForm: false } // Close other forms
        )
      );
    }
  };

  const cancelReviewForm = (type, id) => {
    if (type === 'activity') {
      setActivities((prev) =>
        prev.map((activity) =>
          activity.id === id ? { ...activity, showReviewForm: false } : activity
        )
      );
    } else if (type === 'itinerary') {
      setItineraries((prev) =>
        prev.map((itinerary) =>
          itinerary.id === id ? { ...itinerary, showReviewForm: false } : itinerary
        )
      );
    }
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
<div className="flex items-center mt-4 px-4">

  </div>
  
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-lg mt-8">
        <h1 className="text-2xl font-semibold mb-6">Bookings</h1>

      
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Booked Activities</h2>
          {activities.map((activity) => (
            <div key={activity.id} className="flex justify-between mb-4 items-start">
              <div className="flex-1">
                <h3 className="font-bold">{activity.name}</h3>
                <p>{activity.date}</p>
              </div>
              <div className="flex items-center">
                {!activity.showReviewForm && (
                  <button
                    onClick={() => toggleReviewForm('activity', activity.id)}
                    className="py-2 px-4 bg-blue-500 text-white rounded-md"
                  >
                    Review
                  </button>
                )}
              </div>
              {activity.showReviewForm && (
                <div className="w-2/3 mt-4">
                  <div className="flex items-center mb-2">
                    <span className="mr-2">Rating:</span>
                    <select
                      value={activity.rating}
                      onChange={(e) =>
                        handleRatingChange('activity', activity.id, parseInt(e.target.value))
                      }
                      className="p-2 border rounded"
                    >
                      <option value={0}>0</option>
                      <option value={1}>1</option>
                      <option value={2}>2</option>
                      <option value={3}>3</option>
                      <option value={4}>4</option>
                      <option value={5}>5</option>
                    </select>
                  </div>
                  <div className="mb-2">
                    <input
                      type="text"
                      placeholder="Review Title"
                      value={activity.title}
                      onChange={(e) =>
                        handleTitleChange('activity', activity.id, e.target.value)
                      }
                      className="p-2 w-full border rounded mb-2"
                    />
                    <textarea
                      placeholder="Write your review..."
                      value={activity.body}
                      onChange={(e) =>
                        handleBodyChange('activity', activity.id, e.target.value)
                      }
                      className="p-2 w-full border rounded mb-2"
                    />
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleSubmit('activity', activity.id)}
                      className="py-2 px-4 bg-blue-500 text-white rounded-md"
                    >
                      Submit Review
                    </button>
                    <button
                      onClick={() => cancelReviewForm('activity', activity.id)}
                      className="py-2 px-4 bg-gray-500 text-white rounded-md"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Booked Itineraries</h2>
          {itineraries.map((itinerary) => (
            <div key={itinerary.id} className="flex justify-between mb-4 items-start">
              <div className="flex-1">
                <h3 className="font-bold">{itinerary.name}</h3>
                <p>{itinerary.startDate} - {itinerary.endDate}</p>
              </div>
              <div className="flex items-center">
                {!itinerary.showReviewForm && (
                  <button
                    onClick={() => toggleReviewForm('itinerary', itinerary.id)}
                    className="py-2 px-4 bg-blue-500 text-white rounded-md"
                  >
                    Review
                  </button>
                )}
              </div>
              {itinerary.showReviewForm && (
                <div className="w-2/3 mt-4">
                  <div className="flex items-center mb-2">
                    <span className="mr-2">Rating:</span>
                    <select
                      value={itinerary.rating}
                      onChange={(e) =>
                        handleRatingChange('itinerary', itinerary.id, parseInt(e.target.value))
                      }
                      className="p-2 border rounded"
                    >
                      <option value={0}>0</option>
                      <option value={1}>1</option>
                      <option value={2}>2</option>
                      <option value={3}>3</option>
                      <option value={4}>4</option>
                      <option value={5}>5</option>
                    </select>
                  </div>
                  <div className="mb-2">
                    <input
                      type="text"
                      placeholder="Review Title"
                      value={itinerary.title}
                      onChange={(e) =>
                        handleTitleChange('itinerary', itinerary.id, e.target.value)
                      }
                      className="p-2 w-full border rounded mb-2"
                    />
                    <textarea
                      placeholder="Write your review..."
                      value={itinerary.body}
                      onChange={(e) =>
                        handleBodyChange('itinerary', itinerary.id, e.target.value)
                      }
                      className="p-2 w-full border rounded mb-2"
                    />
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleSubmit('itinerary', itinerary.id)}
                      className="py-2 px-4 bg-blue-500 text-white rounded-md"
                    >
                      Submit Review
                    </button>
                    <button
                      onClick={() => cancelReviewForm('itinerary', itinerary.id)}
                      className="py-2 px-4 bg-gray-500 text-white rounded-md"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BookingPage;
