// RateAndCommentEventActivity.jsx
import React, { useState } from 'react';
import axios from 'axios';

const RateAndCommentEventActivity = () => {
  const [eventId, setEventId] = useState('');
  const [rating, setRating] = useState('');
  const [comment, setComment] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/rate-event-activity', {
        eventId,
        rating,
        comment,
      });
      console.log('Rating and comment submitted successfully:', response.data);
      // Clear form fields or show success message here
      setEventId(''); // Clear eventId input after submission
      setRating(''); // Clear rating input after submission
      setComment(''); // Clear comment input after submission
    } catch (error) {
      console.error('Error submitting rating and comment:', error);
      // Handle error appropriately
    }
  };

  return (
    <div>
      <h2>Rate and Comment on Event/Activity</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="eventId">Event ID:</label>
          <input
            type="text"
            id="eventId"
            value={eventId}
            onChange={(e) => setEventId(e.target.value)}
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

export default RateAndCommentEventActivity;
