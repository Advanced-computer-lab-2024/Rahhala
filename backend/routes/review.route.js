import express from "express";
import { verifyToken } from "../middleware/auth.js";
import {

addReview,
getReviews,
editReview,
deleteReview,
getReviewsByTouristID,
getReviewById,
getReviewsByEntity
} from "../controllers/review.controller.js";

const router = express.Router();

router.post("/", verifyToken, addReview);
router.get("/", getReviews);
router.put("/:id", verifyToken, editReview);
router.delete("/:id", verifyToken, deleteReview);
router.get("/tourist", verifyToken, getReviewsByTouristID);
router.get("/:id", getReviewById);
router.get("/entity/:entityType/:entityId", getReviewsByEntity);


export default router;