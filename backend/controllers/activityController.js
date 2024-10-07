import activityModel from "../models/activity.js";


const createActivity = async (req, res) =>{
    const { name, date, time, location, price, category, tags, specialDiscounts, bookingOpen, userId, rating } = req.body;
try {
    if (!name)
        return res.status(400).json({ message: "Missing name" });
    if (!date)
        return res.status(400).json({ message: "Missing date" });
    if (!time)
        return res.status(400).json({ message: "Missing time" });
    if (!location)
        return res.status(400).json({ message: "Missing location" });
    if (!price)
        return res.status(400).json({ message: "Missing price" });
    if (!category)
        return res.status(400).json({ message: "Missing category" });
    if (!tags)
        return res.status(400).json({ message: "Missing tags" });
    if (specialDiscounts === undefined)
        return res.status(400).json({ message: "Missing special discounts" });
    if (bookingOpen === undefined)
        return res.status(400).json({ message: "Missing booking open status" });
        
        const activity = await activityModel.create({name, date, time, location, price, category, tags, specialDiscounts, bookingOpen, userId, rating})
        res.status(201).json(activity);
    }catch(err){
        res.status(500).json(err);
    }
}

const getActivities = async (req, res) =>{
    try {
        const activities = await activityModel.find()
        if (activities.length === 0) 
            return res.status(200).json({ message: "No current activities" });
        return res.status(200).json(activities);
    } catch (error) {
        console.error("Error fetching activities:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

const getActivitiesByUserID = async (req, res) =>{
    const id = req.user.id;
    if(!id)
        return res.status(400).json({ message: "Missing ID" });
    try {
        const query = { userId: id };
        const activity = await activityModel.find(query);
        if (!activity) 
            return res.status(404).json({ message: "Activity not found" });
        return res.status(200).json(activity);
    } catch (error) {
        console.error("Error fetching activity:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

const updateActivity = async (req, res) =>{
    const id = req.params.id;
    if(!id)
        return res.status(400).json({ message: "Missing ID" });
    const {updates} = req.body;
    if(!updates)
        return res.status(400).json({ message: "Update one field at least" });
    try{
        const options = { new: true }; // Return the updated document
        
        const activity = await activityModel.findByIdAndUpdate(id, updates, options)
        if(!activity)
            return res.status(404).json({ message: "Activity not found" });
        return res.status(200).json(activity);

    } catch (error) {
        console.error("Error fetching activity:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

const deleteActivity = async (req, res) => {
    const id = req.params.id;
    if (!id) 
        return res.status(400).json({ message: "Missing ID" });
    
    try {
        const activity = await activityModel.findByIdAndDelete(id);
        
        if (!activity) {
            return res.status(404).json({ message: "Activity not found" });
        }

        return res.status(200).json({ message: "Activity deleted successfully", activity });

    } catch (error) {
        console.error("Error deleting activity:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};


const activityController = {
    createActivity,
    getActivities,
    getActivitiesByUserID,
    updateActivity,
    deleteActivity
}

export default activityController;