import sellerModel from "../models/seller.js";

const getSeller = async (req, res) => {
    const { email } = req.params;

    try {
        const seller = await Seller.findOne({ email });

        if (!seller || !seller.profileCreated) {
        return res.status(404).json({ error: "Seller profile not found or not created yet" });
        }

        res.status(200).json({ profile: seller });
    } catch (error) {
        res.status(500).json({ error: "Error fetching seller profile" });
    }
};

const updateSeller = async (req, res) => {

    const { email, name, description } = req.body;

    try {
        const seller = await sellerModel.findOne({ email });

        if (!seller) {
        return res.status(404).json({ error: "Seller not found" });
        }

        // Update seller's profile details
        seller.name = name || seller.name;
        seller.description = description || seller.description;
        seller.profileCreated = true;

        await seller.save();
        res.status(200).json({ message: "Seller profile updated successfully", profile: seller });
    } catch (error) {
        res.status(500).json({ error: "Error updating seller profile" });
    }
};

const sellerController = {
    updateSeller,
    getSeller
};

export default sellerController;