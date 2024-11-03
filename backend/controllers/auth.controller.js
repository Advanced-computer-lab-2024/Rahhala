import models from "../models/index.model.js";
import { generateToken, comparePasswords } from "../utils/jwt.js";

const handleLogin = async (model, credentials, userType) => {
  const { username, email, password } = credentials;
  
  // Check if either username or email is provided
  if (!password || (!username && !email)) {
    throw new Error("Please provide either username or email, and password.");
  }

  let user;
  // Search by username if provided, otherwise search by email
  if (username) {
    user = await model.findOne({ username });
  } else {
    user = await model.findOne({ email });
  }

  if (!user) {
    throw new Error("Invalid credentials.");
  }

  const isMatch = await comparePasswords(user.password, password);
  if (!isMatch) {
    throw new Error("Invalid credentials.");
  }

  const token = generateToken(user, userType);
  return token;
};

// Login Controller
export const login = async (req, res) => {
  console.log("entered login");

  const { username, email, password, userType } = req.body;

  // Check if at least one identifier (username or email) is provided
  if ((!username && !email) || !password || !userType) {
    return res.status(400).json({ 
      message: "Please provide either username or email, along with password and userType." 
    });
  }

  let model;
  switch (userType.toLowerCase()) {
    case "tourist":
      model = models.touristModel;
      break;
    case "tour guide":
    case "tourguide":
      model = models.tourGuideModel;
      break;
    case "advertiser":
      model = models.advertiserModel;
      break;
    case "seller":
      model = models.sellerModel;
      break;
    case "tourism governor":
    case "tourism_governor":
      model = models.governorModel;
      break;
    case "admin":
      model = models.adminModel;
      break;
    default:
      return res.status(400).json({ message: "Invalid userType." });
  }

  try {
    const credentials = { username, email, password };
    const token = await handleLogin(model, credentials, userType);
    res.status(200).json({ token });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
// Registration Controller (Optional for each user type)
export const register = async (req, res) => {
  console.log("entered register");
  const { userType, ...userData } = req.body;
  console.log("userType is ", userType);
  console.log("userData is ", userData);

  if (!userType) {
    return res.status(400).json({ message: "userType is required." });
  }

  let model;
  switch (userType.toLowerCase()) {
    case "tourist":
      model = models.touristModel;
      break;
    case "tour guide":
    case "tourguide":
      model = models.tourGuideModel;
      break;
    case "advertiser":
      model = models.advertiserModel;
      break;
    case "seller":
      model = models.sellerModel;
      break;
    default:
      return res.status(400).json({ message: "Invalid userType." });
  }

  try {
    const user = new model(userData);
    await user.save();

    const token = generateToken(user, userType);
    res.status(201).json({ token });
    console.log(token);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};