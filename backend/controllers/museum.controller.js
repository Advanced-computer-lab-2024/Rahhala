import museumModel from "../models/museum.model.js";

//Add Museum to the Database
export const addMuseum = async (req, res) => {
    console.log("entered  addMuseum");
    const { name, description, pictures, location, openingHours, 
            foreignerPrice, nativePrice, studentPrice, tags} =
        req.body;
    console.log(req.body);

    try {
        const userId = req.user.id; // Assuming `req.user` is set by JWT middleware
        console.log(userId);
        let museum;
        if(tags.length === 0) {
        museum = await museumModel.create({
        name,
        description,
        pictures,
        location,
        openingHours,
        foreignerPrice,
        nativePrice, 
        studentPrice,
        userId: userId,
        });
    }
    else {
        museum = await museumModel.create({
            name,
            description,
            pictures,
            location,
            openingHours,
            foreignerPrice,
            nativePrice, 
            studentPrice,
            userId: userId,
            tags
            });
    }    
        res.status(201).json(museum);
    } catch (error) {
        console.log(error);
        res.status(400).json({ error: error.message });
    }
};

//Get Museums from the Database
export const getMuseums = async (req, res) => {
  console.log("entered  getMuseums");

  try {
    const museum = await museumModel.find();
    if (!museum) {
      return res.status(404).json({ message: "Museum not found" });
    }
    res.status(200).json(museum);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

//Get Museums by User ID
export const getMuseumsByUserID = async (req, res) => {
  console.log("entered  getMuseumsByUserID");

  const id = req.user.id;
  if (!id) return res.status(400).json({ message: "Missing ID" });
  try {
    const query = { userId: id };
    const museum = await museumModel.find(query);
    if (!activity) return res.status(404).json({ message: "museum not found" });
    return res.status(200).json(museum);
  } catch (error) {
    console.error("Error fetching museum:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

//Edit Museum Information
export const editMuseum = async (req, res) => {
  console.log("entered  editMuseum");

  const { id } = req.params;
  const updates = req.body;
  try {
    const updatedMuseum = await museumModel.findByIdAndUpdate(id, updates, {
      new: true,
    });
    if (!updatedMuseum) {
      return res.status(404).json({ message: "Museum not found" });
    }
    res.status(200).json(updatedMuseum);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

//Delete Museum from Database
export const deleteMuseum = async (req, res) => {
  console.log("entered  deleteMuseum");

  const { id } = req.params;

  try {
    const museum = await museumModel.findByIdAndDelete(id);
    if (!museum) {
      return res.status(404).json({ message: "Museum not found" });
    }
    res.status(200).json({ message: "Museum deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//Delete Museum by Museum Name from Database
export const deleteMuseumByName = async (req, res) => {
  console.log("entered  deleteMuseumByName");

  const { name } = req.params; // Expecting the museum name as a parameter

  try {
    const deletedMuseum = await museumModel.findOneAndDelete({ name });

    if (!deletedMuseum) {
      return res.status(404).json({ message: "Museum not found" });
    }

    res.status(200).json({ message: "Museum deleted successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

//Edit Museum Information by Museum Name
export const editMuseumByName = async (req, res) => {
  console.log("entered  editMuseumByName");

  const { name } = req.params; // Expecting name as a parameter
  const updates = req.body;

  try {
    const updatedMuseum = await museumModel.findOneAndUpdate(
      { name },
      updates,
      { new: true }
    );

    if (!updatedMuseum) {
      return res.status(404).json({ message: "Museum not found" });
    }

    res.status(200).json(updatedMuseum);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

//Get Museum by ID
export const getMuseumById = async (req, res) => {
    console.log("entered getMuseumById");

    const { id } = req.params;
    try {
        const museum = await museumModel.findById(id);
        if (!museum) {
            return res.status(404).json({ message: "Museum not found" });
        }
        res.status(200).json(museum);
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
};