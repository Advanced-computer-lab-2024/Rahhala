import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../Header.js';
import axiosInstance from '../../../utils/axiosConfig';
import { AuthContext } from '../../../context/AuthContext';
//import { set } from 'mongoose';

const BookingPage = () => {
    const { auth } = useContext(AuthContext);
    const [error, setError] = useState(null); // State to handle errors
    const [activities, setActivities] = useState([]);

    const [itineraries, setItineraries] = useState([]);

    const [dropdownOpen, setDropdownOpen] = useState(false);

    const [rating, setRating] = useState(0);
    const [title, setTitle] = useState('');
    const [body, setBody] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    // Only fetch bookings if the user is authenticated
    if (auth.isAuthenticated && auth.user) {
        const fetchBookings = async () => {
            try {
                const response = await axiosInstance.get('/api/tourist/');
                const { bookedActivities, bookedItineraries} = response.data.profile;

                const activities = await Promise.all(bookedActivities.map(async (id) => {
                    const res = await axiosInstance.get(`/api/activity/getActivity/${id}`);
                    return res.data;
                }));

                const itineraries = await Promise.all(bookedItineraries.map(async (id) => {
                    const res = await axiosInstance.get(`/api/itinerary/${id}`);
                    return res.data;
                }));

                setActivities(activities);
                setItineraries(itineraries);
                setError(null);
            } catch (err) {
                setError('Failed to load bookings.');
            }
        };

        fetchBookings();
    }
}, [auth]);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

    const handleRatingChange = (type, id, rating) => {
        console.log(id);
        setRating(rating);
    };

    const handleTitleChange = (type, id, value) => {
        console.log(id);
        setTitle(value);  
    };

    const handleBodyChange = (type, id, value) => {
        console.log(id);
        setBody(value);
    };

    const handleSubmit = async (type, id) => {
        try {
            await axiosInstance.post('/api/review', {
                rating: rating,
                title: title,
                body: body,
                reviewedEntity: id,
                reviewedEntityType: type
            });
            alert('Review submitted successfully');
            window.location.reload();
        } catch (err) {
            setError('Failed to submit review.');
        }
  
    };

  const toggleReviewForm = (type, id) => {
    if (type === 'activity') {
      setActivities((prev) => 
        prev.map((activity) => 
          activity._id === id
            ? { ...activity, showReviewForm: !activity.showReviewForm }
            : { ...activity, showReviewForm: false } // Close other forms
        )
      );
    } else if (type === 'itinerary') {
      setItineraries((prev) => 
        prev.map((itinerary) => 
          itinerary._id === id
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
          activity._id === id ? { ...activity, showReviewForm: false } : activity
        )
      );
    } else if (type === 'itinerary') {
      setItineraries((prev) =>
        prev.map((itinerary) =>
          itinerary._id === id ? { ...itinerary, showReviewForm: false } : itinerary
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
            <div key={activity._id} className="flex justify-between mb-4 items-start">
              <div className="flex-1">
                <h3 className="font-bold">{activity.name}</h3>
                <p>{activity.date}</p>
              </div>
              <div className="flex items-center">
                {!activity.showReviewForm && (
                  <button
                    onClick={() => toggleReviewForm('activity', activity._id)}
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
                        handleRatingChange('activity', activity._id, parseInt(e.target.value))
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
                        handleTitleChange('activity', activity._id, e.target.value)
                      }
                      className="p-2 w-full border rounded mb-2"
                    />
                    <textarea
                      placeholder="Write your review..."
                      value={activity.body}
                      onChange={(e) =>
                        handleBodyChange('activity', activity._id, e.target.value)
                      }
                      className="p-2 w-full border rounded mb-2"
                    />
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleSubmit('activity', activity._id)}
                      className="py-2 px-4 bg-blue-500 text-white rounded-md"
                    >
                      Submit Review
                    </button>
                    <button
                      onClick={() => cancelReviewForm('activity', activity._id)}
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
            <div key={itinerary._id} className="flex justify-between mb-4 items-start">
              <div className="flex-1">
                <h3 className="font-bold">{itinerary.name}</h3>
                <p>{itinerary.availableDates ? itinerary.availableDates.map(date => new Date(date).toLocaleDateString()).join(', ') : 'No available dates'}</p>              
                </div>
              <div className="flex items-center">
                {!itinerary.showReviewForm && (
                  <button
                    onClick={() => toggleReviewForm('itinerary', itinerary._id)}
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
                        handleRatingChange('itinerary', itinerary._id, parseInt(e.target.value))
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
                        handleTitleChange('itinerary', itinerary._id, e.target.value)
                      }
                      className="p-2 w-full border rounded mb-2"
                    />
                    <textarea
                      placeholder="Write your review..."
                      value={itinerary.body}
                      onChange={(e) =>
                        handleBodyChange('itinerary', itinerary._id, e.target.value)
                      }
                      className="p-2 w-full border rounded mb-2"
                    />
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleSubmit('itinerary', itinerary._id)}
                      className="py-2 px-4 bg-blue-500 text-white rounded-md"
                    >
                      Submit Review
                    </button>
                    <button
                      onClick={() => cancelReviewForm('itinerary', itinerary._id)}
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
