const categoryModel = require('../Models/activityCategory');
const { default: mongoose } = require('mongoose');

const createCategory = async (req, res) => {
    const { name } = req.body;
    if (!name) {
        return res.status(400).json({ error: "Name is required" });
    }
    try {
        const category = await categoryModel.create({ name });
        res.status(200).json(category);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const getCategories = async (req, res) => {
    try {
        const categories = await categoryModel.find({}).sort({ createdAt: -1 });

        if (categories.length === 0) {
            return res.status(404).json({ error: "No categories found" });
        }

        for (let index = 0; index < categories.length; index++) {
            const element = categories[index];
        }

        res.status(200).json(categories);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const updateCategory = async (req, res) => {
    const { id } = req.params;
    const { name } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: "Invalid category ID format" });
    }

    try {
        const updatedCategory = await categoryModel.findByIdAndUpdate(
            id,
            { name },
            { new: true, runValidators: true }
        );

        if (!updatedCategory) {
            return res.status(404).json({ error: "Category not found" });
        }

        res.status(200).json(updatedCategory);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const deleteCategory = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: "Invalid category ID format" });
    }

    try {
        const deletedCategory = await categoryModel.findByIdAndDelete(id);

        if (!deletedCategory) {
            return res.status(404).json({ error: "Category not found" });
        }

        res.status(200).json({ message: "Category deleted successfully" });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

module.exports = { getCategories, createCategory, updateCategory, deleteCategory };