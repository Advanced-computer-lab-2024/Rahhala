// frontend/src/TourGuideProfileView.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const TourGuideProfileView = () => {
  const { email } = useParams();
  const [profile, setProfile] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/profile/${email}`);
        setProfile(response.data.profile);
      } catch (error) {
        setMessage("Error fetching profile");
        console.error("Error fetching profile:", error);
      }
    };

    fetchProfile();
  }, [email]);

  return (
    <div>
      <h2>Tour Guide Profile</h2>
      {profile ? (
        <div>
          <p><strong>Email:</strong> {profile.email}</p>
          <p><strong>Mobile Number:</strong> {profile.mobileNumber}</p>
          <p><strong>Years of Experience:</strong> {profile.yearsOfExperience}</p>
          <p><strong>Previous Work:</strong> {profile.previousWork?.join(", ")}</p>
        </div>
      ) : (
        <p>{message || "Loading profile..."}</p>
      )}
    </div>
  );
};

export default TourGuideProfileView;
