import dotenv from "dotenv"
import activityModel from "./models/activity.js";
import itineraryModel from "./models/itinerary.js";


dotenv.config({path: "../.env"});

const deleteEntity = async (req, res) => {
    const { entityType, id } = req.params;
    console.log("Delete request received for entity:", entityType, "with ID:", id);

    let Model;

    switch (entityType) {
        case 'admin':
            Model = Admin;
            break;
        case 'tourist':
            Model = Tourist;
            break;
        case 'tourGuide':
            Model = TourGuide;
            break;
        case 'advertiser':
            Model = Advertiser;
            break;
        case 'seller':
            Model = Seller;
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




export default {
    deleteEntity
}