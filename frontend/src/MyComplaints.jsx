// MyComplaints.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";

const MyComplaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch the complaints for the logged-in tourist
    const fetchComplaints = async () => {
      try {
        const response = await axios.get("/api/complaints", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setComplaints(response.data);  // Assume response.data is an array of complaints
      } catch (err) {
        setError("Failed to fetch complaints. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchComplaints();
  }, []);

  if (loading) return <p>Loading complaints...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h2>My Complaints</h2>
      {complaints.length === 0 ? (
        <p>No complaints filed.</p>
      ) : (
        <ul>
          {complaints.map((complaint) => (
            <li key={complaint.id}>
              <h3>{complaint.title}</h3>
              <p>Date Filed: {new Date(complaint.date).toLocaleDateString()}</p>
              <p>Status: {complaint.status}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MyComplaints;
