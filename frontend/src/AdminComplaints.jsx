import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const AdminComplaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [filteredComplaints, setFilteredComplaints] = useState([]); // Filtered complaints to display
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSortedAscending, setIsSortedAscending] = useState(true);
  const [filterStatus, setFilterStatus] = useState("All"); // Track selected status filter

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const response = await axios.get("/api/complaints");
        setComplaints(response.data);
        setFilteredComplaints(response.data); // Initial filter includes all complaints
        setLoading(false);
      } catch (err) {
        setError("Failed to load complaints");
        setLoading(false);
      }
    };

    fetchComplaints();
  }, []);

  // Sort complaints by date
  const handleSortByDate = () => {
    const sortedComplaints = [...filteredComplaints].sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return isSortedAscending ? dateA - dateB : dateB - dateA;
    });
    setFilteredComplaints(sortedComplaints);
    setIsSortedAscending(!isSortedAscending); // Toggle sorting order
  };

  // Filter complaints by status
  const handleFilterStatus = (status) => {
    setFilterStatus(status);
    const complaintsToDisplay = complaints.filter(
      (complaint) => status === "All" || complaint.status === status
    );
    setFilteredComplaints(complaintsToDisplay);
  };

  if (loading) return <div>Loading complaints...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h1>All Complaints</h1>

      {/* Filter and Sort Controls */}
      <div style={{ marginBottom: "10px" }}>
        <label>
          Filter by Status:
          <select value={filterStatus} onChange={(e) => handleFilterStatus(e.target.value)}>
            <option value="All">All</option>
            <option value="pending">Pending</option>
            <option value="resolved">Resolved</option>
          </select>
        </label>
        <button onClick={handleSortByDate} style={{ marginLeft: "10px" }}>
          Sort by Date {isSortedAscending ? "↓" : "↑"}
        </button>
      </div>

      {/* Complaints Table */}
      <table>
        <thead>
          <tr>
            <th>Complaint Title</th>
            <th>Problem</th>
            <th>Date</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredComplaints.map((complaint) => (
            <tr key={complaint.id}>
              <td>{complaint.title}</td>
              <td>{complaint.body}</td>
              <td>{new Date(complaint.date).toLocaleDateString()}</td>
              <td>{complaint.status}</td>
              <td>
                <Link to={`/admin/complaints/${complaint.id}`}>View Details</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminComplaints;
