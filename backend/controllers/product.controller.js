import productModel from "../models/product.model.js";
import mongoose from "mongoose";

export const viewProductsQuantitiesAndSales = async (req, res) => {
  console.log("entered viewProductsQuantitiesAndSales");

  const { id: userId, userType } = req.user; // Get user ID and role from the token
  console.log("userId: ", userId);
  console.log("userType: ", userType);
  try {
    let products;

    if (userType === "admin") {
      // Admin can view quantities and sales for all products
      products = await productModel.find({}).select("name quantity sales");
    } else if (userType === "seller") {
      // Sellers can view only their own products' quantities and sales
      products = await productModel
        .find({ sellerName: userId })
        .select("name quantity sales");
    } else {
      return res.status(403).send("Unauthorized access");
    }

    if (!products || products.length === 0) {
      return res.status(404).send("No products found");
    }

    res.status(200).send(products); // Return the products with their quantities and sales
  } catch (error) {
    console.error(error);
    res.status(500).send("Error fetching product quantities and sales");
  }
};

// Create a new product
export const createProduct = async (req, res) => {
  console.log("entered createProduct");
  const id = req.user.id;
  console.log("id: ", id); // Debugging

  const { description, price, name, quantity, averageRating, picture } =
    req.body;
  console.log("req.body: ", req.body); // Debugging

  // Validate required fields
  if (!price || !quantity || !description || !picture) {
    return res
      .status(400)
      .send("Missing required fields: name, price, quantity, and sellerName.");
  }

  try {
    // Create a new product document
    const newProduct = new productModel({
      sellerId: id,
      name,
      picture,
      price,
      description,
      quantity,
      sales: 0, // Set sales to 0 by default
      averageRating: averageRating || 0, // Default to 0 if not provided
    });

    // Save the product to the database
    await newProduct.save();

    res.status(201).send("Product created successfully");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error creating product");
  }
};

//Get all products that are not archived
export const getActiveProducts = async (req, res) => {
  console.log("entered getActiveProducts");

  try {
    const products = await productModel.find({ isArchived: false });
    res.status(200).send(products);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error fetching products");
  }
};

// Get all products from the database
export const getProducts = async (req, res) => {

  try {
    const products = await productModel.find({});
    res.status(200).send(products);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error fetching products");
  }
};

// Sort products by ratings
export const sortProductsByRatings = async (req, res) => {
  console.log("entered sortProductsByRatings");

  try {
    const products = await productModel.find({}).sort({ averageRating: -1 }); // Sort by averageRating
    res.status(200).send(products);
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
};

// Filter products by price
export const filterProductsByPrice = async (req, res) => {
  console.log("entered filterProductsByPrice");

  const minPrice = req.query.minPrice || 0;
  const maxPrice = req.query.maxPrice || 1000000;
  try {
    const products = await productModel.find({
      price: { $gte: minPrice, $lte: maxPrice },
    });
    if (!products || products.length === 0) {
      return res.status(404).send("No products found");
    }
    res.status(200).send(products); // Return the filtered products
  } catch (error) {
    console.error(error);
    res.status(500).send("Error filtering products");
  }
};

// Search for a product by name
export const searchProductByName = async (req, res) => {
  console.log("entered searchProductByName");

  const productName = req.query.name;
  try {
    const products = await productModel.find({ name: productName });
    if (!products || products.length === 0) {
      return res.status(404).send("Product not found");
    }
    res.status(200).send(products); // Return the found products
  } catch (error) {
    console.error(error);
    res.status(500).send("Error fetching products");
  }
};

// Edit product description, price, quantity
export const editProduct = async (req, res) => {
  console.log("entered editProduct");

  const { productId } = req.params;
  const { description, price, quantity } = req.body; // Include quantity in the request body
  if (!mongoose.Types.ObjectId.isValid(productId)) {
    return res.status(400).json({ error: "Invalid product ID format" });
  }
  try {
    const updateFields = {};
    if (description) updateFields.description = description;
    if (price) updateFields.price = price;
    if (quantity !== undefined) updateFields.quantity = quantity; // Update quantity if provided

    const product = await productModel.findByIdAndUpdate(
      productId,
      updateFields,
      { new: true }
    );
    res.status(200).send("Product updated successfully");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error updating product");
  }
};

//upload picture
export const uploadPicture = async (req, res) => {
  console.log("entered uploadPicture");

  const { id: productId } = req.params;
  const { picture } = req.body;
  if (!mongoose.Types.ObjectId.isValid(productId)) {
    return res.status(400).json({ error: "Invalid product ID format" });
  }
  try {
    const product = await productModel.findByIdAndUpdate(
      productId,
      { picture },
      { new: true }
    );
    res.status(200).send("Picture uploaded successfully");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error uploading picture");
  }
};

// Archive a product
export const archiveProduct = async (req, res) => {
  console.log("entered archiveProduct");

  const { id: productId } = req.params;
  console.log("productId: ", productId);
  if (!mongoose.Types.ObjectId.isValid(productId)) {
    return res.status(400).json({ error: "Invalid product ID format" });
  }
  try {
    const product = await productModel.findByIdAndUpdate(
      productId,
      { isArchived: true },
      { new: true }
    );
    res.status(200).send("Product archived successfully");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error archiving product");
  }
};

// Unarchive a product
export const unarchiveProduct = async (req, res) => {
  console.log("entered unarchiveProduct");

  const { id: productId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(productId)) {
    return res.status(400).json({ error: "Invalid product ID format" });
  }
  try {
    const product = await productModel.findByIdAndUpdate(
      productId,
      { isArchived: false },
      { new: true }
    );
    res.status(200).send("Product unarchived successfully");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error unarchiving product");
  }
};
