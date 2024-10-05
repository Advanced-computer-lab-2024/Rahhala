const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const preferenceTagSchema = new Schema(
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

// Error handling middleware to catch duplicate key error for `save`
preferenceTagSchema.post('save', function(error, doc, next) {
    if (error.code === 11000) {
        next(new Error('Tag name already exists. Please choose a different name.'));
    } else {
        next(error);  // Pass other errors
    }
});

// Error handling middleware for `insertMany`
preferenceTagSchema.post('insertMany', function(error, docs, next) {
    if (error.code === 11000) {
        next(new Error('One or more tags already exist. Duplicate entry.'));
    } else {
        next(error);
    }
});

const preferenceTagModel = mongoose.model('PreferenceTag', preferenceTagSchema);
module.exports = preferenceTagModel;