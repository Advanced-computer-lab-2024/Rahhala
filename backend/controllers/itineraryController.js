import itineraryModel from "../models/itinerary.js";


const createItinerary = async (req, res) => {
    try {
        console.log('entered createItinerary');
        const { name, activities, timeline, language, price, availableDates, accessibility, pickupLocation, dropoffLocation, tags } = req.body;
        const userId = req.user.id; // Assuming `req.user` is set by JWT middleware
        console.log(userId);
        const itinerary = new itineraryModel({
            name,
            activities,
            timeline,
            language,
            price,
            availableDates,
            accessibility,
            pickupLocation,
            dropoffLocation,
            tags,
            userId: userId
        });

        await itinerary.save();
        res.status(201).json(itinerary);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};


const getAllItineraries = async (req, res) => {
    try {
        const itineraries = await itineraryModel.find()
            .populate('activities', 'name location duration') 
           // .populate('tags', 'name'); 

        res.status(200).json(itineraries);
    } catch (err) {
        console.error("Error fetching itineraries:", err);
        res.status(500).json({ error: "Internal server error" });
    }
};


const getItineraryById = async (req, res) => {
    try {
        const { id } = req.params;
        const itinerary = await itineraryModel.findById(id)
            .populate('activities', 'name location duration') 
            .populate('tags', 'name'); 

        

        res.status(200).json(itinerary);
    } catch (err) {
        console.error("Error fetching itinerary:", err);
        res.status(500).json({ error: "Internal server error" });
    }
};

const getItineraryByUserID = async (req, res) =>{
    const id = req.user.id;
    if(!id)
        return res.status(400).json({ message: "Missing ID" });
    try {
        const query = { userId: id };
        const itinerary = await itineraryModel.find(query);
        if (!activity) 
            return res.status(404).json({ message: "itinerary not found" });
        return res.status(200).json(itinerary);
    } catch (error) {
        console.error("Error fetching itinerary:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

const updateItinerary = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        const updatedItinerary = await itineraryModel.findByIdAndUpdate(id, updates, {
            new: true,
            runValidators: true,
        })
        .populate('activities', 'name location duration')
        //.populate('tags', 'name'); 

        if (!updatedItinerary) {
            return res.status(404).json({ message: "Itinerary not found" });
        }

        res.status(200).json(updatedItinerary);
    } catch (err) {
        console.error("Error updating itinerary:", err);
        res.status(400).json({ error: err.message });
    }
};



const deleteItinerary = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedItinerary = await itineraryModel.findByIdAndDelete(id);

        if (!deletedItinerary) {
            return res.status(404).json({ message: "Itinerary not found" });
        }

        res.status(200).json({ message: "Itinerary deleted successfully" });
    } catch (err) {
        console.error("Error deleting itinerary:", err);
        res.status(500).json({ error: "Internal server error" });
    }
};

const deleteItineraryByName = async (req, res) => {
    try {
        console.log("entered deleteItineraryByName");
        const { name } = req.params; // Get the name from the request parameters
        console.log(name);
        const deletedItinerary = await itineraryModel.findOneAndDelete({ name }); // Find and delete itinerary by name

        if (!deletedItinerary) {
            return res.status(404).json({ message: "Itinerary not found" });
        }

        res.status(200).json({ message: "Itinerary deleted successfully" });
    } catch (err) {
        console.error("Error deleting itinerary by name:", err);
        res.status(500).json({ error: "Internal server error" });
    }
};


const updateItineraryByName = async (req, res) => {
    try {
        const { name } = req.params; // Get the name from the request parameters
        const updates = req.body; // Get the updates from the request body

        const updatedItinerary = await itineraryModel.findOneAndUpdate(
            { name }, // Find itinerary by name
            updates,
            {
                new: true,
                runValidators: true,
            }
        )
        .populate('activities', 'name location duration');

        if (!updatedItinerary) {
            return res.status(404).json({ message: "Itinerary not found" });
        }

        res.status(200).json(updatedItinerary);
    } catch (err) {
        console.error("Error updating itinerary by name:", err);
        res.status(400).json({ error: err.message });
    }
};


const itineraryController = {
    createItinerary,
    getAllItineraries,
    getItineraryById,
    getItineraryByUserID,
    updateItinerary,
    deleteItinerary,
    deleteItineraryByName,
    updateItineraryByName
};

export default itineraryController;