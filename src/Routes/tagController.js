const tagModel = require('../Models/tag');
const { default: mongoose } = require('mongoose');

const createTag = async(req,res) => {
    const{name} = req.body;
    try{
        const tag = await tagModel.create({name});
        res.status(200).json(tag)
    }catch(error){
        res.status(400).json({error:error.message})
    }
}

const getTags = async (req, res) => {
    const tags = await tagModel.find({}).sort({createdAt: -1})
  
    for (let index = 0; index < tags.length; index++) {
        const element = tags[index];
    }
    res.status(200).json(tags)
}


const updateTag = async (req, res) => {
    const { id } = req.params;
    const { name } = req.body;

    try {
        const updatedtag = await tagModel.findByIdAndUpdate(
            id,
            { name },
            { new: true, runValidators: true }
        );

        if (!updatedtag) {
            return res.status(404).json({ error: "tag not found" });
        }

        res.status(200).json(updatedtag);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const deleteTag = async (req, res) => {
    const {id}  = req.params;
    console.log(req.params);
    console.log(id);
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: "Invalid tag ID format" });
    }
    try {
        const deletedtag = await tagModel.findByIdAndDelete(id);

        if (!deletedtag) {
            return res.status(404).json({ error: "tag not found" });
        }
        res.status(200).json({ message: "tag deleted successfully" });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

module.exports = {getTags,createTag,updateTag,deleteTag};