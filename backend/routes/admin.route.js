import express from "express";
import { addAdmin, deleteEntity } from "../controllers/admin.controller.js";

const router = express.Router();

router.post("/", addAdmin);
router.delete("/", deleteEntity);

export default router;
