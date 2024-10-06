import models from "../models/index.js";
import { generateToken, comparePasswords } from '../utils/jwt.js';


const handleLogin = async (model, email, password, userType) => {
    const user = await model.findOne({ email });
    if (!user) {
        throw new Error('Invalid email or password.');
    }

    const isMatch = comparePasswords(user.password, password);
    if (!isMatch) {
        throw new Error('Invalid email or password.');
    }

    const token = generateToken(user, userType);
    return token;
};
// Login Controller
const login = async (req, res) => {
    const { email, password, userType } = req.body;

    if (!email || !password || !userType) {
        return res.status(400).json({ message: 'Email, password, and userType are required.' });
    }

    let model;
    switch (userType.toLowerCase()) {
        case 'tourist':
            model = models.touristModel;
            break;
        case 'tour guide':
        case 'tourguide':
            model = models.tourGuideModel;
            break;
        case 'advertiser':
            model = models.advertiserModel;
            break;
        case 'seller':
            model = models.sellerModel;
            break;
        default:
            return res.status(400).json({ message: 'Invalid userType.' });
    }

    try {
        const token = await handleLogin(model, email, password, userType);
        res.status(200).json({ token });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Registration Controller (Optional for each user type)
const register = async (req, res) => {
    const { userType, ...userData } = req.body;

    if (!userType) {
        return res.status(400).json({ message: 'userType is required.' });
    }

    let model;
    switch (userType.toLowerCase()) {
        case 'tourist':
            model = models.touristModel;
            break;
        case 'tour guide':
        case 'tourguide':
            model = models.tourGuideModel;
            break;
        case 'advertiser':
            model = models.advertiserModel;
            break;
        case 'seller':
            model = models.sellerModel;
            break;
        default:
            return res.status(400).json({ message: 'Invalid userType.' });
    }

    try {
        const user = new model(userData);
        await user.save();

        const token = generateToken(user, userType);
        res.status(201).json({ token });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

const authController = {
    login,
    register
};

export default authController;