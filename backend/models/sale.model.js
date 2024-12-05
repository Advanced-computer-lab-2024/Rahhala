import mongoose from 'mongoose';

const saleSchema = new mongoose.Schema({
  saleId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    refPath: 'type', // Reference to the type of sale (itinerary, product, or activity)
  },
  type: {
    type: String,
    required: true,
    enum: ['Itinerary', 'Product', 'Activity'], // Type of the sale
  },
  sellerId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User', // Assuming you have a User model for sellers
  },
  buyerId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Tourist', // Assuming you have a User model for buyers
  },
  price: {
    type: Number,
    required: true,
  },
  quantity: {
    type: Number,
    default: 1,
  },
}, {
  timestamps: true, // Automatically add createdAt and updatedAt fields
});

const Sale = mongoose.model('Sale', saleSchema);

export default Sale;