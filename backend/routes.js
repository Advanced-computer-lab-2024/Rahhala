const mongoose = require("mongoose")
const dotenv = require("dotenv")
const activityModel = require("./models/activity")
const itineraryModel = require("./models/itinerary")


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

const createItinerary = async (req, res, conn) =>{
    console.log("create Activity request received");
    const {budget, date, tags, language,activities,price,ratings} = req.body;
    try{
        const itinerary = await itineraryModel.create({budget, date, tags, language, activities,price,ratings})
        res.status(201).json(itinerary);
    }catch(err){
        res.status(400).json(err);
    }
}

const getItinerary1 = async (req, res, conn) =>{
    console.log("Get itinerary request received");
    const {budget, date, tags, language,activities} = req.body;

    try {
        // Build the query object based on provided parameters
        const query = {};

        if (date) query.date = date;
        if (budget) query.budget = budget;
        if (language) query.language = language;
        if (tags) query.tags = { $in: tags }; 
        if (activities) query.activities = { $in: activities};

        
        const itinerary = await conn.model('Itinerary').findOne(query);

        if (!itinerary) {
            return res.status(404).json({ message: "Itinerary not found" });
        }

  
        return res.status(200).json(itinerary);
    } catch (error) {
        console.error("Error fetching itinerary:", error);
        return res.status(500).json({ message: "Internal server error" });
    }

}

const getItinerary2 = async (req, res, conn) =>{
    console.log("Get itinerary request received");
    const { price, ratings} = req.body;

    try {
        // Build the query object based on provided parameters
        const query = {};

      
        if (price) query.category = price;
        if (ratings) query.ratings = ratings;
       

        
        const itinerary = await conn.model('Itinerary').findOne(query);

        if (!itinerary) {
            return res.status(404).json({ message: "Itinerary not found" });
        }

  
        return res.status(200).json(itinerary);
    } catch (error) {
        console.error("Error fetching itinerary:", error);
        return res.status(500).json({ message: "Internal server error" });
    }

}


module.exports = {createUser, createActivity, getActivity, getItinerary1, createItinerary,getItinerary2 }