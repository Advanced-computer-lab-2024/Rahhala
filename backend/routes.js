import dotenv from "dotenv"
import models from "./models/index.js";
import bcrypt from "bcrypt";
import mongoose from "mongoose";

dotenv.config({path: "../.env"});

const deleteEntity = async (req, res) => {
    const { entityType, id } = req.params;
    console.log("Delete request received for entity:", entityType, "with ID:", id);

    let Model;

    switch (entityType) {
        case 'admin':
            Model = models.adminModel;
            break;
        case 'governer':
            Model = models.governerModel;
            break;
        case 'tourist':
            Model = models.touristModel;
            break;
        case 'tourGuide':
            Model = models.tourGuideModel;
            break;
        case 'advertiser':
            Model = models.advertiserModel;
            break;
        case 'seller':
            Model = models.sellerModel;
            break;
        default:
            return res.status(400).json({ message: 'Invalid entity type' });
    }

    try {
        const entity = await Model.findByIdAndDelete(id);
        if (!entity) {
            return res.status(404).json({ message: `${entityType} not found` });
        }
        res.status(200).json({ message: `${entityType} deleted successfully` });
    } catch (error) {
        console.error(`Error deleting ${entityType}:`, error);
        res.status(500).json({ message: `Error deleting ${entityType}` });
    }
};

const addGovernor = async (req, res) => {
    const {username, password} = req.body;
    try {
        // Check if the username already exists
        const existingGovernor = await models.governorModel.findOne({ username });
        if (existingGovernor) {
            return res.status(400).json({ message: 'Username already exists' });
        }

        // Hash the password before saving (optional)
        // const hashedPassword = await bcrypt.hash(password, 10);

        // Create the new governor
        const newGovernor = await models.governorModel.create({username, password});

        res.status(201).json({ message: 'Governor created successfully' });
    } catch (error) {
        console.error("Error adding governor:", error);
        res.status(500).json({ message: 'Error adding governor' });
    }
};


const addAdmin = async (req, res) => {
    const { username, password, name, email } = req.body;

    try {
        // Check if username already exists
        const existingAdmin = await models.adminModel.findOne({ username });
        if (existingAdmin) {
            return res.status(400).json({ message: 'Username already exists' });
        }

        // Hash the password
        // const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new admin instance
        const newAdmin = await models.adminModel.create({
            username, 
            password,
            
        });

        res.status(201).json({ message: 'Admin added successfully' });
    } catch (error) {
        console.error('Error adding admin:', error);
        res.status(500).json({ message: 'Error adding admin' });
    }
};


const createCategory = async (req, res) => {
    const { name } = req.body;
    if (!name) {
        return res.status(400).json({ error: "Name is required" });
    }
    try {
        const category = await models.categoryModel.create({ name });
        res.status(201).json(category);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const getCategories = async (req, res) => {
    try {
        const categories = await models.categoryModel.find({}).sort({ createdAt: -1 });

        if (categories.length === 0) {
            return res.status(404).json({ error: "No categories found" });
        }

        for (let index = 0; index < categories.length; index++) {
            const element = categories[index];
        }

        res.status(200).json(categories);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const updateCategory = async (req, res) => {
    const { id } = req.params;
    const { name } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: "Invalid category ID format" });
    }

    try {
        const updatedCategory = await models.categoryModel.findByIdAndUpdate(
            id,
            { name },
            { new: true, runValidators: true }
        );

        if (!updatedCategory) {
            return res.status(404).json({ error: "Category not found" });
        }

        res.status(200).json(updatedCategory);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const deleteCategory = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: "Invalid category ID format" });
    }

    try {
        const deletedCategory = await models.categoryModel.findByIdAndDelete(id);

        if (!deletedCategory) {
            return res.status(404).json({ error: "Category not found" });
        }

        res.status(200).json({ message: "Category deleted successfully" });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};


export default {
    deleteEntity,
    addGovernor,
    addAdmin,
    createCategory,
    getCategories,
    updateCategory,
    deleteCategory
}