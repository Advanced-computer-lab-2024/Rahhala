// BookingActivity.jsx
import React, { useState } from 'react';
import axios from 'axios';

const BookingActivity = () => {
  const [eventId, setEventId] = useState('');
  const [bookingDetails, setBookingDetails] = useState(null);

  const handleBook = async () => {
    try {
      const response = await axios.post('/api/book-event', { eventId });
      setBookingDetails(response.data); // Assuming response contains booking details
      console.log('Booking successful:', response.data);
    } catch (error) {
      console.error('Error booking the event:', error);
      // Handle error appropriately
    }
  };

  const handleCancel = async () => {
    try {
      const response = await axios.post('/api/cancel-booking', { eventId });
      setBookingDetails(null); // Clear booking details after cancellation
      console.log('Cancellation successful:', response.data);
    } catch (error) {
      console.error('Error canceling the booking:', error);
      // Handle error appropriately
    }
  };

  return (
    <div>
      <h2>Book or Cancel Activity/Event</h2>
      <div>
        <label htmlFor="eventId">Event/Activity ID:</label>
        <input
          type="text"
          id="eventId"
          value={eventId}
          onChange={(e) => setEventId(e.target.value)}
          required
        />
      </div>
      <button onClick={handleBook}>Book Ticket</button>
      <button onClick={handleCancel}>Cancel Booking</button>

      {bookingDetails && (
        <div>
          <h3>Booking Details:</h3>
          <pre>{JSON.stringify(bookingDetails, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default BookingActivity;
