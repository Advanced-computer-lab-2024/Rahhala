import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom"; // For accessing URL params and navigation
import axios from "axios";

const ComplaintDetail = () => {
  const { id } = useParams(); // Get the complaint ID from the URL
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // To navigate after updating the complaint

  useEffect(() => {
    const fetchComplaintDetail = async () => {
      try {
        const response = await axios.get(`/api/complaints/${id}`);
        setComplaint(response.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to load complaint details");
        setLoading(false);
      }
    };

    fetchComplaintDetail();
  }, [id]);

  const handleStatusChange = async (status) => {
    try {
      const response = await axios.put(`/api/complaints/${id}/status`, { status });
      setComplaint(response.data.complaint); // Update the complaint status locally
      alert("Complaint status updated successfully!");
    } catch (err) {
      setError("Failed to update complaint status");
    }
  };

  if (loading) return <div>Loading complaint details...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h1>Complaint Detail</h1>
      {complaint ? (
        <div>
          <h2>{complaint.title}</h2>
          <p><strong>Problem:</strong> {complaint.body}</p>
          <p><strong>Date:</strong> {complaint.date}</p>
          <p><strong>Status:</strong> {complaint.status}</p>

          <div>
            {/* Buttons to mark complaint as Pending or Resolved */}
            <button onClick={() => handleStatusChange("pending")}>Mark as Pending</button>
            <button onClick={() => handleStatusChange("resolved")}>Mark as Resolved</button>
          </div>
        </div>
      ) : (
        <p>No complaint details found.</p>
      )}
    </div>
  );
};

export default ComplaintDetail;
