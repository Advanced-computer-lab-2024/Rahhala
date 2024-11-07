// frontend/src/AdvertiserProfileForm.jsx
import React, { useState } from "react";
import axios from "axios";

const AdvertiserProfileForm = () => {
  const [formData, setFormData] = useState({
    email: "",
    mobileNumber: "",
    website: "",
    hotline: "",
    companyProfile: "",
  });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put("http://localhost:5000/advertiser-profile", formData);
      setMessage(response.data.message);
    } catch (error) {
      setMessage("Error updating profile");
      console.error("Error updating profile:", error);
    }
  };

  return (
    <div>
      <h2>Create or Update Advertiser Profile</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
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
          <label>Website:</label>
          <input
            type="url"
            name="website"
            value={formData.website}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Hotline:</label>
          <input
            type="text"
            name="hotline"
            value={formData.hotline}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Company Profile:</label>
          <textarea
            name="companyProfile"
            value={formData.companyProfile}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit">Submit</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default AdvertiserProfileForm;