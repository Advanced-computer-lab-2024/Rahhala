import mongoose from 'mongoose';

const accountDeletionRequestSchema = new mongoose.Schema({
  touristId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Tourist' },
  requestDate: { type: Date, default: Date.now },
  status: { type: String, default: 'Pending' }, // e.g., Pending, Approved, Rejected
});

const AccountDeletionRequest = mongoose.model('AccountDeletionRequest', accountDeletionRequestSchema);

export default AccountDeletionRequest;
