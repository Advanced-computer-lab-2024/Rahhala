// RateTourGuide.jsx
import React, { useState } from 'react';
import axios from 'axios';

const RateTourGuide = () => {
  const [tourGuideEmail, setTourGuideEmail] = useState('');
  const [rating, setRating] = useState(0);
  const [comments, setComments] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/rate-tour-guide', {
        email: tourGuideEmail,
        rating,
        comments,
      });
      console.log('Rating submitted successfully:', response.data);
      // Clear form fields or show success message here
    } catch (error) {
      console.error('Error submitting rating:', error);
      // Handle error appropriately
    }
  };

  return (
    <div>
      <h2>Rate Your Tour Guide</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="tourGuideEmail">Tour Guide Email:</label>
          <input
            type="email"
            id="tourGuideEmail"
            value={tourGuideEmail}
            onChange={(e) => setTourGuideEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="rating">Rating (1-5):</label>
          <input
            type="number"
            id="rating"
            value={rating}
            min="1"
            max="5"
            onChange={(e) => setRating(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="comments">Comments:</label>
          <textarea
            id="comments"
            value={comments}
            onChange={(e) => setComments(e.target.value)}
          />
        </div>
        <button type="submit">Submit Rating</button>
      </form>
    </div>
  );
};

export default RateTourGuide;
