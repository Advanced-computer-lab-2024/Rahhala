import governorModel from "../models/governor.model.js";

// Add Governor to the Database
export const addGovernor = async (req, res) => {
  console.log("entered  addGovernor");

  const { username, password } = req.body;
  try {
    console.log("herer");
    console.log("username", username);
    // Check if the username already exists
    const existingGovernor = await governorModel.findOne({ username });
    if (existingGovernor) {
      return res.status(400).json({ message: "Username already exists" });
    }
    console.log("here");

    const newGovernor = await governorModel.create({ username, password });

    res.status(201).json({ message: "Governor created successfully" });
  } catch (error) {
    console.error("Error adding governor:", error);
    res.status(500).json({ message: "Error adding governor" });
  }
};
