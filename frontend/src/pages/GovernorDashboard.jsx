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
    pictures: '',
    tags: '' // Added tags to state
  });
  const [deleteMuseumName, setDeleteMuseumName] = useState(''); // State for museum name to delete
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [showUpdateMuseumForm, setShowUpdateMuseumForm] = useState(false); // State for update form visibility
  const [showDeleteMuseumForm, setShowDeleteMuseumForm] = useState(false); // State for delete form visibility
  const [showChangePasswordForm, setShowChangePasswordForm] = useState(false); // State for change password form visibility
  const [oldPassword, setOldPassword] = useState(''); // State for old password
  const [newPassword, setNewPassword] = useState(''); // State for new password

  const handleShowMuseums = () => {
    navigate('/showAllMuseums'); // Redirect to the museums list page
  };

  const handleShowMuseumTags = () => {
    navigate('/museumTags'); // Redirect to the museum tags page
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
      const formattedData = {
        ...museumData,
        pictures: museumData.pictures.split(',').map(picture => picture.trim())
      };
      await axiosInstance.post('/createMuseum', formattedData); // Assuming you have this API endpoint
      setShowCreateMuseumForm(false);
      setSuccessMessage('Museum created successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setErrorMessage('Failed to create museum.');
      setTimeout(() => setErrorMessage(''), 3000);
    }
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    try {
      const formattedData = {
        ...museumData,
        pictures: museumData.pictures.split(',').map(picture => picture.trim()),
        tags: museumData.tags.split(',').map(tag => tag.trim()) // Handle tags
      };
      await axiosInstance.patch(`/updateMuseumName/${museumData.name}`, formattedData); // Assuming you have this API endpoint
      setShowUpdateMuseumForm(false);
      setSuccessMessage('Museum updated successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setErrorMessage('Failed to update museum.');
      setTimeout(() => setErrorMessage(''), 3000);
    }
  };

  const handleDeleteMuseumSubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.delete(`/deleteMuseumName/${deleteMuseumName}`); // Assuming you have this API endpoint
      setDeleteMuseumName('');
      setShowDeleteMuseumForm(false); // Hide the form after successful deletion
      setSuccessMessage('Museum deleted successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setErrorMessage('Failed to delete museum.');
      setTimeout(() => setErrorMessage(''), 3000);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.put('/api/governor/changePassword', {
        oldPassword,
        newPassword
      });
      setSuccessMessage('Password changed successfully');
      setErrorMessage(null); // Clear any previous errors
      setOldPassword(''); // Clear the input fields
      setNewPassword(''); // Clear the input fields
      setShowChangePasswordForm(false); // Hide the form after successful password change
    } catch (err) {
      setErrorMessage(err.response?.data?.message || 'Failed to change password');
      setSuccessMessage(null); // Clear any previous success messages
    }
  };

  return (
    <div>
      <h2>Governor Dashboard</h2>
      {successMessage && <div className="success-message">{successMessage}</div>}
      {errorMessage && <div className="error-message">{errorMessage}</div>}

      <button onClick={handleShowMuseums}>Show Museums</button>
      <button onClick={() => setShowCreateMuseumForm(true)}>Create New Museum</button>
      <button onClick={() => setShowUpdateMuseumForm(true)}>Update Museum</button>
      <button onClick={() => setShowDeleteMuseumForm(true)}>Delete Museum</button> {/* Button to toggle delete form */}
      <button onClick={() => setShowChangePasswordForm(!showChangePasswordForm)}>
        {showChangePasswordForm ? 'Cancel' : 'Change My Password'}
      </button>
      <button onClick={handleShowMuseumTags}>Manage Museum Tags</button> {/* Button to navigate to MuseumTags */}
      {showChangePasswordForm && (
        <form onSubmit={handleChangePassword}>
          <div>
            <label>Old Password:</label>
            <input
              type="password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              required
            />
          </div>
          <div>
            <label>New Password:</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit">Change Password</button>
        </form>
      )}

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
                <label>Pictures (comma separated):</label>
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

      {/* Update Museum Modal form */}
      {showUpdateMuseumForm && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={() => setShowUpdateMuseumForm(false)}>&times;</span>
            <h2>Update Museum</h2>
            <form onSubmit={handleUpdateSubmit}>
              <div>
                <label>Name:</label>
                <input
                  type="text"
                  name="name"
                  value={museumData.name}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <label>Location:</label>
                <input
                  type="text"
                  name="location"
                  value={museumData.location}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <label>Opening Hours:</label>
                <input
                  type="text"
                  name="openingHours"
                  value={museumData.openingHours}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <label>Pictures (comma separated):</label>
                <input
                  type="text"
                  name="pictures"
                  value={museumData.pictures}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <label>Tags (comma separated):</label>
                <input
                  type="text"
                  name="tags"
                  value={museumData.tags}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <label>Ticket Price:</label>
                <input
                  type="number"
                  name="ticketPrice"
                  value={museumData.ticketPrice}
                  onChange={handleInputChange}
                />
              </div>
              <button type="submit">Submit</button>
              <button type="button" onClick={() => setShowUpdateMuseumForm(false)}>Cancel</button>
            </form>
          </div>
        </div>
      )}

      {/* Delete Museum Modal form */}
      {showDeleteMuseumForm && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={() => setShowDeleteMuseumForm(false)}>&times;</span>
            <h2>Delete Museum</h2>
            <form onSubmit={handleDeleteMuseumSubmit}>
              <div>
                <label>Museum Name:</label>
                <input
                  type="text"
                  name="deleteMuseumName"
                  value={deleteMuseumName}
                  onChange={(e) => setDeleteMuseumName(e.target.value)}
                  required
                />
              </div>
              <button type="submit">Delete</button>
              <button type="button" onClick={() => setShowDeleteMuseumForm(false)}>Cancel</button>
            </form>
          </div>
        </div>
      )}

      <LogoutButton />
    </div>
  );
}

export default GovernorDashboard;