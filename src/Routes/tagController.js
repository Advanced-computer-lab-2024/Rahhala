const tagModel = require('../Models/tag');
const { default: mongoose } = require('mongoose');

const createTag = async (req, res) => {
    const { name } = req.body;
    if (!name) {
        return res.status(400).json({ error: "Name is required" });
    }
    try {
        const tag = await tagModel.create({ name });
        res.status(200).json(tag);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const getTags = async (req, res) => {
    try {
        const tags = await tagModel.find({}).sort({ createdAt: -1 });

        if (tags.length === 0) {
            return res.status(404).json({ error: "No tags found" });
        }

        for (let index = 0; index < tags.length; index++) {
            const element = tags[index];
        }

        res.status(200).json(tags);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const updateTag = async (req, res) => {
    const { id } = req.params;
    const { name } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: "Invalid tag ID format" });
    }

    try {
        const updatedTag = await tagModel.findByIdAndUpdate(
            id,
            { name },
            { new: true, runValidators: true }
        );

        if (!updatedTag) {
            return res.status(404).json({ error: "Tag not found" });
        }

        res.status(200).json(updatedTag);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const deleteTag = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: "Invalid tag ID format" });
    }

    try {
        const deletedTag = await tagModel.findByIdAndDelete(id);

        if (!deletedTag) {
            return res.status(404).json({ error: "Tag not found" });
        }

        res.status(200).json({ message: "Tag deleted successfully" });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

module.exports = { getTags, createTag, updateTag, deleteTag };