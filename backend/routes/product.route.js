import express from "express";
import { verifyToken } from "../middleware/auth.js";
import {
  addProduct,
  getProducts,
  sortProductsByRatings,
  filterProductsByPrice,
  searchProductByName,
  editProduct,
} from "../controllers/product.controller.js";

const router = express.Router();

// Define routes
router.post("/", addProduct);
router.get("/", getProducts);
router.get("/sort", sortProductsByRatings);
router.get("/filter", filterProductsByPrice);
router.get("/search", searchProductByName);
router.put("/", editProduct);

export default router;
