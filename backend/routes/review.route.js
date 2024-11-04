import express from "express";
import { verifyToken } from "../middleware/auth.js";
import {
    addReview,
} from "../controllers/review.controller.js";

const router = express.Router();

router.post("/", verifyToken, addReview);

export default router;
