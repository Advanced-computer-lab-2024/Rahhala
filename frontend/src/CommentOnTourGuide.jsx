// CommentOnTourGuide.jsx
import React, { useState } from 'react';
import axios from 'axios';

const CommentOnTourGuide = () => {
  const [tourGuideEmail, setTourGuideEmail] = useState('');
  const [comment, setComment] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/comment-tour-guide', {
        email: tourGuideEmail,
        comment,
      });
      console.log('Comment submitted successfully:', response.data);
      // Clear form fields or show success message here
      setComment(''); // Clear comment input after submission
    } catch (error) {
      console.error('Error submitting comment:', error);
      // Handle error appropriately
    }
  };

  return (
    <div>
      <h2>Comment on Your Tour Guide</h2>
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
          <label htmlFor="comment">Comment:</label>
          <textarea
            id="comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            required
          />
        </div>
        <button type="submit">Submit Comment</button>
      </form>
    </div>
  );
};

export default CommentOnTourGuide;
