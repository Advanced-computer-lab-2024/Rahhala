import AccountDeletionRequestModel from "../models/accountDeletionRequest.model.js";

// Create a new account deletion request
export const createAccountDeletionRequest = async (req, res) => {
    console.log("entered createAccountDeletionRequest");
    const userId = req.user.id;
    const userType = req.user.userType;
    console.log("userId is ", userId);
    console.log("userType is ", userType);

    try {
        // Check if a request with this user ID and user type already exists
        const existingRequest = await AccountDeletionRequestModel.findOne({ userId, userType });
        if (existingRequest) {
            return res.status(400).json({ error: "An account deletion request already exists." });
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

// Get all account deletion requests
export const getAllAccountDeletionRequests = async (req, res) => {
    try {
        const requests = await AccountDeletionRequestModel.find();
        res.status(200).json(requests);
    } catch (error) {
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


