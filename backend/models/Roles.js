const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const RoleSchema = new mongoose.Schema({
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
    enum: ["tour_guide", "advertiser", "seller"],
    required: true,
  },

  // Fields for all roles
  mobileNumber: {
    type: String,
    match: [/^\d{10,15}$/, "Invalid mobile number"],
  },
  profileCreated: {
    type: Boolean,
    default: false,
  },

  // Fields specific to tour guides
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

  // Fields specific to advertisers
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

  // Fields specific to sellers
  name: {
    type: String,
    trim: true,
  },
  description: {
    type: String,
  },
}, {
  timestamps: true,
});

// Hash the password before saving it
RoleSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

const Role = mongoose.model("Role", RoleSchema);
module.exports = Role;
