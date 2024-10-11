import express from "express";
import { addGovernor } from "../controllers/governor.controller.js";

const router = express.Router();

router.post("/", addGovernor);

export default router;
