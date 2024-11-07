// ProductImageUpload.jsx
import React, { useState } from "react";
import axios from "axios";

const ProductImageUpload = ({ productId }) => {
  const [imageFile, setImageFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState("");

  const handleFileChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!imageFile) {
      alert("Please select an image to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("image", imageFile);

    try {
      await axios.post(`/api/products/${productId}/upload-image`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setUploadStatus("Image uploaded successfully!");
    } catch (error) {
      setUploadStatus("Failed to upload image. Please try again.");
    }
  };

  return (
    <div>
      <h2>Upload Product Image</h2>
      <form onSubmit={handleUpload}>
        <input type="file" onChange={handleFileChange} accept="image/*" required />
        <button type="submit">Upload Image</button>
      </form>
      {uploadStatus && <p>{uploadStatus}</p>}
    </div>
  );
};

export default ProductImageUpload;
