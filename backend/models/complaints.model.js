// models/complaint.model.js
import mongoose from 'mongoose';

const complaintSchema = new mongoose.Schema({
  title: { type: String, required: true },
  body: { type: String, required: true },
  date: { type: Date, default: Date.now }, // Automatically set the date to now
  touristId: { type: mongoose.Schema.Types.ObjectId, ref: 'Tourist', required: true }, // Reference to the tourist who filed the complaint
});

const Complaint = mongoose.model('Complaint', complaintSchema);

export default Complaint;
