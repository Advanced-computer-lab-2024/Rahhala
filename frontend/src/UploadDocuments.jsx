// UploadDocuments.jsx
import React, { useState } from "react";
import axios from "axios"; // Import axios for API requests

const UploadDocuments = () => {
  const [role, setRole] = useState("");
  const [idFile, setIdFile] = useState(null);
  const [additionalFile, setAdditionalFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState(null); // Status message for user feedback

  const handleFileChange = (e, setFile) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!role || !idFile) {
      alert("Please select a role and upload all required documents.");
      return;
    }

    const formData = new FormData();
    formData.append("role", role);
    formData.append("idFile", idFile);

    if (additionalFile) {
      formData.append("additionalFile", additionalFile);
    }

    try {
      const response = await axios.post("/api/documents/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 200) {
        setUploadStatus("Documents uploaded successfully!");
      } else {
        setUploadStatus("Failed to upload documents. Please try again.");
      }
    } catch (error) {
      console.error("Error uploading documents:", error);
      setUploadStatus("An error occurred. Please try again later.");
    }
  };

  return (
    <div>
      <h2>Upload Required Documents</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Select Role:
          <select value={role} onChange={(e) => setRole(e.target.value)} required>
            <option value="">Choose role</option>
            <option value="tourGuide">Tour Guide</option>
            <option value="advertiser">Advertiser</option>
            <option value="seller">Seller</option>
          </select>
        </label>

        <label>
          Upload ID Document:
          <input type="file" onChange={(e) => handleFileChange(e, setIdFile)} required />
        </label>

        {role === "tourGuide" && (
          <label>
            Upload Certificate:
            <input type="file" onChange={(e) => handleFileChange(e, setAdditionalFile)} />
          </label>
        )}

        {role !== "tourGuide" && (
          <label>
            Upload Taxation Registry Card:
            <input type="file" onChange={(e) => handleFileChange(e, setAdditionalFile)} />
          </label>
        )}

        <button type="submit">Upload Documents</button>
      </form>
      {uploadStatus && <p>{uploadStatus}</p>} {/* Display upload status to user */}
    </div>
  );
};

export default UploadDocuments;
