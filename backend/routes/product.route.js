// product.route.js
import express from "express";
import { verifyToken } from "../middleware/auth.js";
import {
  viewProductsQuantitiesAndSales,
  getActiveProducts,
  getProducts,
  filterProductsByPrice,
  searchProductByName,
  editProduct,
  createProduct,
  uploadPicture,
} from "../controllers/product.controller.js";

const router = express.Router();

// Define routes
router.get("/quantities-sales", verifyToken, viewProductsQuantitiesAndSales); // Route to view product quantities and sales
router.get("/", getProducts); // Route to get all products
router.get("/active", getActiveProducts); // Route to get all active products
router.post("/create", verifyToken, createProduct); // Route to create a new product
router.get("/filter-by-price", filterProductsByPrice); // Route to filter products by price
router.get("/search", searchProductByName); // Route to search for a product by name
router.put("/edit/:id", verifyToken, editProduct); // Route to edit a product
router.get("uploadPicture/", verifyToken, uploadPicture); // Route to upload a picture for a product
export default router;
