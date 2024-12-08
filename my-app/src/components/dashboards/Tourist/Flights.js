import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../../utils/axiosConfig';
import { AuthContext } from '../../../context/AuthContext';
import Header from '../../Header';

function Flights() {
  const [selectedTab, setSelectedTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [orderBy, setOrderBy] = useState('price-ascending');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [flights, setFlights] = useState([]);
  const [error, setError] = useState(null);
  const { auth } = useContext(AuthContext);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchFlights = async () => {
      try {
        const response = await axiosInstance.get('/api/flights');
        setFlights(response.data);
      } catch (err) {
        setError('Failed to load flights.');
      }
    };

    fetchFlights();
  }, []);

  const handleSearch = (event) => {
    setSearchQuery(event.target.value.toLowerCase());
  };

  const handleOrderByChange = (event) => {
    setOrderBy(event.target.value);
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
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

  const renderFlights = () => (
    <div className="space-y-4 max-w-md mx-auto">
      <h2 className="text-2xl font-bold">Flights</h2>
      {filteredAndSortedData(flights).map((flight) => (
        <div key={flight._id} className="p-6 bg-white shadow-lg rounded-lg text-sm">
          <h3 className="text-xl font-semibold">{flight.name}</h3>
          <p className="text-blue-500">${flight.price}</p>
          <p>Date: {new Date(flight.date).toLocaleDateString()}</p>
          <p>Tags: {flight.tags.join(', ')}</p>
          <div className="flex space-x-2 mt-2">
            <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded">Book</button>
            <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">More Info</button>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-cover bg-center" style={{ backgroundImage: 'url(/path/to/your/background-image.jpg)' }}>
      <Header toggleDropdown={toggleDropdown} dropdownOpen={dropdownOpen} />

      <div className="flex justify-center space-x-4 mt-4">
        <button
          className={`px-4 py-2 rounded ${selectedTab === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          onClick={() => setSelectedTab('all')}
        >
          Show All
        </button>
        <button
          className={`px-4 py-2 rounded ${selectedTab === 'flights' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          onClick={() => setSelectedTab('flights')}
        >
          Flights
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
        {selectedTab === 'all' && renderFlights()}
        {selectedTab === 'flights' && renderFlights()}
      </div>

      {error && <div className="text-center text-red-500 mt-4">{error}</div>}
    </div>
  );
}

export default Flights;