import React, { useState } from "react";
import axios from "axios";

const ReviewProduct = ({ productId }) => {
  const [review, setReview] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleReviewSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`/api/reviews/product/${productId}`, {
        review,
      });
      if (response.status === 201) {
        setSuccess("Review submitted successfully!");
        setReview("");
      }
    } catch (err) {
      setError("Error submitting review. Please try again.");
    }
  };

  return (
    <div>
      <h3>Write a Review for Product</h3>
      <form onSubmit={handleReviewSubmit}>
        <textarea
          value={review}
          onChange={(e) => setReview(e.target.value)}
          placeholder="Write your review here..."
          required
        />
        <button type="submit">Submit Review</button>
      </form>
      {success && <p style={{ color: "green" }}>{success}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default ReviewProduct;
