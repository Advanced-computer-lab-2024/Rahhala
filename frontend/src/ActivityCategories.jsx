// ActivityCategories.jsx
import React, { useState } from "react";
import axios from "axios";

const ActivityCategories = () => {
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const categories = [
    "Adventure",
    "Cultural",
    "Culinary",
    "Wellness",
    "Nature",
    "Family",
    "Nightlife",
    "Shopping",
  ];

  const handleChange = (event) => {
    const { value, checked } = event.target;

    if (checked) {
      setSelectedCategories((prev) => [...prev, value]);
    } else {
      setSelectedCategories((prev) => prev.filter((category) => category !== value));
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // Send selected categories to the backend
    axios.post("/api/activity-categories", { categories: selectedCategories })
      .then((response) => {
        setSuccessMessage("Categories selected successfully!");
        setErrorMessage("");
      })
      .catch((error) => {
        console.error("Error selecting categories:", error);
        setErrorMessage("Could not select categories.");
        setSuccessMessage("");
      });
  };

  return (
    <div>
      <h1>Select Activity Categories</h1>
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
      {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
      <form onSubmit={handleSubmit}>
        {categories.map((category) => (
          <div key={category}>
            <label>
              <input
                type="checkbox"
                value={category}
                checked={selectedCategories.includes(category)}
                onChange={handleChange}
              />
              {category}
            </label>
          </div>
        ))}
        <button type="submit">Save Categories</button>
      </form>
    </div>
  );
};

export default ActivityCategories;