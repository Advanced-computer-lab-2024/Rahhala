const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const SellerSchema = new mongoose.Schema({
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
    default: "seller",
  },
  name: {
    type: String,
    trim: true,
  },
  description: {
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
SellerSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

const Seller = mongoose.model("Seller", SellerSchema);
module.exports = Seller;
