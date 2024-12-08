import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axiosConfig';
import { AuthContext } from '../../context/AuthContext';
import Header from '../Header.js';

function TouristDashboard() {
  const [selectedTab, setSelectedTab] = useState('all');
  const [expandedItinerary, setExpandedItinerary] = useState(null);
  const [expandedActivity, setExpandedActivity] = useState(null);
  const [expandedMuseum, setExpandedMuseum] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [orderBy, setOrderBy] = useState('price-ascending');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [filterOption, setFilterOption] = useState('category');
  const [itineraries, setItineraries] = useState([]);
  const [activities, setActivities] = useState([]);
  const [museums, setMuseums] = useState([]);
  const [error, setError] = useState(null);
  const [reviews, setReviews] = useState([]);
  const { auth } = useContext(AuthContext);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const itinerariesResponse = await axiosInstance.get('/api/itinerary');
        itinerariesResponse.data = itinerariesResponse.data.filter(itinerary => itinerary.flagged === false);
        itinerariesResponse.data = itinerariesResponse.data.filter(itinerary => itinerary.isActive);
        setItineraries(itinerariesResponse.data);

        const activitiesResponse = await axiosInstance.get('/api/activity');
        activitiesResponse.data = activitiesResponse.data.filter(activity => activity.bookingOpen);
        setActivities(activitiesResponse.data);

        const museumsResponse = await axiosInstance.get('/api/museum');
        setMuseums(museumsResponse.data);
      } catch (err) {
        setError('Failed to load data.');
      }
    };

    fetchData();

    const fetchReviews = async () => {
      try {
        const response = await axiosInstance.get('/api/review');
        setReviews(response.data);
      } catch (err) {
        setError('Failed to load reviews.');
      }
    };

    fetchReviews();
  }, []);

  const handleMoreInfoItinerary = (id) => {
    setExpandedItinerary(expandedItinerary === id ? null : id);
  };

  const handleMoreInfoActivity = (id) => {
    setExpandedActivity(expandedActivity === id ? null : id);
  };

  const handleMoreInfoMuseum = (id) => {
    setExpandedMuseum(expandedMuseum === id ? null : id);
  };

  const handleSearch = (event) => {
    setSearchQuery(event.target.value.toLowerCase());
  };

  const handleOrderByChange = (event) => {
    setOrderBy(event.target.value);
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleFilterChange = (event) => {
    setFilterOption(event.target.value);
  };

  const filteredAndSortedData = (dataArray) => {
    const filteredData = dataArray.filter((item) =>
      item.name.toLowerCase().includes(searchQuery)
    );
    return filteredData.sort((a, b) => {
      if (orderBy === 'price-ascending') return a.price - b.price;
      if (orderBy === 'price-descending') return b.price - a.price;
      if (orderBy === 'date-latest') return new Date(b.date) - new Date(a.date);
      if (orderBy === 'date-oldest') return new Date(a.date) - new Date(b.date);
      return 0;
    });
  };

  const renderReviews = (entityId, entityType) => {
    const entityReviews = reviews.filter(review => review.reviewedEntity.toString() === entityId && review.reviewedEntityType === entityType);
    
    // Calculate average rating
    const averageRating = entityReviews.length > 0
        ? (entityReviews.reduce((sum, review) => sum + review.rating, 0) / entityReviews.length).toFixed(1)
        : 0;
    
    return (
      <div>
        <h4 className="font-semibold mt-2">Reviews</h4>
        {/* Add average rating display */}
        <div className="mb-3 p-2 bg-gray-50 rounded">
          <p className="text-lg font-medium">
            Average Rating: {averageRating}/5 ⭐
          </p>
          <p className="text-sm text-gray-600">
            ({entityReviews.length} {entityReviews.length === 1 ? 'review' : 'reviews'})
          </p>
        </div>
        {entityReviews.length > 0 ? (
          entityReviews.map((review, idx) => (
            <div key={idx} className="mt-2">
              <p><strong>Rating:</strong> {review.rating}/5</p>
              <p><strong>Title:</strong> {review.title}</p>
              <p>{review.body}</p>
              <p className="text-gray-500">- {review.tourist}</p>
            </div>
          ))
        ) : (
          <p>No reviews available</p>
        )}
      </div>
    );
};
  const renderItineraries = () => (
    <div className="space-y-4 max-w-md mx-auto">
      <h2 className="text-2xl font-bold">Itineraries</h2>
      {filteredAndSortedData(itineraries).map((itinerary) => (
        <div key={itinerary._id} className="p-6 bg-white shadow-lg rounded-lg text-sm">
          <h3 className="text-xl font-semibold">{itinerary.name}</h3>
          <p className="text-blue-500">${itinerary.price}</p>
          <p>Date: {itinerary.availableDates ? itinerary.availableDates.map(date => new Date(date).toLocaleDateString()).join(', ') : 'No available dates'}</p>
          <p>Tags: {itinerary.tags.join(', ')}</p>
          <p>Language: {itinerary.language}</p>
          <div className="flex space-x-2 mt-2">
            <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded">Book</button>
            <button
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
              onClick={() => handleMoreInfoItinerary(itinerary._id)}
            >
              More Info
            </button>
          </div>
          {expandedItinerary === itinerary._id && (
            <div className="mt-4 text-gray-700">
              <p><strong>Timeline:</strong> {itinerary.timeline}</p>
              <p><strong>Pick-up Location:</strong> {itinerary.pickupLocation}</p>
              <p><strong>Drop-off Location:</strong> {itinerary.dropoffLocation}</p>
              <p><strong>Accessibility:</strong> {itinerary.accessibility}</p>
              {renderReviews(itinerary._id, 'Itinerary')}
            </div>
          )}
        </div>
      ))}
    </div>
  );

  const renderActivities = () => (
    <div className="space-y-4 max-w-md mx-auto">
      <h2 className="text-2xl font-bold">Activities</h2>
      {filteredAndSortedData(activities).map((activity) => (
        <div key={activity._id} className="p-6 bg-white shadow-lg rounded-lg text-sm">
          <h3 className="text-xl font-semibold">{activity.name}</h3>
          <p className="text-blue-500">${activity.price}</p>
          <p>Date: { new Date(activity.date).toLocaleDateString()}</p>
          <p>Category: {activity.category}</p>
          <p>Tags: {activity.tags.join(', ')}</p>
          <div className="flex space-x-2 mt-2">
            <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded">Book</button>
            <button
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
              onClick={() => handleMoreInfoActivity(activity._id)}
            >
              More Info
            </button>
          </div>
          {expandedActivity === activity._id && (
            <div className="mt-4 text-gray-700">
              <p><strong>Time:</strong> {activity.time || 'N/A'}</p>
              <p><strong>Location:</strong> {activity.location}</p>
              <p><strong>Special Discounts:</strong> {activity.specialDiscounts}</p>
              {renderReviews(activity._id, 'Activity')}
            </div>
          )}
        </div>
      ))}
    </div>
  );

  const renderMuseums = () => (
    <div className="space-y-4 max-w-md mx-auto">
      <h2 className="text-2xl font-bold">Museums</h2>
      {filteredAndSortedData(museums).map((museum) => (
        <div key={museum._id} className="p-6 bg-white shadow-lg rounded-lg text-sm">
          <h3 className="text-xl font-semibold">{museum.name}</h3>
          <p>{museum.description}</p>
          <p>Location: {museum.location}</p>
          <p>Opening Hours: {museum.openingHours}</p>
          <p>Foreigner Price: ${museum.foreignerPrice}</p>
          <p>Native Price: ${museum.nativePrice}</p>
          <p>Student Price: ${museum.studentPrice}</p>
          <p>Tags: {museum.tags.join(', ')}</p>
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded mt-2"
            onClick={() => handleMoreInfoMuseum(museum._id)}
          >
            More Info
          </button>
          {expandedMuseum === museum._id && (
            <div className="mt-4 text-gray-700">
              <h4 className="font-semibold">Images</h4>
              <div className="flex space-x-2 mt-2">
                {museum.pictures.map((image, idx) => (
                  <img key={idx} src={image} alt={museum.name} className="w-40 h-40 object-cover rounded" />
                ))}
              </div>
              <p className="mt-4"><strong>Additional Info:</strong> {museum.additionalInfo}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100">
      <Header toggleDropdown={toggleDropdown} dropdownOpen={dropdownOpen}/>

      <div className="flex justify-center space-x-4 mt-4">
        <button
          className={`px-4 py-2 rounded ${selectedTab === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          onClick={() => setSelectedTab('all')}
        >
          Show All
        </button>
        <button
          className={`px-4 py-2 rounded ${selectedTab === 'itineraries' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          onClick={() => setSelectedTab('itineraries')}
        >
          Itineraries
        </button>
        <button
          className={`px-4 py-2 rounded ${selectedTab === 'activities' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          onClick={() => setSelectedTab('activities')}
        >
          Activities
        </button>
        <button
          className={`px-4 py-2 rounded ${selectedTab === 'museums' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          onClick={() => setSelectedTab('museums')}
        >
          Museums
        </button>
      </div>

      <div className="flex justify-center mt-4 space-x-4">
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearch}
          placeholder="Search..."
          className="p-2 border border-gray-300 rounded"
        />
        <select
          value={orderBy}
          onChange={handleOrderByChange}
          className="p-2 border border-gray-300 rounded"
        >
          <option value="price-ascending">Price (Low to High)</option>
          <option value="price-descending">Price (High to Low)</option>
          <option value="date-latest">Date (Latest)</option>
          <option value="date-oldest">Date (Oldest)</option>
        </select>
      </div>

      <div className="mt-6">
        {selectedTab === 'all' && (
          <div>
            {renderItineraries()}
            {renderActivities()}
            {renderMuseums()}
          </div>
        )}
        {selectedTab === 'itineraries' && renderItineraries()}
        {selectedTab === 'activities' && renderActivities()}
        {selectedTab === 'museums' && renderMuseums()}
      </div>

      {error && <div className="text-center text-red-500 mt-4">{error}</div>}
    </div>
  );
}

export default TouristDashboard;