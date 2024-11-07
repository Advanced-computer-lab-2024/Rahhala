// DeleteAccountRequest.jsx
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const DeleteAccountRequest = ({ userRole }) => {
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleDeleteAccount = () => {
    axios.post(`/api/${userRole}/delete-account-request`)
      .then((response) => {
        if (response.data.success) {
          // Optionally redirect to a confirmation page or logout
          navigate("/");
        } else {
          setErrorMessage(response.data.message || "Account deletion failed.");
        }
      })
      .catch((error) => {
        console.error("Error requesting account deletion:", error);
        setErrorMessage("An error occurred while requesting account deletion.");
      });
  };

  return (
    <div>
      <h1>Request Account Deletion</h1>
      <p>
        Please note that your account will be deleted only if you have no upcoming events, activities, or itineraries with bookings that are paid for.
      </p>
      <button onClick={handleDeleteAccount}>Request Account Deletion</button>
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
    </div>
  );
};

export default DeleteAccountRequest;
