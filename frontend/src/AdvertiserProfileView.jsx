// frontend/src/AdvertiserProfileView.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const AdvertiserProfileView = () => {
  const { email } = useParams();
  const [profile, setProfile] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/advertiser-profile/${email}`);
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
      <h2>Advertiser Profile</h2>
      {profile ? (
        <div>
          <p><strong>Email:</strong> {profile.email}</p>
          <p><strong>Mobile Number:</strong> {profile.mobileNumber}</p>
          <p><strong>Website:</strong> {profile.website}</p>
          <p><strong>Hotline:</strong> {profile.hotline}</p>
          <p><strong>Company Profile:</strong> {profile.companyProfile}</p>
        </div>
      ) : (
        <p>{message || "Loading profile..."}</p>
      )}
    </div>
  );
};

export default AdvertiserProfileView;
