import React, { useState, useEffect } from 'react';
import axios from 'axios';

const SellerProfile = ({ email }) => {
  const [profile, setProfile] = useState({
    name: '',
    description: ''
  });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Fetch the existing profile when the component loads
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(`/seller-profile/${email}`);
        setProfile({
          name: res.data.profile.name || '',
          description: res.data.profile.description || ''
        });
      } catch (err) {
        setError('Error fetching seller profile.');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [email]);

  // Handle input changes
  const handleChange = (e) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value
    });
  };

  // Handle form submission for creating/updating seller profile
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.put('/seller-profile', { email, ...profile });
      setMessage(res.data.message);
    } catch (err) {
      setError('Error updating seller profile.');
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="seller-profile-container">
      <h2>Seller Profile</h2>

      {message && <p className="success-message">{message}</p>}
      {error && <p className="error-message">{error}</p>}

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={profile.name}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label htmlFor="description">Description:</label>
          <textarea
            id="description"
            name="description"
            value={profile.description}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit">Update Profile</button>
      </form>
    </div>
  );
};

export default SellerProfile;
