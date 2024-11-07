// FlagEvent.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

const FlagEvent = () => {
  const [events, setEvents] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    // Fetch all events/itineraries for the admin to review
    axios.get("/api/admin/events")
      .then((response) => {
        setEvents(response.data.events);
      })
      .catch((error) => {
        console.error("Error fetching events:", error);
        setErrorMessage("Could not load events.");
      });
  }, []);

  const flagEvent = (eventId) => {
    axios.post("/api/admin/events/flag", { eventId })
      .then((response) => {
        // Update state to remove flagged event
        setEvents((prevEvents) => prevEvents.filter(event => event.id !== eventId));
      })
      .catch((error) => {
        console.error("Error flagging event:", error);
        setErrorMessage("Could not flag event.");
      });
  };

  return (
    <div>
      <h1>Flag Event/Itinerary</h1>
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
      <ul>
        {events.map((event) => (
          <li key={event.id}>
            <span>{event.name} - {event.isFlagged ? "Flagged" : "Active"}</span>
            {!event.isFlagged && (
              <button onClick={() => flagEvent(event.id)}>Flag</button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FlagEvent;
