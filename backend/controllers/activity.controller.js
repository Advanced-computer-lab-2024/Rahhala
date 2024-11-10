import activityModel from "../models/activity.model.js";

//Add Activity to the Database
export const addActivity = async (req, res) => {
  console.log("entered addActivity");

  const userId = req.user.id;
  const {
    name,
    date,
    time,
    location,
    price,
    category,
    tags,
    specialDiscounts,
  } = req.body;
  try {
    if (!name) return res.status(400).json({ message: "Missing name" });
    if (!date) return res.status(400).json({ message: "Missing date" });
    if (!time) return res.status(400).json({ message: "Missing time" });
    if (!location) return res.status(400).json({ message: "Missing location" });
    if (!price) return res.status(400).json({ message: "Missing price" });
    if (!category) return res.status(400).json({ message: "Missing category" });
    if (!tags) return res.status(400).json({ message: "Missing tags" });

    const activity = await activityModel.create({
      name,
      date,
      time,
      location,
      price,
      category,
      tags,
      specialDiscounts,
      userId,
    });
    res.status(201).json(activity);
  } catch (err) {
    res.status(500).json(err);
  }
};

//Get Activities from the Database
export const getActivities = async (req, res) => {
  console.log("entered getActivities");

  try {
    const activities = await activityModel.find();
    if (activities.length === 0)
      return res.status(200).json({ message: "No current activities" });
    return res.status(200).json(activities);
  } catch (error) {
    console.error("Error fetching activities:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

//Get Activities of User by User ID
export const getActivitiesByUserID = async (req, res) => {
  console.log("entered getActivitiesByUserID");

  const id = req.user.id;
  if (!id) return res.status(400).json({ message: "Missing ID" });
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
};

//Edit Activity Information
export const editActivity = async (req, res) => {
  console.log("entered editActivity");

  const id = req.params.id;
  if (!id) return res.status(400).json({ message: "Missing ID" });
  const {
    name,
    date,
    time,
    location,
    price,
    category,
    tags,
    specialDiscounts,
    bookingOpen,
  } = req.body;
  try {
    const activity = await activityModel.findById(id);
    if (!activity)
      return res.status(404).json({ message: "Activity not found" });

    activity.name = name || activity.name;
    activity.date = date || activity.date;
    activity.time = time || activity.time;
    activity.location = location || activity.location;
    activity.price = price || activity.price;
    activity.category = category || activity.category;
    activity.tags = tags || activity.tags;
    activity.specialDiscounts = specialDiscounts || activity.specialDiscounts;
    activity.bookingOpen = bookingOpen || activity.bookingOpen;
    await activity.save();

    return res.status(200).json(activity);
  } catch (error) {
    console.error("Error fetching activity:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

//Delete Activity from Database
export const deleteActivity = async (req, res) => {
  console.log("entered deleteActivity");

  const id = req.params.id;
  if (!id) return res.status(400).json({ message: "Missing ID" });

  try {
    const activity = await activityModel.findByIdAndDelete(id);

    if (!activity) {
      return res.status(404).json({ message: "Activity not found" });
    }

    return res
      .status(200)
      .json({ message: "Activity deleted successfully", activity });
  } catch (error) {
    console.error("Error deleting activity:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

//Get Activity by ID
export const getActivityById = async (req, res) => {
    console.log("entered getActivityById");

    const id = req.params.id;
    if (!id) return res.status(400).json({ message: "Missing ID" });

    try {
        const activity = await activityModel.findById(id);
        if (!activity)
            return res.status(404).json({ message: "Activity not found" });
        return res.status(200).json(activity);
    } catch (error) {
        console.error("Error fetching activity:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};
