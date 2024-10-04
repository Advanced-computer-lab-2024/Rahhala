const mongoose = require('mongoose');


const itinerarySchema = new mongoose.Schema({
  budget: {
    type: String,
    required: true, 
  },
  date: {
    type: Date, 
    required: true,
  },

  language: {
    type: String, 
    required: true,
  },
  price: {
    type: String, 
    required: true,
  },
  ratings: {
    type: String, 
    required: true,
  },
  activities: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Activity', 
}],
}, { timestamps: true }); // Adds createdAt and updatedAt timestamps

// Create the model based on the schema
const itineraryModel = mongoose.model('Itinerary', itinerarySchema);

module.exports = itineraryModel;
