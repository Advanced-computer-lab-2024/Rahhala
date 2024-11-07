// AdminReplyToComplaint.jsx
import React, { useState } from "react";
import axios from "axios";

const AdminReplyToComplaint = ({ complaintId }) => {
  const [reply, setReply] = useState("");

  const handleReplySubmit = async () => {
    try {
      await axios.post(`/api/admin/complaints/${complaintId}/reply`, { reply });
      alert("Reply sent successfully.");
      setReply(""); // Reset reply after sending
    } catch (error) {
      console.error("Error sending reply:", error);
      alert("Failed to send reply.");
    }
  };

  return (
    <div>
      <h2>Reply to Complaint</h2>
      <textarea
        value={reply}
        onChange={(e) => setReply(e.target.value)}
        placeholder="Enter your reply here..."
      ></textarea>
      <button onClick={handleReplySubmit}>Send Reply</button>
    </div>
  );
};

export default AdminReplyToComplaint;
