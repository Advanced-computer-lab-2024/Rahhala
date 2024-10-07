import productModel from "../models/product.model.js";
import mongoose from "mongoose";

// Create a product
const addProduct = async (req, res) => {
    const id = req.user.id;
    const { name, price, picture } = req.body;
  try {
    const product = await productModel.create({picture, price, name, sellerName: id});
    console.log("here")

    res.status(201).send("product added successfully");
  } catch (error) {
    res.status(400).send("error adding product");
  }
};

// View all products
const viewProducts = async (req, res) => {
  try {
    const products = await productModel.find({});
    res.status(200).send(products);
  } catch (error) {
    res.status(500).send("error fetching products");
  }
};

// Sort products by ratings
const sortProductsByRatings = async (req, res) => {
  try {
    const products = await productModel.find({}).sort({ ratings: -1 });
    res.status(200).send(products);
  } catch (error) {
    res.status(500).send(error);
  }
};
// Filter products by price
const filterProductsByPrice = async (req, res) => {
  const minPrice = req.query.minPrice || 0;
  const maxPrice = req.query.maxPrice || 1000000;
  try {
    const products = await productModel.find({
      price: { $gte: minPrice, $lte: maxPrice },
    });
    if (!products) {
      return res.status(404).send("No products found");
    }
    res.status(200).send("products filtered successfully");
  } catch (error) {
    res.status(500).send("error filtering products");
  }
};

// Search for a product by name
const searchProductByName = async (req, res) => {
  const productName = req.query.name;
  try {
    const products = await productModel.find({ name: productName });
    if (!products) {
      return res.status(404).send("Product not found");
    }
    res.status(200).send("products found successfully");
  } catch (error) {
    res.status(500).send("error fetching products");
  }
};

// Edit product description and price
const editProduct = async (req, res) => {
  const { productId } = req.params;
  const { description, price } = req.body;
  if (!mongoose.Types.ObjectId.isValid(productId)) {
    return res.status(400).json({ error: "Invalid product ID format" });
  }
  try {
    if (!description || !price) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    const product = await productModel.findByIdAndUpdate(
      productId,
      { description, price },
      { new: true }
    );
    res.status(200).send("product updated successfully");
  } catch (error) {
    res.status(500).send("error updating product");
  }
};

const productController = {
  addProduct,
  viewProducts,
  sortProductsByRatings,
  filterProductsByPrice,
  searchProductByName,
  editProduct,
};

export default productController;
