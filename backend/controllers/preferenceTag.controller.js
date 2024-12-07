import PreferenceTag from '../models/preferenceTag.model.js';

// Create a new tag
export const createTag = async (req, res) => {
    try {
        const { name } = req.body;
        const newTag = new PreferenceTag({ name });
        await newTag.save();
        res.status(201).json(newTag);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Get all tags
export const getTags = async (req, res) => {
    try {
        const tags = await PreferenceTag.find();
        res.status(200).json(tags);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get a single tag by ID
export const getTagById = async (req, res) => {
    try {
        const { id } = req.params;
        const tag = await PreferenceTag.findById(id);
        if (!tag) {
            return res.status(404).json({ message: 'Tag not found' });
        }
        res.status(200).json(tag);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update a tag by ID
export const updateTag = async (req, res) => {
    try {
        const { id } = req.params;
        const { name } = req.body;
        console.log("entered updateTag with req.body: ", req.body, " and id: ", id);

        const updatedTag = await PreferenceTag.findByIdAndUpdate(id, { name }, { new: true, runValidators: true });
        if (!updatedTag) {
            return res.status(404).json({ message: 'Tag not found' });
        }
        res.status(200).json(updatedTag);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete a tag by ID
export const deleteTag = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedTag = await PreferenceTag.findByIdAndDelete(id);
        if (!deletedTag) {
            return res.status(404).json({ message: 'Tag not found' });
        }
        res.status(200).json({ message: 'Tag deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};