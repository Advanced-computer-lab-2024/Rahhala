// frontend/src/TourGuideProfileForm.jsx
import React, { useState } from "react";
import axios from "axios";

const TourGuideProfileForm = () => {
  const [formData, setFormData] = useState({
    email: "",
    mobileNumber: "",
    yearsOfExperience: "",
    previousWork: "",
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
      const response = await axios.put("http://localhost:5000/profile", formData);
      setMessage(response.data.message);
    } catch (error) {
      setMessage("Error updating profile");
      console.error("Error updating profile:", error);
    }
  };

  return (
    <div>
      <h2>Create or Update Tour Guide Profile</h2>
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
          <label>Years of Experience:</label>
          <input
            type="number"
            name="yearsOfExperience"
            value={formData.yearsOfExperience}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Previous Work:</label>
          <textarea
            name="previousWork"
            value={formData.previousWork}
            onChange={handleChange}
          />
        </div>
        <button type="submit">Submit</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default TourGuideProfileForm;
