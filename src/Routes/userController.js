// #Task route solution
const userModel = require('../Models/User.js');
const { default: mongoose } = require('mongoose');

const createUser = async (req, res) => {
   try {
      const { Name, Email, Age,G } = req.body;
      const newUser = new userModel({ Name, Email, Age,G });
      await newUser.save();
      res.status(201).json({ message: "User created successfully", user: newUser });
   } catch (error) {
      res.status(500).json({ message: "Error creating user", error });
   }
}

const getUsers = async (req, res) => {
   try {
      const users = await userModel.find();
      res.status(200).json(users);
   } catch (error) {
      res.status(500).json({ message: "Error retrieving users", error });
   }
}

const updateUser = async (req, res) => {
   try {
      const { id } = req.body;
      const updatedUser = await userModel.findByIdAndUpdate(id, req.body, { new: true });
      if (!updatedUser) return res.status(404).json({ message: "User not found" });
      res.status(200).json({ message: "User updated successfully", user: updatedUser });
   } catch (error) {
      res.status(500).json({ message: "Error updating user", error });
   }
}
const updateAllUsers = async (req, res) => {
   try {
      const updateFields = req.body;  // Get the fields to update from the request body

      const result = await userModel.updateMany({}, updateFields, { new: true });
      
      if (result.nModified === 0) {
         return res.status(404).json({ message: "No users found or no updates applied" });
      }

      res.status(200).json({ message: `Updated ${result.nModified} users successfully` });
   } catch (error) {
      res.status(500).json({ message: "Error updating users", error });
   }
}
const deleteUser = async (req, res) => {
   try {
      const { id } = req.body;
      const deletedUser = await userModel.findByIdAndDelete(id);
      if (!deletedUser) return res.status(404).json({ message: "User not found" });
      res.status(200).json({ message: "User deleted successfully" });
   } catch (error) {
      res.status(500).json({ message: "Error deleting user", error });
   }
}

module.exports = { createUser, getUsers, updateUser, deleteUser,updateAllUsers };
