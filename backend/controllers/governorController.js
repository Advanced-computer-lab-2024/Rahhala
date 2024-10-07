import governorModel from "../models/governor.js";

const addGovernor = async (req, res) => {
    const {email, password} = req.body;
    try {
        // Check if the username already exists
        const existingGovernor = await governorModel.findOne({ email });
        if (existingGovernor) {
            return res.status(400).json({ message: 'Username already exists' });
        }

        // Hash the password before saving (optional)
        // const hashedPassword = await bcrypt.hash(password, 10);

        // Create the new governor
        const newGovernor = await governorModel.create({email, password});

        res.status(201).json({ message: 'Governor created successfully' });
    } catch (error) {
        console.error("Error adding governor:", error);
        res.status(500).json({ message: 'Error adding governor' });
    }
};

const governorController = {
    addGovernor
};

export default governorController;