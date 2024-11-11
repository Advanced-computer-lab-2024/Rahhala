import React, { useState } from 'react';
import axios from 'axios';

const AcceptTerms = () => {
  const [accepted, setAccepted] = useState(false);
  const [message, setMessage] = useState('');

  const handleAcceptTerms = async () => {
    try {
      const response = await axios.post(
        '/api/advertiser/accept-terms',
        {},
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      setMessage(response.data.message);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Error accepting terms');
    }
  };

  return (
    <div>
      <input type="checkbox" checked={accepted} onChange={() => setAccepted(!accepted)} /> I accept the terms and conditions
      <button onClick={handleAcceptTerms} disabled={!accepted}>Submit</button>
      <p>{message}</p>
    </div>
  );
};

export default AcceptTerms;
