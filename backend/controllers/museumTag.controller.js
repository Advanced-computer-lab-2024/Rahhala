import MuseumTag from '../models/museumTag.model.js';

// Create a new museum tag
export const createMuseumTag = async (req, res) => {
    const { type, historicalPeriod } = req.body;

    try {
        const newMuseumTag = new MuseumTag({ type, historicalPeriod });
        await newMuseumTag.save();
        res.status(201).json(newMuseumTag);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Get all museum tags
export const getMuseumTags = async (req, res) => {
    try {
        const museumTags = await MuseumTag.find();
        res.status(200).json(museumTags);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get a single museum tag by ID
export const getMuseumTagById = async (req, res) => {
    const { id } = req.params;

    try {
        const museumTag = await MuseumTag.findById(id);
        if (!museumTag) {
            return res.status(404).json({ error: 'Museum tag not found' });
        }
        res.status(200).json(museumTag);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update a museum tag by ID
export const updateMuseumTag = async (req, res) => {
    const { id } = req.params;
    const { type, historicalPeriod } = req.body;

    try {
        const updatedMuseumTag = await MuseumTag.findByIdAndUpdate(
            id,
            { type, historicalPeriod },
            { new: true, runValidators: true }
        );
        if (!updatedMuseumTag) {
            return res.status(404).json({ error: 'Museum tag not found' });
        }
        res.status(200).json(updatedMuseumTag);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Delete a museum tag by ID
export const deleteMuseumTag = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedMuseumTag = await MuseumTag.findByIdAndDelete(id);
        if (!deletedMuseumTag) {
            return res.status(404).json({ error: 'Museum tag not found' });
        }
        res.status(200).json({ message: 'Museum tag deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};