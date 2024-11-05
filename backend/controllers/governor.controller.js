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

export const changePassword = async (req, res) => {
    const { oldPassword, newPassword } = req.body;
    const userID = req.user.id;
    console.log("Change password request received with ID:", userID);
    try {
        // Search for the governor using the email
        const governor = await governorModel.findById(userID);
        if (!governor) {
            return res.status(404).json({ message: "Governor not found" });
        }
        // Check if the old password matches
        if (oldPassword !== governor.password) {
            return res.status(400).json({ message: "Old password is incorrect" });
        }

        // Check if the new password is the same as the old password
        if (newPassword === oldPassword) {
            return res.status(400).json({ message: "New password cannot be the same as the old password" });
        }

        // Update the password
        governor.password = newPassword;
        await governor.save();

        res.status(200).json({ message: "Password changed successfully" });
    } catch (error) {
        console.error("Error changing password:", error);
        res.status(500).json({ message: "Error changing password" });
    }
    
};
