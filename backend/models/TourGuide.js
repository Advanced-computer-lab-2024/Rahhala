const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const TourGuideSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    match: [/\S+@\S+\.\S+/, "Invalid email format"],
  },
  username: {
    type: String,
    required: [true, "Username is required"],
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: 6,
  },
  role: {
    type: String,
    default: "tour_guide",
  },
  mobileNumber: {
    type: String,
    match: [/^\d{10,15}$/, "Invalid mobile number"],
  },
  yearsOfExperience: {
    type: Number,
    min: 0,
    default: 0,
  },
  previousWork: [
    {
      type: String,
    },
  ],
  profileCreated: {
    type: Boolean,
    default: false,
  }
}, {
  timestamps: true,
});

// Hash the password before saving it
TourGuideSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

const TourGuide = mongoose.model("TourGuide", TourGuideSchema);
module.exports = TourGuide;
