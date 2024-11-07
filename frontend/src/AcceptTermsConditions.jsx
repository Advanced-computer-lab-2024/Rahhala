// AcceptTermsConditions.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AcceptTermsConditions = ({ userRole }) => {
  const [termsAccepted, setTermsAccepted] = useState(false);
  const navigate = useNavigate();

  const handleAcceptTerms = () => {
    axios.post(`/api/${userRole}/accept-terms`, { accepted: true })
      .then((response) => {
        // Navigate to the appropriate profile page or dashboard
        navigate(`/${userRole}-profile`);
      })
      .catch((error) => {
        console.error("Error accepting terms:", error);
      });
  };

  return (
    <div>
      <h1>Terms and Conditions</h1>
      <p>Please read and accept the terms and conditions to proceed.</p>
      <div>
        {/* Example terms and conditions content */}
        <p>1. You agree to comply with all applicable laws.</p>
        <p>2. You are responsible for the content you publish.</p>
        {/* Additional terms and conditions here... */}
      </div>
      <div>
        <button onClick={handleAcceptTerms} disabled={termsAccepted}>
          Accept Terms and Conditions
        </button>
      </div>
    </div>
  );
};

export default AcceptTermsConditions;