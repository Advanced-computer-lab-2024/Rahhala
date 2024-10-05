import React, { useState } from "react";
import axios from "axios";

const RegistrationForm = () => {
  const [userType, setUserType] = useState("tourist"); // Toggle between tourist and professional
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: "",
    mobileNumber: "",
    nationality: "",
    dob: "",
    occupation: "job",
    role: "tour_guide",
  });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleTouristSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/register", formData);
      setMessage(response.data.message);
    } catch (error) {
      setMessage("Error registering tourist: " + error.response.data.error);
      console.error("Tourist registration error:", error);
    }
  };

  const handleRoleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/register-role", {
        email: formData.email,
        username: formData.username,
        password: formData.password,
        role: formData.role,
      });
      setMessage(response.data.message);
    } catch (error) {
      setMessage("Error registering professional: " + error.response.data.error);
      console.error("Professional registration error:", error);
    }
  };

  return (
    <div>
      <h2>Register as a Tourist or Professional</h2>
      <div>
        <label>
          <input
            type="radio"
            name="userType"
            value="tourist"
            checked={userType === "tourist"}
            onChange={() => setUserType("tourist")}
          />
          Register as Tourist
        </label>
        <label>
          <input
            type="radio"
            name="userType"
            value="professional"
            checked={userType === "professional"}
            onChange={() => setUserType("professional")}
          />
          Register as Professional (Tour Guide, Advertiser, Seller)
        </label>
      </div>

      {userType === "tourist" && (
        <form onSubmit={handleTouristSubmit}>
          <h2>Tourist Registration</h2>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="mobileNumber"
            placeholder="Mobile Number"
            value={formData.mobileNumber}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="nationality"
            placeholder="Nationality"
            value={formData.nationality}
            onChange={handleChange}
            required
          />
          <input
            type="date"
            name="dob"
            placeholder="Date of Birth"
            value={formData.dob}
            onChange={handleChange}
            required
          />
          <select name="occupation" value={formData.occupation} onChange={handleChange} required>
            <option value="job">Job</option>
            <option value="student">Student</option>
          </select>
          <button type="submit">Register as Tourist</button>
        </form>
      )}

      {userType === "professional" && (
        <form onSubmit={handleRoleSubmit}>
          <h2>Professional Registration</h2>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <select name="role" value={formData.role} onChange={handleChange} required>
            <option value="tour_guide">Tour Guide</option>
            <option value="advertiser">Advertiser</option>
            <option value="seller">Seller</option>
          </select>
          <button type="submit">Register as Professional</button>
        </form>
      )}

      {message && <p>{message}</p>}
    </div>
  );
};

export default RegistrationForm;
