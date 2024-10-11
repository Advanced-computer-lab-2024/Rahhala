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
} from "../controllers/museum.controller.js";

const router = express.Router();

// Define routes
router.post("/", verifyToken, addMuseum);
router.get("/", getMuseums);
router.get("/:id", getMuseumsByUserID);
router.put("/:id", editMuseum);
router.delete("/:id", deleteMuseum);
router.put("/:name", editMuseumByName);
router.delete("/:name", deleteMuseumByName);

export default router;
