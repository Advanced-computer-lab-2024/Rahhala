import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../../utils/axiosConfig';
import { AuthContext } from '../../../context/AuthContext';
import Header from '../../Header';

function Flights() {
  const [searchQuery, setSearchQuery] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [flights, setFlights] = useState([]);
  const [airports, setAirports] = useState([]);
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [departureDate, setDepartureDate] = useState('');
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [meta, setMeta] = useState(null);

  const navigate = useNavigate();

  const handleSearchAirports = async () => {
    try {
      const response = await axiosInstance.post('/api/flights/search-airports', { city: searchQuery });
      setAirports(response.data);
      setIsModalOpen(true);
    } catch (err) {
      setError('Failed to load airports.');
    }
  };

  const handleSearchFlights = async () => {
    try {
      const formattedDate = new Date(departureDate).toISOString().split('T')[0];
      console.log('formattedDate', formattedDate);  
      const response = await axiosInstance.post('/api/flights/search-flights', {
        origin,
        destination,
        departureDate: formattedDate,
      });
      setFlights(response.data.data);
      console.log('response.data', response.data);  
      setMeta(response.data.meta);
    } catch (err) {
      setError('Failed to load flights.');
    }
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  
  const renderAirports = () => (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50" onClick={closeModal}>
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-2xl w-full max-h-96 overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-2xl font-bold mb-4">Airports</h2>
        {airports.map((airport) => (
          <div key={airport.iataCode} className="p-4 border-b border-gray-200">
            <h3 className="text-xl font-semibold">{airport.name}</h3>
            <p className="text-blue-500">IATA Code: {airport.iataCode}</p>
          </div>
        ))}
        <button className="mt-4 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded" onClick={closeModal}>
          Close
        </button>
      </div>
    </div>
  );

  const renderFlights = () => (
    <div className="mt-6">
      <h2 className="text-2xl font-bold mb-4">Flights</h2>
      {flights.map((flight) => (
        <div key={flight.id} className="p-4 border-b border-gray-200">
          <h3 className="text-xl font-semibold">{flight.airline}</h3>
          <p>Flight Number: {flight.flightNumber}</p>
          <p>Departure: {flight.departure}</p>
          <p>Arrival: {flight.arrival}</p>
          <p>Price: {flight.price}</p>
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-cover bg-center" style={{ backgroundImage: 'url(/path/to/your/background-image.jpg)' }}>
      <Header toggleDropdown={toggleDropdown} dropdownOpen={dropdownOpen} />

      <div className="flex justify-center mt-4 space-x-4">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search for airports by city..."
          className="p-2 border border-gray-300 rounded"
        />
        <button
          onClick={handleSearchAirports}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
        >
          Search Airports
        </button>
      </div>

      <div className="flex justify-center mt-4 space-x-4">
        <input
          type="text"
          value={origin}
          onChange={(e) => setOrigin(e.target.value)}
          placeholder="Origin"
          className="p-2 border border-gray-300 rounded"
        />
        <input
          type="text"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          placeholder="Destination"
          className="p-2 border border-gray-300 rounded"
        />
        <input
          type="date"
          value={departureDate}
          onChange={(e) => setDepartureDate(e.target.value)}
          className="p-2 border border-gray-300 rounded"
        />
        <button
          onClick={handleSearchFlights}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
        >
          Search Flights
        </button>
      </div>

      <div className="mt-6">
        {isModalOpen && renderAirports()}
      </div>

      {flights.length > 0 && renderFlights()}
      {error && <div className="text-center text-red-500 mt-4">{error}</div>}
    </div>
  );
}

export default Flights;