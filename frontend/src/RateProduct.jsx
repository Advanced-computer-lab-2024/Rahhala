// RateProduct.jsx
import React, { useState } from 'react';
import axios from 'axios';

const RateProduct = ({ productId }) => {
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');
  const [message, setMessage] = useState('');

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`/api/tourist/rate-product`, {
        productId,
        rating,
        review,
      });

      if (response.data.success) {
        setMessage('Rating submitted successfully!');
        // Reset form fields
        setRating(0);
        setReview('');
      } else {
        setMessage('Failed to submit rating. Please try again later.');
      }
    } catch (error) {
      console.error('Error submitting rating:', error);
      setMessage('An error occurred while submitting your rating.');
    }
  };

  return (
    <div>
      <h2>Rate Product</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Rating:</label>
          <select value={rating} onChange={(e) => setRating(parseInt(e.target.value))} required>
            <option value={0} disabled>Select a rating</option>
            {[1, 2, 3, 4, 5].map((value) => (
              <option key={value} value={value}>
                {value} Star{value > 1 && 's'}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label>Review (optional):</label>
          <textarea
            value={review}
            onChange={(e) => setReview(e.target.value)}
            placeholder="Leave a review"
          />
        </div>
        <button type="submit">Submit Rating</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default RateProduct;
