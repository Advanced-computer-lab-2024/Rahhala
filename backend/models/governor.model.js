import mongoose from "mongoose";

const governorSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true, // Ensures username is unique
    },
    password: {
        type: String,
        required: true,
    },
}, { timestamps: true });

const governorModel = mongoose.model("Governor", governorSchema);
export default governorModel;