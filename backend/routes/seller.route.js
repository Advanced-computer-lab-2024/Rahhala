import express from "express";
import { verifyToken } from "../middleware/auth.js";
import { editSeller, getSeller } from "../controllers/seller.controller.js";

const router = express.Router();

router.put("/", verifyToken, editSeller);
router.get("/", verifyToken, getSeller);

export default router;
