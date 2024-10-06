import adminModel from "../models/admin.js";
import models from "../models/index.js";

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
        const newAdmin = await adminModel.create({
            username, 
            password,
            
        });

        res.status(201).json({ message: 'Admin added successfully' });
    } catch (error) {
        console.error('Error adding admin:', error);
        res.status(500).json({ message: 'Error adding admin' });
    }
};

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

const adminController = {
    addAdmin,
    deleteEntity
};

export default adminController;