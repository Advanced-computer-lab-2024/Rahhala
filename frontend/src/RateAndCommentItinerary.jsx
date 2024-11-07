// RateAndCommentItinerary.jsx
import React, { useState } from 'react';
import axios from 'axios';

const RateAndCommentItinerary = () => {
  const [itineraryId, setItineraryId] = useState('');
  const [rating, setRating] = useState('');
  const [comment, setComment] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/rate-itinerary', {
        itineraryId,
        rating,
        comment,
      });
      console.log('Rating and comment submitted successfully:', response.data);
      // Clear form fields or show success message here
      setItineraryId(''); // Clear itineraryId input after submission
      setRating(''); // Clear rating input after submission
      setComment(''); // Clear comment input after submission
    } catch (error) {
      console.error('Error submitting rating and comment:', error);
      // Handle error appropriately
    }
  };

  return (
    <div>
      <h2>Rate and Comment on Itinerary</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="itineraryId">Itinerary ID:</label>
          <input
            type="text"
            id="itineraryId"
            value={itineraryId}
            onChange={(e) => setItineraryId(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="rating">Rating (1 to 5):</label>
          <input
            type="number"
            id="rating"
            value={rating}
            onChange={(e) => setRating(e.target.value)}
            min="1"
            max="5"
            required
          />
        </div>
        <div>
          <label htmlFor="comment">Comment:</label>
          <textarea
            id="comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            required
          />
        </div>
        <button type="submit">Submit Rating and Comment</button>
      </form>
    </div>
  );
};

export default RateAndCommentItinerary;
