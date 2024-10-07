const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const TouristSchema = new mongoose.Schema({
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
  mobileNumber: {
    type: String,
    required: [true, "Mobile number is required"],
    match: [/^\d{10,15}$/, "Invalid mobile number"],
  },
  nationality: {
    type: String,
    required: true,
  },
  dob: {
    type: Date,
    required: true,
    validate: {
      validator: function (value) {
        const today = new Date();
        const age = today.getFullYear() - value.getFullYear();
        return age >= 18;
      },
      message: "You must be at least 18 years old to register",
    },
  },
  occupation: {
    type: String,
    enum: ["job", "student"],
    required: true,
  },
  wallet: {
    type: Number,
    default: 0, // Default value for wallet balance
  },
}, {
  timestamps: true,
});

// Hash the password before saving it
TouristSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

const Tourist = mongoose.model("Tourist", TouristSchema);
module.exports = Tourist;