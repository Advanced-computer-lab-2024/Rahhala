
import { searchFlights, searchAirportByCity, bookFlight } from "../utils/amadeus.service.js";
import express from 'express';
const router = express.Router();

router.post('/search-flights', async (req, res) => {
    const { origin, destination, departureDate } = req.body;
  
    try {
      const flightOffers = await searchFlights(origin, destination, departureDate);
      res.json(flightOffers);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  router.post('/search-airports', async (req, res) => {
    const { city } = req.body;
  
    if (!city) {
      return res.status(400).json({ message: 'City name is required' });
    }
  
    try {
      const airports = await searchAirportByCity(city);
      res.json(airports);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  router.post('/api/book-flight', async (req, res) => {
    const { flightOffer, travelerDetails } = req.body;
  
    if (!flightOffer || !travelerDetails) {
      return res.status(400).json({ message: 'Flight offer and traveler details are required' });
    }
  
    try {
      const bookingResponse = await bookFlight(flightOffer, travelerDetails);
      res.json(bookingResponse);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  export default router;