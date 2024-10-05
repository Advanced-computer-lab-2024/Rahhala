const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const preferenceTagSchema = new Schema(
    {
        name: {
            type: String, required: true,
            required: [true, 'Tag required'],
            unique: true,
            minlength: [3, 'Too short tag name'],
            maxlength: [24, 'Too long tag name']
        }
    }, { timestamps: true });

module.exports = mongoose.model('PreferenceTag', preferenceTagSchema);