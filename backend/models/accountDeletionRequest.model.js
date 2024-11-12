import mongoose from 'mongoose';

const accountDeletionRequestSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, required: true, refPath: 'userType' },
    userType: { type: String, required: true, enum: ['tourist', 'tourguide', 'advertiser', 'tourismGovernor', 'admin', 'seller'] },
    requestDate: { type: Date, default: Date.now },
    status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' },
});

const AccountDeletionRequest = mongoose.model('AccountDeletionRequest', accountDeletionRequestSchema);

export default AccountDeletionRequest;
