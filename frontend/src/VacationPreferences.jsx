// VacationPreferences.jsx
import React, { useState } from "react";
import axios from "axios";

const VacationPreferences = () => {
  const [preferences, setPreferences] = useState({
    historicAreas: false,
    beaches: false,
    familyFriendly: false,
    shopping: false,
    budget: ''
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setPreferences((prevPreferences) => ({
      ...prevPreferences,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // Send preferences to the backend
    axios.post("/api/preferences", preferences)
      .then((response) => {
        setSuccessMessage("Preferences saved successfully!");
        setErrorMessage("");
      })
      .catch((error) => {
        console.error("Error saving preferences:", error);
        setErrorMessage("Could not save preferences.");
        setSuccessMessage("");
      });
  };

  return (
    <div>
      <h1>Select Your Vacation Preferences</h1>
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
      {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            <input
              type="checkbox"
              name="historicAreas"
              checked={preferences.historicAreas}
              onChange={handleChange}
            />
            Historic Areas
          </label>
        </div>
        <div>
          <label>
            <input
              type="checkbox"
              name="beaches"
              checked={preferences.beaches}
              onChange={handleChange}
            />
            Beaches
          </label>
        </div>
        <div>
          <label>
            <input
              type="checkbox"
              name="familyFriendly"
              checked={preferences.familyFriendly}
              onChange={handleChange}
            />
            Family-Friendly
          </label>
        </div>
        <div>
          <label>
            <input
              type="checkbox"
              name="shopping"
              checked={preferences.shopping}
              onChange={handleChange}
            />
            Shopping
          </label>
        </div>
        <div>
          <label>
            Budget:
            <input
              type="text"
              name="budget"
              value={preferences.budget}
              onChange={handleChange}
            />
          </label>
        </div>
        <button type="submit">Save Preferences</button>
      </form>
    </div>
  );
};

export default VacationPreferences;
