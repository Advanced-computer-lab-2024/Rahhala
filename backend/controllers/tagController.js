import tagModel from '../models/preferenceTagModel.js'; // Adjust the path based on your folder structure

const createTag = async (req, res) => {
    const { name } = req.body;

    try {
        const newTag = new tagModel({ name });
        await newTag.save();
        res.status(201).json(newTag);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const getAllTags = async (req, res) => {
    try {
        const tags = await tagModel.find();
        res.status(200).json(tags);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const updateTag = async (req, res) => {
    const { id } = req.params;
    const { name } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: 'Invalid tag ID format' });
    }

    try {
        const updatedTag = await tagModel.findByIdAndUpdate(
            id,
            { name },
            { new: true, runValidators: true }
        );

        if (!updatedTag) {
            return res.status(404).json({ error: 'Tag not found' });
        }

        res.status(200).json(updatedTag);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const deleteTag = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: 'Invalid tag ID format' });
    }

    try {
        const deletedTag = await tagModel.findByIdAndDelete(id);

        if (!deletedTag) {
            return res.status(404).json({ error: 'Tag not found' });
        }

        res.status(200).json({ message: 'Tag deleted successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export {
    createTag,
    getAllTags,
    updateTag,
    deleteTag,
};
