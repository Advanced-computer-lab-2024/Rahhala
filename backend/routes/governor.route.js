import express from "express";
import { verifyToken } from "../middleware/auth.js";
import { 
    addGovernor,
    changePassword,
 } from "../controllers/governor.controller.js";

const router = express.Router();

router.post("/", addGovernor);
router.put("/changePassword", verifyToken, changePassword);
export default router;
