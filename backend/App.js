import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import activityRoutes from "./routes/activity.route.js";
import activityCategoryRoutes from "./routes/activityCategory.route.js";
import adminRoutes from "./routes/admin.route.js";
import advertiserRoutes from "./routes/advertiser.route.js";
import authRoutes from "./routes/auth.route.js";
import governorRoutes from "./routes/governor.route.js";
import itineraryRoutes from "./routes/itinerary.route.js";
import museumRoutes from "./routes/museum.route.js";
import sellerRoutes from "./routes/seller.route.js";
import touristRoutes from "./routes/tourist.route.js";
import tourGuideRoutes from "./routes/tourGuide.route.js";
import productRoutes from "./routes/product.route.js";
import cors from "cors";

dotenv.config({path: "../.env"});

const app = express();
app.use(express.json());
app.use(cors());

app.use("/api/activity", activityRoutes);
app.use("/api/activityCategory", activityCategoryRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/advertiser", advertiserRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/governor", governorRoutes);
app.use("/api/itinerary", itineraryRoutes);
app.use("/api/museum", museumRoutes);
app.use("/api/seller", sellerRoutes);
app.use("/api/tourist", touristRoutes);
app.use("/api/tourGuide", tourGuideRoutes);
app.use("/api/product", productRoutes);



app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(process.env.PORT, () => {
  connectDB(); // Connect to database
  console.log(`Server is running on http://localhost:${process.env.PORT}`);
});
