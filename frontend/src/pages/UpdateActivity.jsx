import { AuthContext } from '../context/AuthContext';
import axiosInstance from '../utils/axiosConfig';
import { useNavigate } from 'react-router-dom';
import React, { useContext, useState } from 'react';
import NavigateButton from '../components/UpdateProfileButton';
import Logout from '../components/Auth/Logout';

const UpdateActivity = () => {
  const navigate = useNavigate();
  const { auth } = useContext(AuthContext);

  if (!auth.isAuthenticated) {
    navigate('/login');
  }

  const [error, setError] = useState(null);
  const [activityId, setActivityId] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    date: '',
    time: '',
    location: [],
    price: '',
    category: '',
    tags: [],
    specialDiscounts: '',
    bookingOpen: true,
    rating: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (auth.isAuthenticated && auth.user) {
      try {
        await axiosInstance.patch(`/updateActivity/${activityId}`, formData);
        navigate('/advertiser-dashboard');
      } catch (err) {
        setError('Failed to update activity.');
      }
    }
  };

  return (
    <div>
      <h2>Update Activity</h2>
      {error && <p>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Activity ID:</label>
          <input
            type="text"
            name="activityId"
            value={activityId}
            onChange={(e) => setActivityId(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Name:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Date:</label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Time:</label>
          <input
            type="text"
            name="time"
            value={formData.time}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Location:</label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value.split(',').map(Number) })}
          />
        </div>
        <div>
          <label>Price:</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Category:</label>
          <input
            type="text"
            name="category"
            value={formData.category}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Tags:</label>
          <input
            type="text"
            name="tags"
            value={formData.tags}
            onChange={(e) => setFormData({ ...formData, tags: e.target.value.split(',') })}
          />
        </div>
        <div>
          <label>Special Discounts:</label>
          <input
            type="text"
            name="specialDiscounts"
            value={formData.specialDiscounts}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Booking Open:</label>
          <input
            type="checkbox"
            name="bookingOpen"
            checked={formData.bookingOpen}
            onChange={(e) => setFormData({ ...formData, bookingOpen: e.target.checked })}
          />
        </div>
        <div>
          <label>Rating:</label>
          <input
            type="number"
            name="rating"
            value={formData.rating}
            onChange={handleChange}
            min="0"
            max="5"
          />
        </div>
        <button type="submit">Update Activity</button>
      </form>
      <NavigateButton path={'/activities'} text={'Home'} />
      <Logout />
    </div>
  );
};

export default UpdateActivity;