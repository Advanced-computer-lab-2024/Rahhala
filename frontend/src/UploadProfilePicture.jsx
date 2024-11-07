import React, { useState } from "react";
import axios from "axios";

const UploadProfilePicture = ({ userRole }) => {
  const [file, setFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState("");
  const [error, setError] = useState("");

  // Determine the upload endpoint based on the user role
  const getUploadEndpoint = () => {
    switch (userRole) {
      case "tourGuide":
        return "/api/upload-photo";
      case "advertiser":
      case "seller":
        return "/api/upload-logo";
      default:
        return "";
    }
  };

  // Handle file selection
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setUploadStatus("");
    setError("");
  };

  // Handle file upload
  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      setError("Please select a file to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("role", userRole);

    try {
      setUploadStatus("Uploading...");
      const response = await axios.post(getUploadEndpoint(), formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setUploadStatus("Upload successful!");
    } catch (error) {
      setUploadStatus("");
      setError("Upload failed. Please try again.");
    }
  };

  return (
    <div>
      <h2>Upload {userRole === "tourGuide" ? "Photo" : "Logo"}</h2>
      <form onSubmit={handleUpload}>
        <input type="file" accept="image/*" onChange={handleFileChange} />
        <button type="submit">Upload</button>
      </form>
      {uploadStatus && <p>{uploadStatus}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default UploadProfilePicture;
