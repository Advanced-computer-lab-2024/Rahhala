import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../Header.js';
import axiosInstance from '../../../utils/axiosConfig';
import { AuthContext } from '../../../context/AuthContext';

const BookingPage = () => {
  const { auth } = useContext(AuthContext);
  const [error, setError] = useState(null);
  const [activities, setActivities] = useState([]);
  const [itineraries, setItineraries] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [reviewType, setReviewType] = useState('');
  const [reviewId, setReviewId] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (auth.isAuthenticated && auth.user) {
      const fetchBookings = async () => {
        try {
          const response = await axiosInstance.get('/api/tourist/bookings');
          const { bookedActivities, bookedItineraries } = response.data;

          setActivities(bookedActivities);
          setItineraries(bookedItineraries);
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

  const openReviewModal = (type, id) => {
    setReviewType(type);
    setReviewId(id);
    setIsReviewModalOpen(true);
  };

  const closeReviewModal = () => {
    setIsReviewModalOpen(false);
    setRating(0);
    setTitle('');
    setBody('');
  };

  const handleRatingChange = (e) => {
    setRating(parseInt(e.target.value));
  };

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const handleBodyChange = (e) => {
    setBody(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.post('/api/review', {
        rating,
        title,
        body,
        reviewedEntity: reviewId,
        reviewedEntityType: reviewType
      });
      alert('Review submitted successfully');
      window.location.reload();
    } catch (err) {
      setError('Failed to submit review.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header toggleDropdown={toggleDropdown} dropdownOpen={dropdownOpen} />
      <div className="container mx-auto px-4 mt-4">
        <button
          onClick={() => navigate(-1)}
          className="text-blue-500 mb-4 flex items-center"
        >
          ← Back
        </button>
        <div className="bg-white rounded-lg shadow-lg p-6">
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
                  <button
                    onClick={() => openReviewModal('activity', activity._id)}
                    className="py-2 px-4 bg-blue-500 text-white rounded-md"
                  >
                    Review
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Booked Itineraries</h2>
            {itineraries.map((itinerary) => (
              <div key={itinerary._id} className="flex justify-between mb-4 items-start">
                <div className="flex-1">
                  <h3 className="font-bold">{itinerary.name}</h3>
                  <p>
                    {itinerary.availableDates
                      ? itinerary.availableDates.map((date) => new Date(date).toLocaleDateString()).join(', ')
                      : 'No available dates'}
                  </p>
                </div>
                <div className="flex items-center">
                  <button
                    onClick={() => openReviewModal('itinerary', itinerary._id)}
                    className="py-2 px-4 bg-blue-500 text-white rounded-md"
                  >
                    Review
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {isReviewModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md">
            <h2 className="text-xl font-semibold mb-4">Submit Review</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex flex-col">
                <label className="font-bold" htmlFor="rating">Rating:</label>
                <select
                  id="rating"
                  value={rating}
                  onChange={handleRatingChange}
                  className="p-2 border rounded"
                  required
                >
                  <option value={0}>0</option>
                  <option value={1}>1</option>
                  <option value={2}>2</option>
                  <option value={3}>3</option>
                  <option value={4}>4</option>
                  <option value={5}>5</option>
                </select>
              </div>
              <div className="flex flex-col">
                <label className="font-bold" htmlFor="title">Review Title:</label>
                <input
                  type="text"
                  id="title"
                  value={title}
                  onChange={handleTitleChange}
                  className="p-2 border rounded"
                  required
                />
              </div>
              <div className="flex flex-col">
                <label className="font-bold" htmlFor="body">Review Body:</label>
                <textarea
                  id="body"
                  value={body}
                  onChange={handleBodyChange}
                  className="p-2 border rounded"
                  required
                />
              </div>
              <div className="flex justify-center mt-6 space-x-4">
                <button
                  type="submit"
                  className="py-2 px-4 bg-blue-500 text-white rounded-md"
                >
                  Submit Review
                </button>
                <button
                  onClick={closeReviewModal}
                  type="button"
                  className="py-2 px-4 bg-gray-500 text-white rounded-md"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingPage;