// ItineraryManagement.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

const ItineraryManagement = () => {
  const [itineraries, setItineraries] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    // Fetch itineraries for the logged-in tour guide
    axios.get("/api/tour-guide/itineraries")
      .then((response) => {
        setItineraries(response.data.itineraries);
      })
      .catch((error) => {
        console.error("Error fetching itineraries:", error);
        setErrorMessage("Could not load itineraries.");
      });
  }, []);

  const toggleItineraryStatus = (itineraryId, isActive) => {
    const newStatus = !isActive; // Toggle the current status
    const endpoint = newStatus ? "/api/tour-guide/itineraries/activate" : "/api/tour-guide/itineraries/deactivate";

    axios.post(endpoint, { itineraryId })
      .then((response) => {
        // Update state with new status
        setItineraries((prevItineraries) =>
          prevItineraries.map((itinerary) =>
            itinerary.id === itineraryId ? { ...itinerary, isActive: newStatus } : itinerary
          )
        );
      })
      .catch((error) => {
        console.error("Error updating itinerary status:", error);
        setErrorMessage("Could not update itinerary status.");
      });
  };

  return (
    <div>
      <h1>Manage Itineraries</h1>
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
      <ul>
        {itineraries.map((itinerary) => (
          <li key={itinerary.id}>
            <span>{itinerary.name} - {itinerary.isActive ? "Active" : "Inactive"}</span>
            <button onClick={() => toggleItineraryStatus(itinerary.id, itinerary.isActive)}>
              {itinerary.isActive ? "Deactivate" : "Activate"}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ItineraryManagement;
