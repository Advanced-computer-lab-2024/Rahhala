const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const sellerSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: false
    }
}, {
    timestamps: true
});

const sellerModel = mongoose.model('Seller', sellerSchema);

module.exports = sellerModel;