import express from "express";
import { verifyToken } from "../middleware/auth.js";
import {
  addMuseum,
  getMuseums,
  getMuseumsByUserID,
  editMuseum,
  deleteMuseum,
  editMuseumByName,
  deleteMuseumByName,
  getMuseumById
} from "../controllers/museum.controller.js";

const router = express.Router();

// Define routes
router.post("/", verifyToken, addMuseum);
router.get("/", getMuseums);
router.get("/", getMuseumsByUserID);
router.put("/:id", editMuseum);
router.delete("/:id", deleteMuseum);
router.put("/:name", editMuseumByName);
router.delete("/:name", deleteMuseumByName);
router.get("/:id", getMuseumById);
router.get('/booked/:userId', async (req, res) => {
  try {
      const bookedMuseums = await museumModel.find({ userId: req.params.userId, bookings: { $elemMatch: { status: 'paid' } } });
      res.status(200).json(bookedMuseums);
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
});
export default router;
