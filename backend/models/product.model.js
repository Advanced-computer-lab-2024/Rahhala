import mongoose from "mongoose";

const productSchema = mongoose.Schema(
  {
    picture: { type: String},
    price: { type: Number, required: true },
    name: { type: String, required: true },
    description: { type: String, required: false },
    sellerId: {
      // Show seller
      type: mongoose.Schema.Types.ObjectId,
      ref: "seller",
      required: true,
    },
    averageRating: { type: Number, default: 0 }, // Store average rating
    quantity: { type: Number, required: true }, // Field for available quantity
    sales: { type: Number, default: 0 }, // Field for total sales
    isArchived: { type: Boolean, default: false }, // Field to archive products
  },
  { timestamps: true }
);

export default mongoose.model("Product", productSchema); // Exporting the model
