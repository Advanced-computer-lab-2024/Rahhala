const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const preferenceTagSchema = new Schema(
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
                    return /^[a-zA-Z0-9 ]+$/.test(v);
                },
                message: 'Tag name can only contain letters, numbers, and spaces.'
            }
        }
    },
    { timestamps: true }
);

// Virtual property to create a slug from the name
preferenceTagSchema.virtual('slug').get(function () {
    return this.name.toLowerCase().replace(/ /g, '-');
});

preferenceTagSchema.set('toJSON', { virtuals: true });
preferenceTagSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('PreferenceTag', preferenceTagSchema);