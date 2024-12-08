import React, { useState } from 'react';
import Header from '../Header.js';
import louvreImage from '../../images/louvre.webp';
import tokyoTowerImage from '../../images/tokyo_tower.jpg';

const data = {
    itineraries: [
      {
        id: 1,
        name: "Nile River Cruise",
        price: 300,
        date: "2024-11-20",
        tags: ["Adventure", "Cultural"],
        language: "English",
        timeline: "7 days",
        pickupLocation: "Cairo",
        dropoffLocation: "Aswan",
        accessibility: "Wheelchair accessible",
        availableDates: ["2024-11-20", "2024-12-10", "2025-01-05"],
        activityDetails: [
          {
            name: "Cruise Sightseeing",
            location: "Nile River",
            duration: "3 hours",
            time: "09:00 AM",
          },
        ],
        reviews: [
          {
            rating: 5,
            title: "Amazing Experience!",
            body: "This was a once-in-a-lifetime experience. Highly recommend!",
            author: "Alice",
          },
        ],
      },
      {
        id: 2,
        name: "Paris Art & Culture Tour",
        price: 400,
        date: "2024-12-15",
        tags: ["Art", "History"],
        language: "French",
        timeline: "5 days",
        pickupLocation: "Paris",
        dropoffLocation: "Paris",
        accessibility: "Not wheelchair accessible",
        availableDates: ["2024-12-15", "2025-01-10"],
        activityDetails: [
          {
            name: "Louvre Museum Visit",
            location: "Louvre Museum",
            duration: "4 hours",
            time: "10:00 AM",
          },
        ],
        reviews: [
          {
            rating: 4,
            title: "Great Insights into Art!",
            body: "Learned so much about art history. Well worth it!",
            author: "Bob",
          },
        ],
      },
    ],
    activities: [
      {
        id: 1,
        name: "Eiffel Tower Tour",
        price: 20,
        date: "2024-11-25",
        category: "Educational",
        tags: ["Landmark", "Family-friendly"],
        location: "Paris",
        specialDiscounts: "10% off for students",
        bookingStatus: "Open",
        reviews: [
          {
            rating: 5,
            title: "A Must-See!",
            body: "Breathtaking views and very informative.",
            author: "Claire",
          },
        ],
      },
      {
        id: 2,
        name: "Tokyo Tower Visit",
        price: 15,
        date: "2024-12-05",
        category: "Educational",
        tags: ["Landmark", "Photography"],
        location: "Tokyo",
        specialDiscounts: "15% off for groups",
        bookingStatus: "Closed",
        reviews: [
          {
            rating: 4,
            title: "Stunning View!",
            body: "Great place to capture the Tokyo skyline.",
            author: "Daniel",
          },
        ],
      },
    ],
    museums: [
      {
        id: 1,
        name: "Louvre Museum",
        description: "World-renowned museum with historic art.",
        location: "Paris, France",
        openingHours: "09:00 AM - 06:00 PM",
        foreignerPrice: 20,
        nativePrice: 15,
        studentPrice: 10,
        tags: ["Art", "History", "Cultural"],
        images: [louvreImage],
        additionalInfo: "One of the largest art museums in the world.",
      },
      {
        id: 2,
        name: "Tokyo National Museum",
        description: "Museum showcasing Japan's cultural heritage.",
        location: "Tokyo, Japan",
        openingHours: "10:00 AM - 05:00 PM",
        foreignerPrice: 18,
        nativePrice: 12,
        studentPrice: 8,
        tags: ["Culture", "History"],
        images: [tokyoTowerImage],
        additionalInfo: "Japan's oldest national museum.",
      },
    ],
  };
  

  function GuestDashboard() {
    const [selectedTab, setSelectedTab] = useState('all');
    const [expandedItinerary, setExpandedItinerary] = useState(null);
    const [expandedActivity, setExpandedActivity] = useState(null);
    const [expandedMuseum, setExpandedMuseum] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [orderBy, setOrderBy] = useState('ascending');
    const [dropdownOpen, setDropdownOpen] = useState(false); // State for managing dropdown

  
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
        setDropdownOpen(!dropdownOpen); // Toggle dropdown visibility
      };
  
    const filteredAndSortedData = (dataArray) => {
      // Filter based on search query
      const filteredData = dataArray.filter((item) =>
        item.name.toLowerCase().includes(searchQuery)
      );
      // Sort based on order
      return filteredData.sort((a, b) =>
        orderBy === 'ascending' ? a.price - b.price : b.price - a.price
      );
    };
  
    const renderItineraries = () => (
      <div className="space-y-4 max-w-md mx-auto">
        <h2 className="text-2xl font-bold">Itineraries</h2>
        {filteredAndSortedData(data.itineraries).map((itinerary) => (
          <div key={itinerary.id} className="p-6 bg-white shadow-lg rounded-lg text-sm">
            <h3 className="text-xl font-semibold">{itinerary.name}</h3>
            <p className="text-blue-500">${itinerary.price}</p>
            <p>Date: {itinerary.date}</p>
            <p>Tags: {itinerary.tags.join(', ')}</p>
            <p>Language: {itinerary.language}</p>
            <div className="flex space-x-2 mt-2">
             
              <button
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                onClick={() => handleMoreInfoItinerary(itinerary.id)}
              >
                More Info
              </button>
            </div>
            {expandedItinerary === itinerary.id && (
              <div className="mt-4 text-gray-700">
                <p><strong>Timeline:</strong> {itinerary.timeline}</p>
                <p><strong>Pick-up Location:</strong> {itinerary.pickupLocation}</p>
                <p><strong>Drop-off Location:</strong> {itinerary.dropoffLocation}</p>
                <p><strong>Accessibility:</strong> {itinerary.accessibility}</p>
                <h4 className="font-semibold mt-2">Reviews</h4>
                {itinerary.reviews.map((review, idx) => (
                  <div key={idx} className="mt-2">
                    <p><strong>Rating:</strong> {review.rating}/5</p>
                    <p><strong>Title:</strong> {review.title}</p>
                    <p>{review.body}</p>
                    <p className="text-gray-500">- {review.author}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    );
  
    const renderActivities = () => (
      <div className="space-y-4 max-w-md mx-auto">
        <h2 className="text-2xl font-bold">Activities</h2>
        {filteredAndSortedData(data.activities).map((activity) => (
          <div key={activity.id} className="p-6 bg-white shadow-lg rounded-lg text-sm">
            <h3 className="text-xl font-semibold">{activity.name}</h3>
            <p className="text-blue-500">${activity.price}</p>
            <p>Date: {activity.date}</p>
            <p>Category: {activity.category}</p>
            <p>Tags: {activity.tags.join(', ')}</p>
            <div className="flex space-x-2 mt-2">
              
              <button
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                onClick={() => handleMoreInfoActivity(activity.id)}
              >
                More Info
              </button>
            </div>
            {expandedActivity === activity.id && (
              <div className="mt-4 text-gray-700">
                <p><strong>Time:</strong> {activity.time || 'N/A'}</p>
                <p><strong>Location:</strong> {activity.location}</p>
                <p><strong>Special Discounts:</strong> {activity.specialDiscounts}</p>
                <h4 className="font-semibold mt-2">Reviews</h4>
                {activity.reviews.map((review, idx) => (
                  <div key={idx} className="mt-2">
                    <p><strong>Rating:</strong> {review.rating}/5</p>
                    <p><strong>Title:</strong> {review.title}</p>
                    <p>{review.body}</p>
                    <p className="text-gray-500">- {review.author}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    );
  
    const renderMuseums = () => (
      <div className="space-y-4 max-w-md mx-auto">
        <h2 className="text-2xl font-bold">Museums</h2>
        {filteredAndSortedData(data.museums).map((museum) => (
          <div key={museum.id} className="p-6 bg-white shadow-lg rounded-lg text-sm">
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
              onClick={() => handleMoreInfoMuseum(museum.id)}
            >
              More Info
            </button>
            {expandedMuseum === museum.id && (
              <div className="mt-4 text-gray-700">
                <h4 className="font-semibold">Images</h4>
                <div className="flex space-x-2 mt-2">
                  {museum.images.map((image, idx) => (
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
        <Header toggleDropdown={toggleDropdown} dropdownOpen={dropdownOpen} />
    
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
              <option value="ascending">Price (Low to High)</option>
              <option value="descending">Price (High to Low)</option>
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
        </div>
      );
    }
  
  export default GuestDashboard;