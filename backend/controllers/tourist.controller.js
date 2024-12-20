import touristModel from "../models/tourist.model.js";
import activityModel from "../models/activity.model.js";
import itineraryModel from "../models/itinerary.model.js";
import museumModel from "../models/museum.model.js";
import complaintModel from "../models/complaint.model.js";
import accountDeletionRequestModel from "../models/accountDeletionRequest.model.js";
import reviewModel from "../models/review.model.js";
import tourGuideModel from "../models/tourGuide.model.js";
import productModel from "../models/product.model.js";
import mongoose from "mongoose";
import { generateToken, comparePasswords } from "../utils/jwt.js";
import nodemailer from "nodemailer";
import crypto from "crypto";
import dotenv from "dotenv";
import saleModel from "../models/sale.model.js";
import { recordSale } from "../controllers/sale.controller.js";
import Tourist from "../models/tourist.model.js";
import axios from "axios";
import { getAuthToken } from "../utils/amadeusAPI.js";

dotenv.config({ path: "../../.env" }); // Adjust path if needed

// Generate OTP
const generateOTP = () => {
  return crypto.randomBytes(3).toString("hex"); // Generate a 6-digit OTP
};

// Send OTP Email
const sendOTPEmail = async (email, otp) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 587,
    auth: {
      user: process.env.MAILTRAP_USER,
      pass: process.env.MAILTRAP_PASS,
    },
  });

  const mailOptions = {
    from: "no-reply@example.com",
    to: email,
    subject: "Your OTP for Password Reset",
    text: `Your OTP for password reset is: ${otp}`,
  };

  await transporter.sendMail(mailOptions);
};

// Request OTP for Password Reset
export const requestPasswordReset = async (req, res) => {
  console.log("entered requestPasswordReset");
  const { email } = req.body;

  try {
    const tourist = await touristModel.findOne({ email });

    if (!tourist) {
      return res.status(404).json({ error: "Tourist not found" });
    }

    const otp = generateOTP();
    tourist.resetPasswordOTP = otp;
    tourist.resetPasswordExpires = Date.now() + 3600000; // OTP expires in 1 hour

    await tourist.save();

    await sendOTPEmail(email, otp);

    res.status(200).json({ message: "OTP sent to your email" });
  } catch (error) {
    console.error("Error requesting password reset:", error);
    res.status(500).json({ error: "Error requesting password reset" });
  }
};

export const resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;

  try {
    const tourist = await touristModel.findOne({ email });

    if (!tourist) {
      return res.status(404).json({ error: "tourist not found" });
    }

    if (
      tourist.resetPasswordOTP !== otp ||
      tourist.resetPasswordExpires < Date.now()
    ) {
      return res.status(400).json({ error: "Invalid or expired OTP" });
    }

    tourist.password = newPassword;
    tourist.resetPasswordOTP = undefined;
    tourist.resetPasswordExpires = undefined;

    await tourist.save();

    res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    console.error("Error resetting password:", error);
    res.status(500).json({ error: "Error resetting password" });
  }
};

// Get Tourist profile by email
export const getTouristByEmail = async (req, res) => {
  console.log("entered getTouristByEmail");

  const { email } = req.params;

  try {
    const tourist = await touristModel.findOne({ email });

    if (!tourist) {
      return res.status(404).json({ error: "Tourist profile not found" });
    }

    res.status(200).json({ profile: tourist });
  } catch (error) {
    res.status(500).json({ error: "Error fetching tourist profile." });
  }
};

// Get Tourist profile by ID
export const getTouristByID = async (req, res) => {
  console.log("entered getTouristByID");
  const id = req.user.id; // Get the user ID from the verified JWT payload

  try {
    const tourist = await touristModel.findById(id).populate("preferences");
    if (!tourist) {
      return res.status(404).json({ error: "Tourist profile not found" });
    }

    res.status(200).json({ profile: tourist });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error fetching tourist profile." });
  }
};

