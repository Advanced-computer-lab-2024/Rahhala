const mongoose = require("mongoose")
const dotenv = require("dotenv")
const activityModel = require("./models/activity")



dotenv.config({path: "../.env"});

const createUser = async (req, res, conn) =>{
    console.log("Post request received");
    const {Name,Age} = req.body;
    console.log("Name:", Name, "Age:", Age);
    res.status(200).json("success")

}

const createActivity = async (req, res, conn) =>{
    console.log("create Activity request received");
    const {date, time, location, price, category, tags, specialDiscounts, bookingOpen} = req.body;
    try{
        const activity = await activityModel.create({date, time, location, price, category, tags, specialDiscounts, bookingOpen})
        res.status(201).json(activity);
    }catch(err){
        res.status(400).json(err);
    }
}


const getActivity = async (req, res, conn) =>{
    console.log("Get activity request received");
    const {date, time, location, price, category, tags, specialDiscounts, bookingOpen} = req.body;

    try {
        // Build the query object based on provided parameters
        const query = {};

        if (date) query.date = date;
        if (time) query.time = time;
        if (location) query.location = location;
        if (price) query.price = price;
        if (category) query.category = category;
        if (tags) query.tags = { $in: tags }; // Assuming tags is an array
        if (specialDiscounts) query.specialDiscounts = { $gte: specialDiscounts }; // Example condition for discounts
        if (bookingOpen !== undefined) query.bookingOpen = bookingOpen;

        // Fetch the activity from the database
        const activity = await conn.model('Activity').findOne(query);

        if (!activity) {
            return res.status(404).json({ message: "Activity not found" });
        }

        // Send the found activity as a response
        return res.status(200).json(activity);
    } catch (error) {
        console.error("Error fetching activity:", error);
        return res.status(500).json({ message: "Internal server error" });
    }

}



module.exports = {createUser, createActivity, getActivity}