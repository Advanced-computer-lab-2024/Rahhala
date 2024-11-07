// AdminReviewDocuments.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import ReviewDocumentsList from "./ReviewDocumentsList";

const AdminReviewDocuments = () => {
  const [pendingUsers, setPendingUsers] = useState([]);
  
  useEffect(() => {
    // Fetch pending registrations
    axios.get("/api/admin/pending-registrations")
      .then((response) => {
        setPendingUsers(response.data);
      })
      .catch((error) => {
        console.error("Error fetching pending registrations:", error);
      });
  }, []);
  
  const handleDecision = (userId, decision) => {
    axios.post(`/api/admin/review-registration`, { userId, decision })
      .then((response) => {
        setPendingUsers(prevState => prevState.filter(user => user.id !== userId));
      })
      .catch((error) => {
        console.error("Error updating registration status:", error);
      });
  };

  return (
    <div>
      <h1>Admin - Review Documents</h1>
      <ReviewDocumentsList users={pendingUsers} onDecision={handleDecision} />
    </div>
  );
};

export default AdminReviewDocuments;
