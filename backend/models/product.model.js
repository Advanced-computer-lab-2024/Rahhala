import mongoose from "mongoose";
const productSchema = mongoose.Schema(
  {
    picture: { type: String },
    price: { type: Number, required: true },
    name: { type: String, required: true },
    description: { type: String, required: false },
    sellerName: {
      //show seller
      type: mongoose.Schema.Types.ObjectId,
      ref: "seller",
      required: true,
    },
   
    averageRating: { type: Number, default: 0 }, // Store average rating
  },
  { timestamps: true }
);

export default mongoose.model("Product", productSchema); // Exporting the model
