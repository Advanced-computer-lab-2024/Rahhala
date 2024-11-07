// product.route.js
import express from "express";
import { verifyToken } from "../middleware/auth.js";
import {
  viewProductsQuantitiesAndSales,
  getProducts,
  sortProductsByRatings,
  filterProductsByPrice,
  searchProductByName,
  editProduct,
  createProduct,  
} from "../controllers/product.controller.js";

const router = express.Router();

// Define routes
router.get("/quantities-sales", verifyToken, viewProductsQuantitiesAndSales); // Route to view product quantities and sales
router.get("/", getProducts); // Route to get all products
router.post("/create", verifyToken, createProduct); // Route to create a new product

export default router;

