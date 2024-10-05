const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const AdvertiserSchema = new mongoose.Schema({
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
    default: "advertiser",
  },
  companyName: {
    type: String,
    trim: true,
  },
  website: {
    type: String,
    match: [/^https?:\/\/\S+\.\S+/, "Invalid URL format"],
  },
  hotline: {
    type: String,
    match: [/^\d{7,15}$/, "Invalid hotline number"],
  },
  companyProfile: {
    type: String,
  },
  profileCreated: {
    type: Boolean,
    default: false,
  }
}, {
  timestamps: true,
});

// Hash the password before saving it
AdvertiserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

const Advertiser = mongoose.model("Advertiser", AdvertiserSchema);
module.exports = Advertiser;
