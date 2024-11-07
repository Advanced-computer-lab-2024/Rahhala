// FileComplaint.jsx
import React, { useState } from 'react';
import axios from 'axios';

const FileComplaint = () => {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]); // Default to today's date
  const [message, setMessage] = useState('');

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('/api/tourist/complaint', {
        title,
        body,
        date,
      });

      if (response.data.success) {
        setMessage('Complaint filed successfully!');
        // Reset form fields
        setTitle('');
        setBody('');
        setDate(new Date().toISOString().split('T')[0]);
      } else {
        setMessage('Failed to file complaint. Please try again later.');
      }
    } catch (error) {
      console.error('Error filing complaint:', error);
      setMessage('An error occurred while filing the complaint.');
    }
  };

  return (
    <div>
      <h2>File a Complaint</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Title:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter complaint title"
            required
          />
        </div>
        <div>
          <label>Problem Description:</label>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Describe the issue"
            required
          />
        </div>
        <div>
          <label>Date:</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>
        <button type="submit">Submit Complaint</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default FileComplaint;
