import express from "express";
import { searchHotels, bookHotel } from "../utils/amadeus.service.js";
const router = express.Router();

router.post("/search-hotels", async (req, res) => {
  const { cityCode, checkInDate, checkOutDate, adults, rooms } = req.body;

  try {
    const hotelOffers = await searchHotels(
      cityCode || "NYC",
      checkInDate || "2024-12-11",
      checkOutDate || "2022-12-12",
      adults || 1,
      rooms || 1
    );
    res.json(hotelOffers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/book-hotel", async (req, res) => {
  const { hotelOffer, guests, paymentDetails } = req.body;

  if (!hotelOffer || !guests || !paymentDetails) {
    return res.status(400).json({
      message: "Hotel offer, guests, and payment details are required",
    });
  }

  try {
    const bookingResponse = await bookHotel(hotelOffer, guests, paymentDetails);
    res.json(bookingResponse);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
