// MuseumList.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../utils/axiosConfig';


function MuseumList() {
  const [museums, setMuseums] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // Initialize navigate

  const handleHomeClick = () => {
    navigate('/GovernorDashboard'); // Replace with the correct route for your dashboard
  } 

  useEffect(() => {
    const fetchMuseums = async () => {
      try {
        const response = await axiosInstance.get('/api/museum/');
        setMuseums(response.data); // Assuming the response data is an array
        setError(null); // Clear any previous error
      } catch (err) {
        setError('Failed to fetch museums.');
        console.error(err);
      }
    };

    fetchMuseums();
  }, []);

  return (
    <div>
    <button onClick={handleHomeClick}>Home</button> {/* Home Button */}
      <h2>Museums List</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <pre>{JSON.stringify(museums, null, 2)}</pre> {/* Display JSON response with formatting */}
    </div>
  );
}

export default MuseumList;