// Get Tourist profile by ID
export const getTouristByIdParam = async (req, res) => {
  console.log("entered getTouristByIdParam");
  const id = req.param; // Get the user ID from the verified JWT payload

  try {
    const tourist = await touristModel.findById(id);
    if (!tourist) {
      return res.status(404).json({ error: "Tourist profile not found" });
    }

    res.status(200).json({ profile: tourist });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error fetching tourist profile." });
  }
};

// Edit Tourist Information
export const editTourist = async (req, res) => {
  console.log("entered editTourist");
  console.log(req.body);
  const id = req.user.id; // Get the user ID from the verified JWT payload
  const { email, mobileNumber, nationality, dob, occupation, 
    profilePicture, currency, preferences, deliveryAddresses } = req.body;

  try {
    const tourist = await touristModel.findById(id);

    if (!tourist) {
      return res.status(404).json({ error: "Tourist not found" });
    }

    // Update other profile fields
    tourist.email = email || tourist.email;
    tourist.mobileNumber = mobileNumber || tourist.mobileNumber;
    tourist.nationality = nationality || tourist.nationality;
    tourist.dob = dob || tourist.dob;
    tourist.occupation = occupation || tourist.occupation;
    tourist.profilePicture = profilePicture || tourist.profilePicture;
    tourist.currency = currency || tourist.currency;
    tourist.preferences = preferences || tourist.preferences;
    tourist.deliveryAddresses = deliveryAddresses || tourist.deliveryAddresses;

    await tourist.save();
    res.status(200).json({
      message: "Tourist profile updated successfully",
      profile: tourist,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error updating tourist profile." });
  }
};

// Get Tourists from the Database
export const getTourists = async (req, res) => {
  console.log("entered getTourists");
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set the time to the start of the day
    const activities = await activityModel.find({ date: { $gte: today } });

    const itineraries = await itineraryModel.find({
      availableDates: { $elemMatch: { $gte: today } },
    });
    const museums = await museumModel.find();
    res.status(200).json({
      activities: activities,
      itineraries: itineraries,
      museums: museums,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
};

// Request Account Deletion
export const requestAccountDeletion = async (req, res) => {
  console.log("Requesting Account to be deleted");
  const touristId = req.user.id; // Get the user ID from the verified JWT payload

  try {
    const tourist = await touristModel.findById(touristId);

    if (!tourist) {
      return res.status(404).json({ error: "Tourist not found" });
    }

    // Check for upcoming paid activities
    const today = new Date();
    const upcomingActivities = await activityModel.find({
      userId: touristId,
      date: { $gte: today },
      bookingOpen: true, // Assuming only open bookings count
    });

    // Check for upcoming itineraries
    const upcomingItineraries = await itineraryModel.find({
      userId: touristId,
      availableDates: { $elemMatch: { $gte: today } },
    });

    // If there are any upcoming activities or itineraries, do not allow deletion
    if (upcomingActivities.length > 0 || upcomingItineraries.length > 0) {
      return res
        .status(400)
        .json({
          error:
            "Account cannot be deleted while there are upcoming paid bookings.",
        });
    }

    // Create a new account deletion request
    const deletionRequest = new accountDeletionRequestModel({
      touristId: touristId,
    });

    await deletionRequest.save(); // Save the request to the database

    console.log(`Account deletion requested for user: ${tourist.email}`);
    res
      .status(200)
      .json({ message: "Account deletion request sent to admin." });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Error processing account deletion request." });
  }
};

export const getComplaints = async (req, res) => {
  console.log("Viewing Filed Complaints");
  const touristId = req.user.id; // Get the user ID from the verified JWT payload

  try {
    const complaints = await complaintModel
      .find({ touristId })
      .populate("touristId", "email"); // Adjust the populated fields as necessary

    res.status(200).json({ complaints });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error fetching complaints." });
  }
};

export const bookItinerary = async (req, res) => {
  console.log("Booking an itinerary");
  const touristId = req.user.id; // Get the user ID from the verified JWT payload
  const { itineraryId } = req.body; // Get the itinerary ID from the request body
  try {
    const tourist = await touristModel.findById(touristId);
    const itinerary = await itineraryModel.findById(itineraryId);

    if (!tourist) {
      return res.status(404).json({ error: "Tourist not found" });
    }

    if (!itinerary) {
      return res.status(404).json({ error: "Itinerary not found" });
    }
    if (tourist.bookedItineraries.includes(itineraryId)) {
      return res.status(400).json({ error: "Itinerary already booked" });
    }

    if (tourist.wallet < itinerary.price) {
      return res.status(400).json({ error: "Insufficient funds in wallet" });
    }
    // Deduct the price from the tourist's wallet
    tourist.wallet -= itinerary.price;

    // Add the itinerary to the tourist's bookedItineraries
    tourist.bookedItineraries.push(itineraryId);

    console.log("itinerary id is ", itineraryId);

    await recordSale({
      saleId: itineraryId,
      type: "Itinerary",
      sellerId: itinerary.userId,
      buyerId: touristId,
      price: itinerary.price,
    });

    await tourist.save();

    res
      .status(200)
      .json({ message: "Itinerary booked successfully", itinerary });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error booking itinerary." });
  }
};

export const bookActivity = async (req, res) => {
  console.log("Booking an activity");
  const touristId = req.user.id; // Get the user ID from the verified JWT payload
  const { activityId } = req.body; // Get the activity ID from the request body

  try {
    const tourist = await touristModel.findById(touristId);
    const activity = await activityModel.findById(activityId);

    if (!tourist) {
      return res.status(404).json({ error: "Tourist not found" });
    }
    if (tourist.bookedActivities.includes(activityId)) {
      return res.status(400).json({ error: "Activity already booked" });
    }

    if (!activity) {
      return res.status(404).json({ error: "Activity not found" });
    }

    if (tourist.wallet < parseFloat(activity.price.replace(/[^0-9.-]+/g, ""))) {
      return res.status(400).json({ error: "Insufficient funds in wallet" });
    }

    // Deduct the price from the tourist's wallet
    tourist.wallet -= parseFloat(activity.price.replace(/[^0-9.-]+/g, ""));

    // Add the activity to the tourist's bookedActivities
    tourist.bookedActivities.push(activityId);

    await recordSale({
      saleId: activityId,
      type: "Activity",
      sellerId: activity.userId,
      buyerId: touristId,
      price: activity.price,
    });

    await tourist.save();

    res.status(200).json({ message: "Activity booked successfully", activity });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error booking activity." });
  }
};

export const purchaseProduct = async (req, res) => {
  console.log("Purchasing a product");
  const touristId = req.user.id; // Get the user ID from the verified JWT payload
  const { productId, quantity } = req.body; // Get the product ID and quantity from the request body
  console.log(req.body);
  try {
    const tourist = await touristModel.findById(touristId);
    const product = await productModel.findById(productId);

    if (!tourist) {
      return res.status(404).json({ error: "Tourist not found" });
    }

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }
    if (product.quantity < quantity) {
      return res
        .status(400)
        .json({ error: "Insufficient product quantity available" });
    }

    const totalPrice = product.price * quantity;

    if (tourist.wallet < totalPrice) {
      return res.status(400).json({ error: "Insufficient funds in wallet" });
    }

    // Deduct the total price from the tourist's wallet
    tourist.wallet -= totalPrice;

    // Reduce the product quantity
    product.quantity -= quantity;

    // Increase the product sales
    product.sales += quantity;

        // Check if the product is already in the purchasedProducts array
        const existingProductIndex = tourist.purchasedProducts.findIndex(p => p.productId.toString() === productId);
        if (existingProductIndex !== -1) {
            // If the product is already in the array, update the quantity
            tourist.purchasedProducts[existingProductIndex].quantity += Number(quantity);
        } else {

            // If the product is not in the array, add it with the specified quantity
            tourist.purchasedProducts.push({ productId, quantity });
        }
        await tourist.save();
        await product.save();
        await recordSale({
          saleId: productId,
          type: 'Product',
          sellerId: product.sellerId,
          buyerId: touristId,
          price: product.price,
          quantity: quantity,
        });

    res
      .status(200)
      .json({ message: "Product purchased successfully", product });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error purchasing product." });
  }
};

export const cancelActivityBooking = async (req, res) => {
  console.log("Cancelling an activity booking");
  const touristId = req.user.id;
  const { activityId } = req.body;

  try {
    const tourist = await touristModel.findById(touristId);
    const activity = await activityModel.findById(activityId);

    if (!tourist) {
      return res.status(404).json({ error: "Tourist not found" });
    }

    if (!activity) {
      return res.status(404).json({ error: "Activity not found" });
    }

    const currentTime = new Date();
    const activityTime = new Date(activity.date);

    if (activityTime - currentTime < 48 * 60 * 60 * 1000) {
      return res
        .status(400)
        .json({
          error: "Cannot cancel booking within 48 hours of the activity",
        });
    }

    tourist.wallet += parseFloat(activity.price.replace(/[^0-9.-]+/g, ""));
    tourist.bookedActivities = tourist.bookedActivities.filter(
      (id) => id.toString() !== activityId
    );

    await tourist.save();

    res
      .status(200)
      .json({
        message: "Activity booking cancelled and refunded successfully",
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error cancelling activity booking" });
  }
};

export const cancelItineraryBooking = async (req, res) => {
  console.log("Cancelling an itinerary booking");
  const touristId = req.user.id;
  const { itineraryId } = req.body;

  try {
    const tourist = await touristModel.findById(touristId);
    const itinerary = await itineraryModel.findById(itineraryId);

    if (!tourist) {
      return res.status(404).json({ error: "Tourist not found" });
    }

    if (!itinerary) {
      return res.status(404).json({ error: "Itinerary not found" });
    }

    const currentTime = new Date();
    const itineraryTime = new Date(Math.min(...itinerary.availableDates));

    if (itineraryTime - currentTime < 48 * 60 * 60 * 1000) {
      return res
        .status(400)
        .json({
          error: "Cannot cancel booking within 48 hours of the itinerary",
        });
    }

    tourist.wallet += itinerary.price;
    tourist.bookedItineraries = tourist.bookedItineraries.filter(
      (id) => id.toString() !== itineraryId
    );

    await tourist.save();

    res
      .status(200)
      .json({
        message: "Itinerary booking cancelled and refunded successfully",
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error cancelling itinerary booking" });
  }
};

export const changePassword = async (req, res) => {
  console.log("Changing password");
  const { oldPassword, newPassword } = req.body;
  const userID = req.user.id;
  console.log("Change password request received with ID:", userID);
  try {
    // Search for the tourist using the email
    const tourist = await touristModel.findById(userID);
    if (!tourist) {
      return res.status(404).json({ message: "Tourist not found" });
    }
    // Check if the old password matches
    if (oldPassword !== tourist.password) {
      return res.status(400).json({ message: "Old password is incorrect" });
    }

    // Check if the new password is the same as the old password
    if (newPassword === oldPassword) {
      return res
        .status(400)
        .json({
          message: "New password cannot be the same as the old password",
        });
    }

    // Update the password
    tourist.password = newPassword;
    await tourist.save();

    res.status(200).json({ message: "Password changed successfully" });
  } catch (error) {
    console.error("Error changing password:", error);
    res.status(500).json({ message: "Error changing password" });
  }
};

export const addReview = async (req, res) => {
  try {
    const touristId = req.user.id;
    const { rating, title, body, reviewedEntity, reviewedEntityType } =
      req.body;

    // Validate required fields
    if (!rating || !reviewedEntity || !reviewedEntityType) {
      return res.status(400).json({
        message: "Rating, reviewed entity, and entity type are required",
      });
    }

    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(reviewedEntity)) {
      return res.status(400).json({
        message: "Invalid entity ID format",
      });
    }

    // Validate rating range
    if (rating < 0 || rating > 5) {
      return res.status(400).json({
        message: "Rating must be between 0 and 5",
      });
    }

    const tourist = await touristModel.findById(id);
    if (!tourist) {
      return res.status(404).json({
        message: "Tourist not found",
      });
    }

    // Check if entity exists based on type
    let entityExists = false;
    switch (reviewedEntityType) {
      case "Itinerary":
        entityExists = await itineraryModel.findById(reviewedEntity);
        break;
      case "TourGuide":
        entityExists = await tourGuideModel.findById(reviewedEntity);
        break;
      case "Activity":
        entityExists = await activityModel.findById(reviewedEntity);
        break;
      case "Product":
        entityExists = await productModel.findById(reviewedEntity);
        break;
      default:
        return res.status(400).json({
          message: "Invalid entity type",
        });
    }
    if (!entityExists) {
      return res.status(404).json({
        message: `${reviewedEntityType} with ID ${reviewedEntity} not found`,
      });
    }
    console.log(entityExists);
    // Check if the itinerary or activity is booked and the date today is after the event's date
    if (
      reviewedEntityType === "Itinerary" ||
      reviewedEntityType === "Activity"
    ) {
      const today = new Date();
      let isBooked = false;
      let eventDate;

      if (reviewedEntityType === "Itinerary") {
        isBooked = tourist.bookedItineraries.includes(reviewedEntity);
        eventDate = new Date(Math.min(...entityExists.availableDates));
      } else if (reviewedEntityType === "Activity") {
        isBooked = tourist.bookedActivities.includes(reviewedEntity);
        eventDate = new Date(entityExists.date);
      }

      if (!isBooked) {
        return res.status(400).json({
          message: `You must book the ${reviewedEntityType.toLowerCase()} before reviewing it`,
        });
      }

      if (today < eventDate) {
        return res.status(400).json({
          message: `You can only review the ${reviewedEntityType.toLowerCase()} after the event date`,
        });
      }
    }

    if (reviewedEntityType === "TourGuide") {
      const itineraries = await itineraryModel.find({ userId: reviewedEntity });
      const today = new Date();
      let hasAttended = false;

      for (const itinerary of itineraries) {
        const isBooked = tourist.bookedItineraries.includes(itinerary._id);
        const eventDate = new Date(Math.min(...itinerary.availableDates));

        if (isBooked && today > eventDate) {
          hasAttended = true;
          break;
        }
      }

      if (!hasAttended) {
        return res.status(400).json({
          message:
            "You must attend an itinerary created by this tour guide before reviewing",
        });
      }
    }

    if (reviewedEntityType === "Product") {
      const isPurchased = tourist.purchasedProducts.includes(reviewedEntity);
      if (!isPurchased) {
        return res.status(400).json({
          message: "You must purchase the product before reviewing it",
        });
      }
    }

    // Create new review
    const review = new reviewModel({
      tourist: touristId,
      rating,
      title,
      body,
      reviewedEntity,
      reviewedEntityType,
    });

    await review.save();

    res.status(201).json({
      message: "Review added successfully",
      review,
    });
  } catch (error) {
    console.error("Error adding review:", error);
    res.status(500).json({
      message: "Error adding review",
      error: error.message,
    });
  }
};

export const addMoneyToWallet = async (req, res) => {
  console.log("Adding money to wallet");
  const touristId = req.user.id; // Get the user ID from the verified JWT payload
  const { amount } = req.body; // Get the amount to add from the request body

  try {
    const tourist = await touristModel.findById(touristId);

    if (!tourist) {
      return res.status(404).json({ error: "Tourist not found" });
    }

    // Add the specified amount to the tourist's wallet
    tourist.wallet += amount;
    // Calculate loyalty points based on the amount and current level
    let pointsMultiplier;
    if (tourist.totalLoyaltyPoints <= 100000) {
      pointsMultiplier = 0.5;
    } else if (tourist.totalLoyaltyPoints <= 500000) {
      pointsMultiplier = 1;
    } else {
      pointsMultiplier = 1.5;
    }

    const loyaltyPoints = amount * pointsMultiplier;

    // Add the calculated loyalty points to current and total loyalty points
    tourist.currentLoyaltyPoints += loyaltyPoints;
    tourist.totalLoyaltyPoints += loyaltyPoints;
    await tourist.save();

    res
      .status(200)
      .json({
        message: "Money added to wallet successfully",
        wallet: tourist.wallet,
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error adding money to wallet." });
  }
};

export const redeemLoyaltyPoints = async (req, res) => {
  console.log("Redeeming loyalty points");
  const touristId = req.user.id; // Get the user ID from the verified JWT payload
  const { pointsToRedeem } = req.body; // Get the points to redeem from the request body

  try {
    const tourist = await touristModel.findById(touristId);

    if (!tourist) {
      return res.status(404).json({ error: "Tourist not found" });
    }

    if (pointsToRedeem > tourist.currentLoyaltyPoints) {
      return res.status(400).json({ error: "Insufficient loyalty points" });
    }

    // Calculate the amount to add to the wallet
    const amount = Math.floor((pointsToRedeem / 10000) * 100);
    console.log(amount);

    // Deduct the redeemed points from current loyalty points
    tourist.currentLoyaltyPoints -= amount * 100;

    // Add the amount to the tourist's wallet
    tourist.wallet += amount;

    await tourist.save();

    res
      .status(200)
      .json({
        message: "Loyalty points redeemed successfully",
        wallet: tourist.wallet,
        currentLoyaltyPoints: tourist.currentLoyaltyPoints,
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error redeeming loyalty points." });
  }
};

export const saveProductToWishlist = async (req, res) => {
  console.log("Saving product to wishlist");
  const touristId = req.user.id;
  const { productId } = req.params;

  try {
    const tourist = await touristModel.findById(touristId);
    const product = await productModel.findById(productId);

    if (!tourist) {
      return res.status(404).json({ error: "Tourist not found" });
    }

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    if (tourist.wishlist.includes(productId)) {
      return res.status(400).json({ error: "Product already in wishlist" });
    }

    // Add the product to the tourist's wishlist
    tourist.wishlist.push(productId);
    console.log("here");

    await tourist.save();

    res
      .status(200)
      .json({ message: "Product saved to wishlist successfully", product });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error saving product to wishlist." });
  }
};

export const removeProductFromWishlist = async (req, res) => {
  const touristId = req.user.id;
  const { productId } = req.body;

  try {
    // Find the tourist by their ID
    const tourist = await touristModel.findById(touristId);

    if (!tourist) {
      return res.status(404).json({ error: "Tourist not found" });
    }

    // Find the index of the product in the wishlist
    const productIndex = tourist.wishlist.findIndex(
      (item) => item.toString() === productId
    );

    if (productIndex === -1) {
      return res.status(404).json({ error: "Product not found in wishlist" });
    }

    // Remove the item from the wishlist
    tourist.wishlist.splice(productIndex, 1);

    // Save the updated tourist document
    await tourist.save();

    res
      .status(200)
      .json({
        message: "Product removed from wishlist",
        updatedWishlist: tourist.wishlist,
      });
  } catch (error) {
    console.error("[removeProductFromWishlist] Error:", error);
    res.status(500).json({ error: "Error removing product from wishlist" });
  }
};

export const addItemToCart = async (req, res) => {
    console.log("Adding item to cart");
  const touristId = req.user.id; 
  const { productId, quantity } = req.params;
  console.log(req.params);
  // Validate ObjectId format for tourist and product
  if (!mongoose.Types.ObjectId.isValid(touristId)) {
    return res.status(400).json({ error: "Invalid tourist ID" });
  }
  if (!mongoose.Types.ObjectId.isValid(productId)) {
    return res.status(400).json({ error: "Invalid product ID" });
  }

  // Validate quantity
  if (quantity <= 0) {
    return res
      .status(400)
      .json({ error: "Quantity must be greater than zero" });
  }

  try {
    // Find the tourist by their ID
    const tourist = await touristModel.findById(touristId);

    if (!tourist) {
      return res.status(404).json({ error: "Tourist not found" });
    }

    // Initialize cart if not present
    if (!tourist.cart) {
      tourist.cart = [];
    }

    // Check if the product is already in the cart
    const productIndex = tourist.cart.findIndex(
      (item) => item.product.toString() === productId
    );

      if (productIndex !== -1) {
          // If the product is already in the cart, update the quantity
          tourist.cart[productIndex].quantity += Number(quantity);
      } else {
          // If the product is not in the cart, add it to the cart
          tourist.cart.push({ product: productId, quantity });
      }

    // Save the updated tourist document
    await tourist.save();

    // Return the updated cart
    res
      .status(200)
      .json({ message: "Item added to cart", updatedCart: tourist.cart });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error adding item to cart" });
  }
};

export const removeItemFromCart = async (req, res) => {
  const touristId = req.user.id;
  const { productId } = req.params;

  try {
    // Find the tourist by their ID
    const tourist = await touristModel.findById(touristId);

    if (!tourist) {
      return res.status(404).json({ error: "Tourist not found" });
    }

    // Find the index of the product in the cart
    const productIndex = tourist.cart.findIndex(
      (item) => item.product.toString() === productId
    );

    if (productIndex === -1) {
      return res.status(404).json({ error: "Product not found in cart" });
    }

    // If quantity is more than 1, reduce it
    if (tourist.cart[productIndex].quantity > 1) {
      tourist.cart[productIndex].quantity -= 1;
    } else {
      // If quantity is 1, remove the item from the cart
      tourist.cart.splice(productIndex, 1);
    }

    // Save the updated tourist document
    await tourist.save();

    res
      .status(200)
      .json({ message: "Item removed from cart", updatedCart: tourist.cart });
  } catch (error) {
    res.status(500).json({ error: "Error removing item from cart" });
  }
};

// Change the amount of an item in the cart
export const changeItemQuantityInCart = async (req, res) => {
  const touristId = req.user.id; // Get the tourist ID from the verified JWT payload
  const { productId, quantity } = req.params;
  try {
    // Find the tourist and update the product quantity in the cart
    const tourist = await touristModel.findById(touristId);

    if (!tourist) {
      return res.status(404).json({ error: "Tourist not found" });
    }

    // Find the product in the cart and update its quantity
    const productIndex = tourist.cart.findIndex(
      (item) => item.product.toString() === productId
    );

    if (productIndex === -1) {
      return res.status(404).json({ error: "Product not found in cart" });
    }

    // Update the quantity of the product in the cart
    tourist.cart[productIndex].quantity = quantity;

    // Save the updated tourist document
    await tourist.save();

    res
      .status(200)
      .json({ message: "Item quantity updated", updatedCart: tourist.cart });
  } catch (error) {
    res.status(500).json({ error: "Error updating item quantity in cart" });
  }
};
export const checkoutOrder = async (req, res) => {
  const touristId = req.user.id; 
  const { deliveryAddress } = req.body;

  try {
    // Find the tourist
    const tourist = await touristModel
      .findById(touristId)
      .populate("cart.product");

    if (!tourist) {
      return res.status(404).json({ error: "Tourist not found" });
    }

    // Check if the cart is empty
    if (tourist.cart.length === 0) {
      return res.status(400).json({ error: "Your cart is empty" });
    }

    let totalAmount = 0;
    const updatedCart = [];

    // Loop through the cart to check product availability and calculate the total
    for (const item of tourist.cart) {
      const product = await productModel.findById(item.product._id); // Ensure the product is directly fetched from DB
      const requiredQuantity = item.quantity;

      if (product.quantity < requiredQuantity) {
        return res
          .status(400)
          .json({ error: `Insufficient stock for ${product.name}` });
      }

      // Deduct the required quantity from the product stock
      product.quantity -= requiredQuantity;
      await product.save(); // Ensure the save operation is performed here

      // Add the item cost to the total
      totalAmount += product.price * requiredQuantity;

      updatedCart.push({
        product: product._id,
        quantity: requiredQuantity,
        totalPrice: product.price * requiredQuantity,
      });
    }

    // Check if the wallet has enough balance
    if (tourist.wallet < totalAmount) {
      return res.status(400).json({ error: "Insufficient balance in wallet" });
    }

    // Deduct totalAmount from wallet
    tourist.wallet -= totalAmount;

      // Add the order to the orders array
      const newOrder = {
          status: 'pending',
          paymentStatus: 'completed',
          totalAmount,
          paymentMethod: 'wallet', // Assuming wallet payment here
          items: updatedCart.map(item => ({
              productId: item.product,
              quantity: item.quantity,
              price: item.totalPrice
          })),
          deliveryAddress: deliveryAddress || '', // Use the provided address or empty string
      };
      tourist.orders.push(newOrder);

    // Clear the cart after successful checkout
    tourist.cart = [];
    await tourist.save();

    res.status(200).json({
      message: "Order placed successfully",
      orderSummary: {
        products: updatedCart,
        totalAmount,
        newOrder,
      },
    });
  } catch (error) {
    console.error(error); // Log the error for debugging
    res.status(500).json({ error: "Error processing the checkout" });
  }
};

export const addDeliveryAddress = async (req, res) => {
  try {
    const touristId = req.user.id;
    const { address } = req.params;

    // Find the tourist by ID
    const tourist = await touristModel.findById(touristId);

    if (!tourist) {
      return res.status(404).json({ error: "Tourist not found" });
    }

    // Add the new address to the tourist's addresses array
    tourist.deliveryAddresses.push({ address });

    // Save the updated tourist document
    await tourist.save();

    res.status(200).json({ message: "Address added successfully", tourist });
  } catch (error) {
    res.status(500).json({ error: "Error adding address" });
  }
};

export const cancelOrder = async (req, res) => {
  const touristId = req.user.id; // Get the user ID from the verified JWT payload
  const { orderId } = req.param;

  try {
    // Find the tourist by ID
    const tourist = await touristModel
      .findById(touristId)
      .populate("orders.items.productId");

    if (!tourist) {
      return res.status(404).json({ error: "Tourist not found" });
    }

      // Find the order in the tourist's orders array
      const orderIndex = tourist.orders.findIndex(order => order._id === orderId);

    if (orderIndex === -1) {
      return res.status(404).json({ error: "Order not found" });
    }

    // Extract the order to be canceled
    const [removedOrder] = tourist.orders.splice(orderIndex, 1);

    // Refund the wallet if payment was made using wallet
    if (
      removedOrder.paymentMethod === "wallet" &&
      removedOrder.paymentStatus === "completed"
    ) {
      tourist.wallet += removedOrder.totalAmount;
    }

    // Reset product quantities
    for (const item of removedOrder.items) {
      const product = await productModel.findById(item.productId);
      if (product) {
        product.quantity += item.quantity; // Restore the product quantity
        await product.save(); // Save the updated product
      }
    }

    // Save the updated tourist document
    await tourist.save();

    res.status(200).json({
      message: "Order cancelled successfully",
      refundedAmount:
        removedOrder.paymentMethod === "wallet" ? removedOrder.totalAmount : 0,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error cancelling the order" });
  }
};

// Login Tourist
export const loginTourist = async (req, res) => {
  const { username, password } = req.body;

  try {
    // Find the tourist by username
    const tourist = await touristModel.findOne({ username });

    if (!tourist) {
      return res.status(404).json({ error: "Tourist not found" });
    }

    // Compare the provided password with the stored password
    const isMatch = await comparePasswords(tourist.password, password);

    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Generate a JWT token
    const token = generateToken(tourist, "tourist");

    res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    console.error("Error logging in tourist:", error);
    res.status(500).json({ error: "Error logging in tourist" });
  }
};
export const getTouristBookings = async (req, res) => {
  try {
    const tourist = await Tourist.findById(req.user.id)
      .populate('bookedActivities')
      .populate('bookedItineraries');

    if (!tourist) {
      return res.status(404).json({ message: 'Tourist not found' });
    }

    res.status(200).json({
      bookedActivities: tourist.bookedActivities,
      bookedItineraries: tourist.bookedItineraries
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};