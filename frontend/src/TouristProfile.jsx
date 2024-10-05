import React, { useState, useEffect } from "react";
import axios from "axios";

const TouristProfile = () => {
  const [profile, setProfile] = useState({
    username: "",
    email: "",
    mobileNumber: "",
    nationality: "",
    dob: "",
    occupation: "",
    wallet: 0, // wallet is readonly
  });

  const [formData, setFormData] = useState({
    mobileNumber: "",
    nationality: "",
    dob: "",
    occupation: "",
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState("");

  // Fetch profile on component mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const email = "user@example.com"; // Replace with actual logged-in user email
        const response = await axios.get(`/profile/tourist/${email}`);
        setProfile(response.data.profile);
        setFormData({
          mobileNumber: response.data.profile.mobileNumber,
          nationality: response.data.profile.nationality,
          dob: response.data.profile.dob.split("T")[0], // Format date for input
          occupation: response.data.profile.occupation,
        });
        setLoading(false);
      } catch (err) {
        setError("Error fetching profile");
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submit for profile update
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const email = profile.email;
      await axios.put(`/profile/tourist/${email}`, formData);
      setMessage("Profile updated successfully");
    } catch (err) {
      setError("Error updating profile");
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="tourist-profile">
      <h2>Tourist Profile</h2>
      {message && <div className="success-message">{message}</div>}

      <form onSubmit={handleSubmit}>
        <div>
          <label>Username (Read Only):</label>
          <input type="text" value={profile.username} readOnly />
        </div>

        <div>
          <label>Email (Read Only):</label>
          <input type="email" value={profile.email} readOnly />
        </div>

        <div>
          <label>Wallet (Read Only):</label>
          <input type="number" value={profile.wallet} readOnly />
        </div>

        <div>
          <label>Mobile Number:</label>
          <input
            type="text"
            name="mobileNumber"
            value={formData.mobileNumber}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label>Nationality:</label>
          <input
            type="text"
            name="nationality"
            value={formData.nationality}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label>Date of Birth:</label>
          <input
            type="date"
            name="dob"
            value={formData.dob}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label>Occupation:</label>
          <select name="occupation" value={formData.occupation} onChange={handleChange} required>
            <option value="job">Job</option>
            <option value="student">Student</option>
          </select>
        </div>

        <button type="submit">Update Profile</button>
      </form>
    </div>
  );
};

export default TouristProfile;
