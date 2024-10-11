import models from "../models/index.model.js";
import { generateToken, comparePasswords } from "../utils/jwt.js";

const handleLogin = async (username, model, email, password, userType) => {
  console.log("the email is  ", email);
  // If admin, search by username; otherwise, search by email
  let user;

  if (model === models.governorModel) {
    user = await model.findOne({ username });
  } else {
    user = await model.findOne({ email });
  }

  console.log(user);
  if (!user) {
    throw new Error("Invalid username or password.");
  }

  const isMatch = comparePasswords(user.password, password);
  if (!isMatch) {
    throw new Error("Invalid email or password.");
  }

  const token = generateToken(user, userType);
  return token;
};
// Login Controller
export const login = async (req, res) => {
  console.log("entered  login");

  const { username, email, password, userType } = req.body;

  if (!email || !password || !userType) {
    return res
      .status(400)
      .json({ message: "Email, password, and userType are required." });
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
    case "tourism governor": // New case for Tourism Governor
    case "tourism_governor":
      model = models.governorModel; // Ensure you have this model defined
      break;
    case "admin":
      model = models.adminModel; // Ensure you have this model defined
      break;
    default:
      return res.status(400).json({ message: "Invalid userType." });
  }

  try {
    console.log(email);
    const token = await handleLogin(username, model, email, password, userType);
    res.status(200).json({ token });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Registration Controller (Optional for each user type)
export const register = async (req, res) => {
  console.log("entered register");
  const { userType, ...userData } = req.body;

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
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
