import sellerModel from "../models/seller.js";

const getSeller = async (req, res) => {
    const id = req.user.id;

    try {
        const seller = await sellerModel.findById(id);

        if (!seller) {
        return res.status(404).json({ error: "Seller profile not found" });
        }

        res.status(200).json({ profile: seller });
    } catch (error) {
        res.status(500).json({ error: "Error fetching seller profile" });
    }
};

const updateSeller = async (req, res) => {
    const id = req.user.id;
    const { email, name, description, username } = req.body;

    try {
        const seller = await sellerModel.findById(id);

        if (!seller) {
        return res.status(404).json({ error: "Seller not found" });
        }

        // Update seller's profile details
        seller.name = name || seller.name;
        seller.description = description || seller.description;
        seller.email = email || seller.email;
        seller.username = username || seller.username;
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