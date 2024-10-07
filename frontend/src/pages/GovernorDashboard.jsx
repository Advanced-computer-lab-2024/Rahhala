import React, { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import axiosInstance from '../utils/axiosConfig';
import { useNavigate } from 'react-router-dom';
import LogoutButton from '../components/LogoutButton'; // Import the LogoutButton

function GovernorDashboard() {
  const navigate = useNavigate(); // Hook to access navigate function
  const { auth } = useContext(AuthContext);
  const [showCreateMuseumForm, setShowCreateMuseumForm] = useState(false); // State to control form visibility
  const [museumData, setMuseumData] = useState({
    name: '',
    location: '',
    description: '',
    openingHours: '',
    ticketPrice: '',
    pictures: ''
  });
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleShowMuseums = () => {
    console.log('auth', auth);
    navigate('/showAllMuseums'); // Redirect to the museums list page
  };

  const handleInputChange = (e) => {
    setMuseumData({
      ...museumData,
      [e.target.name]: e.target.value
    });
  };

  const handleCreateMuseumSubmit = async (e) => {
    e.preventDefault();
    try {
        console.log("entered create museum submit");
        console.log(museumData);
        const formattedData = {
            ...museumData,
            pictures: museumData.pictures.split(',').map(picture => picture.trim())
        };
        console.log('formattedData:', formattedData);
        console.log(auth)
      await axiosInstance.post('/createMuseum', formattedData); // Assuming you have this API endpoint
      setShowCreateMuseumForm(false);
      setSuccessMessage('Museum created successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setErrorMessage('Failed to create museum.');
      setTimeout(() => setErrorMessage(''), 3000);
    }
  };

  return (
    <div>
      <h2>Governor Dashboard</h2>
      {successMessage && <div className="success-message">{successMessage}</div>}
      {errorMessage && <div className="error-message">{errorMessage}</div>}

      <button onClick={handleShowMuseums}>Show Museums</button>
      <button onClick={() => setShowCreateMuseumForm(true)}>Create New Museum</button> {/* Create Museum Button */}

      {/* Create Museum Modal form */}
      {showCreateMuseumForm && (
        <div className="modal">
          <div className="modal-content">
            <h3>Create Museum</h3>
            <form onSubmit={handleCreateMuseumSubmit}>
              <div>
                <label>Name:</label>
                <input
                  type="text"
                  name="name"
                  value={museumData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <label>Location:</label>
                <input
                  type="text"
                  name="location"
                  value={museumData.location}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <label>Description:</label>
                <textarea
                  name="description"
                  value={museumData.description}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <label>Pictures  (comma separated):</label>
                <input
                    type="text"
                    name="pictures"
                    value={museumData.pictures}
                    onChange={handleInputChange}
                    required
                />
            </div>
              <div>
                <label>Opening Hours:</label>
                <input
                  type="text"
                  name="openingHours"
                  value={museumData.openingHours}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <label>Ticket Price:</label>
                <input
                  type="number"
                  name="ticketPrice"
                  value={museumData.ticketPrice}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <button type="submit">Submit</button>
              <button type="button" onClick={() => setShowCreateMuseumForm(false)}>Cancel</button>
            </form>
          </div>
        </div>
      )}

      <LogoutButton />
    </div>
  );
}

export default GovernorDashboard;
