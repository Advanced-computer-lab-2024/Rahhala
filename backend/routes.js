import dotenv from "dotenv"
import models from "./models/index.js";
import bcrypt from "bcrypt";
import mongoose from "mongoose";

dotenv.config({path: "../.env"});




const getAll = async (req, res) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Set the time to the start of the day
        const activities = await models.activityModel.find({ date: { $gte: today } });
        const itineraries = await models.itineraryModel.find({availableDates: { $elemMatch: { $gte: today } }});
        const museums = await models.museumModel.find();
        res.status(200).json({ activities, itineraries, museums });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

const filterActivities = async (req, res) => {
    const { minPrice, maxPrice, minDate, maxDate, categories, minRating, maxRating } = req.query;

    // Initialize filter object
    let filter = {};

    // Add price range to filter
    if (minPrice) filter.price = { ...filter.price, $gte: minPrice };
    if (maxPrice) filter.price = { ...filter.price, $lte: maxPrice };

    // Add date range to filter
    if (minDate) filter.date = { ...filter.date, $gte: new Date(minDate) };
    if (maxDate) filter.date = { ...filter.date, $lte: new Date(maxDate) };

    // Add categories to filter
    if (categories) filter.categories = { $in: categories.split(',') };

    // Add rating range to filter
    if (minRating) filter.rating = { ...filter.rating, $gte: minRating };
    if (maxRating) filter.rating = { ...filter.rating, $lte: maxRating };

    try {
        // Query the activities model with the filter
        const activities = await Activity.find(filter);
        res.status(200).json(activities);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
export default {
    deleteEntity,
    addGovernor,
    addAdmin,
    createCategory,
    getCategories,
    updateCategory,
    deleteCategory,
    getAll
}