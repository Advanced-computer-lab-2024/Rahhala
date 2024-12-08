import express from "express";
import { verifyToken } from "../middleware/auth.js";
import {
  getTouristByID,
  editTourist,
  getTourists,
  getTouristByEmail,
  requestAccountDeletion,
  getComplaints,
  bookItinerary,
  bookActivity,
  cancelActivityBooking,
  cancelItineraryBooking,
  changePassword,
  addReview,
  addMoneyToWallet,
  redeemLoyaltyPoints,
  purchaseProduct,
  saveProductToWishlist,
  removeProductFromWishlist,
  addItemToCart,
  removeItemFromCart,
  changeItemQuantityInCart,
  checkoutOrder,
  addDeliveryAddress,
  cancelOrder,
  loginTourist,
  requestPasswordReset, 
  resetPassword,
  getTouristByIdParam
} from "../controllers/tourist.controller.js";

const router = express.Router();
router.post("/login", loginTourist);
router.get("/", verifyToken, getTouristByID);
router.get("/get/:id", verifyToken, getTouristByIdParam);
router.put("/edit/:id", verifyToken, editTourist);
router.get("/email", verifyToken, getTouristByEmail);
router.post("/profile/request-delete", verifyToken, requestAccountDeletion);
router.get("/viewComplaints", verifyToken, getComplaints);
router.post("/bookItinerary", verifyToken, bookItinerary);
router.post("/bookActivity", verifyToken, bookActivity);
router.put("/cancelActivityBooking", verifyToken, cancelActivityBooking);
router.put("/cancelItineraryBooking", verifyToken, cancelItineraryBooking);
router.put("/changePassword", verifyToken, changePassword);
router.post('/reviews', verifyToken, addReview);
router.put('/addMoneyToWallet', verifyToken, addMoneyToWallet);
router.post('/redeemLoyaltyPoints', verifyToken, redeemLoyaltyPoints);
router.post('/purchaseProduct', verifyToken, purchaseProduct);
router.post('/wishlist', verifyToken, saveProductToWishlist);
router.delete('/wishlist', verifyToken, removeProductFromWishlist);
router.post("/cart/:productId/:quantity", verifyToken, addItemToCart);
router.delete("/cart/:productId", verifyToken, removeItemFromCart);
router.put("/cart", verifyToken, changeItemQuantityInCart);
router.post("/checkout",verifyToken, checkoutOrder);
router.post("/address", verifyToken, addDeliveryAddress);
router.put('/cancel', verifyToken, cancelOrder); 
router.post('/requestPasswordReset', requestPasswordReset);
router.post('/resetPassword', resetPassword);
export default router;
