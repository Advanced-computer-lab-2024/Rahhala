import advertiserModel from "../models/advertiser.js";



const updateAdvertiser = async (req, res) => {

    const { email, companyName, website, hotline, companyProfile } = req.body;

    try {
    const advertiser = await advertiserModel.findOne({ email });

    if (!advertiser) {
        return res.status(404).json({ error: "Advertiser not found" });
    }

    // Update advertiser's profile details
    advertiser.companyName = companyName || advertiser.companyName;
    advertiser.website = website || advertiser.website;
    advertiser.hotline = hotline || advertiser.hotline;
    advertiser.companyProfile = companyProfile || advertiser.companyProfile;
    advertiser.profileCreated = true;

    await advertiser.save();
    res.status(200).json({ message: "Advertiser profile updated successfully", profile: advertiser });
    } catch (error) {
    res.status(500).json({ error: "Error updating advertiser profile" });
    }
};

const getAdvertiser = async (req, res) => {

    const { email } = req.params;

    try {
    const advertiser = await Advertiser.findOne({ email });

    if (!advertiser || !advertiser.profileCreated) {
        return res.status(404).json({ error: "Advertiser profile not found or not created yet" });
    }

    res.status(200).json({ profile: advertiser });
    } catch (error) {
    res.status(500).json({ error: "Error fetching advertiser profile" });
    }
};

const advertiserController = {
    updateAdvertiser,
    getAdvertiser
};



export default advertiserController;