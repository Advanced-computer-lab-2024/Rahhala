import mongoose from 'mongoose';

const preferenceTagSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Tag required'],
            unique: true,
            minlength: [3, 'Too short tag name'],
            maxlength: [24, 'Too long tag name'],
            validate: {
                validator: function (v) {
                    // Allow alphanumeric characters and spaces
                    return /^[a-zA-Z0-9 -]+$/.test(v);
                },
                message: 'Tag name can only contain letters, numbers, and spaces.'
            }
        }
    },
    { timestamps: true }
);


const tagModel = mongoose.model('PreferenceTag', preferenceTagSchema);
export default tagModel;