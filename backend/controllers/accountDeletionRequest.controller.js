import AccountDeletionRequestModel from "../models/accountDeletionRequest.model.js";
import accountDeletionRequestModel from '../models/accountDeletionRequest.model.js';
import activityModel from '../models/activity.model.js';
import itineraryModel from '../models/itinerary.model.js';

export const getAllAccountDeletionRequests = async (req, res) => {
    try {
        const requests = await accountDeletionRequestModel.find();
        res.status(200).json(requests);
    } catch (error) {
        console.error('Error fetching account deletion requests:', error);
        res.status(500).json({ message: 'Error fetching account deletion requests' });
    }
};
// Create a new account deletion request
export const createAccountDeletionRequest = async (req, res) => {
    console.log("entered createAccountDeletionRequest");
    const userId = req.user.id;
    const userType = req.user.userType
    try {
        const existingRequest = await AccountDeletionRequestModel.findOne({ userId });
        if (existingRequest) {
            return res.status(409).json({ error: "Account already made an account deletion request" });
        }
        const newRequest = new AccountDeletionRequestModel({
            userId,
            userType,
        });
        await newRequest.save();
        res.status(201).json(newRequest);
    } catch (error) {
        console.log("Error creating account deletion request:", error); 
        res.status(500).json({ error: error.message });
    }
};



// Get a single account deletion request by ID
export const getAccountDeletionRequestById = async (req, res) => {
    try {
        const request = await AccountDeletionRequestModel.findById(req.params.id);
        if (!request) {
            return res.status(404).json({ error: 'Request not found' });
        }
        res.status(200).json(request);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update an account deletion request by ID
export const updateAccountDeletionRequestById = async (req, res) => {
    try {
        const updatedRequest = await AccountDeletionRequestModel.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!updatedRequest) {
            return res.status(404).json({ error: 'Request not found' });
        }
        res.status(200).json(updatedRequest);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Delete an account deletion request by ID
export const deleteAccountDeletionRequestById = async (req, res) => {
    try {
        const deletedRequest = await AccountDeletionRequestModel.findByIdAndDelete(req.params.id);
        if (!deletedRequest) {
            return res.status(404).json({ error: 'Request not found' });
        }
        res.status(200).json({ message: 'Request deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


