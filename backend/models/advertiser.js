const mongoose = require('mongoose');

const advertiserSchema = new mongoose.Schema({
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
    websiteLink: {
        type: String,
        required: true
    },
    hotline: {
        type: String,
        required: true
    },
    companyProfile: {
        type: String,
        required: true
    }
});

const advertiserModel = mongoose.model('Advertiser', advertiserSchema);

module.exports = advertiserModel;