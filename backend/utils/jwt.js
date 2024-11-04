import jwt from 'jsonwebtoken';

// Generate JWT Token
export const generateToken = (user, userType) => {
    return jwt.sign(
        { id: user._id,user, userType }, // Payload includes user, user ID and type
        process.env.JWT_SECRET,
        { expiresIn: '1d' } // Token expires in 1 day
    );
};

export const comparePasswords = (storedPassword, providedPassword) => {
    return storedPassword === providedPassword;
};
