import museumModel from "../models/museum.js";

const createMuseum = async (req, res) => {
    const { name, description, pictures, location, openingHours, foreignerPrice, nativePrice, studentPrice} = req.body;

    try {
        const museum = await museumModel.create({ 
            name, 
            description, 
            pictures, 
            location, 
            openingHours, 
            studentPrice,
            foreignerPrice,
            nativePrice
        });
        res.status(201).json(museum);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const getAllMuseums = async (req, res) => {
    try {
        const museum = await museumModel.find();
        if (!museum) {
            return res.status(404).json({ message: "Museum not found" });
        }
        res.status(200).json(museum);
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
};

const getMuseumsByUserID = async (req, res) =>{
    const id = req.user.id;
    if(!id)
        return res.status(400).json({ message: "Missing ID" });
    try {
        const query = { userId: id };
        const museum = await museumModel.find(query);
        if (!activity) 
            return res.status(404).json({ message: "museum not found" });
        return res.status(200).json(museum);
    } catch (error) {
        console.error("Error fetching museum:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}


const updateMuseum = async (req, res) => {
    const {id} = req.params;
    const updates = req.body;
    try {
        const updatedMuseum = await museumModel.findByIdAndUpdate(id, updates, { new: true });
        if (!updatedMuseum) {
            return res.status(404).json({ message: "Museum not found" });
        }
        res.status(200).json(updatedMuseum);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const deleteMuseum = async (req, res) => {
    const { id } = req.params;

    try {
        const museum = await museumModel.findByIdAndDelete(id);
        if (!museum) {
            return res.status(404).json({ message: "Museum not found" });
        }
        res.status(200).json({ message: "Museum deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const museumController = {
    createMuseum,
    getAllMuseums,
    getMuseumsByUserID,
    updateMuseum,
    deleteMuseum
};

export default museumController;