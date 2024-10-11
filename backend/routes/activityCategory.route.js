import express from "express";
import {
  addCategory,
  getCategories,
  editCategory,
  deleteCategory,
} from "../controllers/activityCategory.controller.js";

const router = express.Router();

// Define routes
router.get("/", getCategories);
router.post("/", addCategory);
router.put("/:id", editCategory);
router.delete("/:id", deleteCategory);

export default router;
