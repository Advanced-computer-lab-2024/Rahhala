import models from "../models/index.model.js";
import tourGuideRequestModel from "../models/tourGuideRequest.model.js";
import sellerRequestModel from "../models/sellerRequest.model.js";
import advertiserRequestModel from "../models/advertiserRequest.model.js";
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
    console.log("entered username");
    user = await model.findOne({ username });
  } else {
    user = await model.findOne({ email });
  }
  console.log("username is ", username);
  console.log("email is ", email);
  console.log("model is", model);
  console.log("user is ", user);  

   // Additional check for specific user types if no user is found
   if (!user) {
    if (["advertiser", "seller", "tour guide"].includes(userType.toLowerCase())) {
      throw new Error(`Your ${userType} account has not been approved by an admin yet., check your login credentials or try again later.`);
    } else {
      throw new Error("Invalid credentials.");
    }
  }

  const isMatch = comparePasswords(user.password, password);
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
  console.log(req.body);

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
  console.log("model is ", model);

  try {
    const credentials = { username, email, password };
    const token = await handleLogin(model, credentials, userType);
    console.log("token is ", token);
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
      model = tourGuideRequestModel;
      break;
    case "advertiser":
      model = advertiserRequestModel;
      break;
    case "seller":
      model = sellerRequestModel;
      break;
    default:
      return res.status(400).json({ message: "Invalid userType." });
  }

  try {
    const user = new model(userData);
    await user.save();
    if(model == models.touristModel){
    const token = generateToken(user, userType);
    res.status(201).json({ token });
    console.log(token);
    }
    else{
      res.status(201).json({ message: "your account creation request was submitted succesfully you will be admitted to the system once an admin apporves", user });
    }
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
