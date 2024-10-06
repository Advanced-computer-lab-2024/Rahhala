import mongoose from 'mongoose';

const preferenceTagSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Tag required'],
            unique: [true, 'Tag must be unique'],
            minlength: [3, 'Too short tag name'],
            maxlength: [24, 'Too long tag name'],
            validate: {
                validator: function (v) {
                    // Alphanumeric characters, spaces, and hyphens allowed
                    return /^[a-zA-Z0-9\- ]+$/.test(v);
                },
                message: 'Tag name can only contain letters, numbers, spaces, and hyphens.'
            }
        }
    }, 
    { timestamps: true }
);
// handling for duplicate name
preferenceTagSchema.post('save', function(error, doc, next) {
    if (error.code === 11000) {
        next(new Error('Tag name already exists. Please choose a different name.'));
    } else {
        next(error);  
    }
});

const tagModel = mongoose.model('PreferenceTag', preferenceTagSchema);
export default tagModel;