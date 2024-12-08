import models from "../models/index.model.js";
import { generateToken, comparePasswords } from "../utils/jwt.js";

const handleLogin = async (model, credentials, userType) => {
  console.log("entered handleLogin"); 
  const { username, email, password } = credentials;
  
  // Check if either username or email is provided
  if (!password || (!username && !email)) {
    throw new Error("Please provide either username or email, and password.");
  }

  let user;
  console.log("credentials is ", credentials);
  // Search by username if provided, otherwise search by email
  if (username) {
    user = await model.findOne({ username });
  } else {
    user = await model.findOne({ email });
  }
  if (!user) {
    throw new Error("Invalid credentials.");
  }
  console.log("user is ", user);  
  user = user.toObject();
  delete user.profilePhoto
  delete user.certificationImages
  delete user.idCardImage
  delete user.logo
  delete user.taxationRegistryImage
  delete user.companyProfile
  // Additional check for specific user types if no user is found
  
  console.log("backend userType is ", userType);
  // Check if the user is an advertiser, seller, or tour guide and if their status is accepted or rejected
  if (["advertiser", "seller", "tourguide"].includes(userType.toLowerCase())) {
    if (user.status === 'rejected') {
      throw new Error(`Your ${userType} account has been rejected by an admin. Please contact support for more information.`);
    }
    if (user.status !== 'accepted') {
      throw new Error(`Your ${userType} account has not been approved by an admin yet. Please check your login credentials or try again later.`);
    }
  }
  const isMatch = comparePasswords(password, user.password);
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
    console.error("Error logging in:", err);
    res.status(400).json({ message: err.message });
  }
};
// Registration Controller (Optional for each user type)
export const register = async (req, res) => {
  console.log("entered register");
  const { userType, username, email, ...userData } = req.body;
  console.log("userType is ", userType);
  console.log("company Profile is ", userData.companyProfile);

  if (!userType) {
    return res.status(400).json({ error: "userType is required." });
  }

  let model;
  switch (userType.toLowerCase()) {
    case "tourist":
        if (userData.dob) {
          const dob = new Date(userData.dob);
          const ageDifMs = Date.now() - dob.getTime();
          const ageDate = new Date(ageDifMs); // miliseconds from epoch
          const age = Math.abs(ageDate.getUTCFullYear() - 1970);

          if (age < 18) {
            return res.status(400).json({ error: "You must be at least 18 years old to register as a tourist." });
          }
        }
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
      return res.status(400).json({ error: "Invalid userType." });
  }

  try {
    const user = new model({ username, email, ...userData });
    await user.save();

    res.status(201).json({ message: "User registered successfully." });
  } catch (err) {
    console.error("Error registering user:", err);
    res.status(500).json({ error: "Internal server error." });
  }
};
