import complaintModel from "../models/complaint.model.js";

// Create a new complaint, not used
export const createComplaint = async (req, res) => {
    console.log("entered createComplaint");
    try {
        const userId = req.user.id;
        let userType = req.user.userType;
        userType = userType.charAt(0).toUpperCase() + userType.slice(1).toLowerCase();
        const { title, body } = req.body;
        const newComplaint = new complaintModel({
            title,
            body,
            userId,
            userType
        });
        await newComplaint.save();
        console.log(newComplaint);
        res.status(201).json(newComplaint);
    } catch (error) {
        console.log("error:", error);
        res.status(400).json({ message: error.message });
    }
};
// Get all complaints
export const getAllComplaints = async (req, res) => {
    try {
        const complaints = await complaintModel.find();
        res.status(200).json(complaints);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Get a single complaint by ID
export const getComplaintById = async (req, res) => {
    try {
        const complaint = await complaintModel.findById(req.params.id);
        if (!complaint) {
            return res.status(404).json({ message: 'Complaint not found' });
        }
        res.status(200).json(complaint);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Update a complaint by ID
export const updateComplaint = async (req, res) => {
    try {
        const { title, body, status, reply } = req.body;
        const complaint = await complaintModel.findByIdAndUpdate(
            req.params.id,
            { title, body, status, reply },
            { new: true, runValidators: true }
        );
        if (!complaint) {
            return res.status(404).json({ message: 'Complaint not found' });
        }
        res.status(200).json(complaint);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete a complaint by ID
export const deleteComplaint = async (req, res) => {
    try {
        const complaint = await complaintModel.findByIdAndDelete(req.params.id);
        if (!complaint) {
            return res.status(404).json({ message: 'Complaint not found' });
        }
        res.status(200).json({ message: 'Complaint deleted successfully' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Get complaints by userId
export const getComplaintsByUserId = async (req, res) => {
    try {
        const userId = req.user.id;
        const complaints = await complaintModel.find({ userId });
        res.status(200).json(complaints);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};