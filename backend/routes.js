const mongoose = require("mongoose")
const dotenv = require("dotenv")


const getHome = async(req,res,conn) => {

    console.log("Received a request");
    const db = conn.connection.db;
    const collections = await db.listCollections().toArray();
    const collectionNames = collections.map((col) => col.name);
    res.json({
        message: "Welcome to the app",
        collections: collectionNames,
      });

}

dotenv.config({path: "../.env"});
const connectDB = async () => {
	try {
		const conn = await mongoose.connect(process.env.MONGO_URI);
		console.log(`MongoDB Connected: ${conn.connection.host}`);
	} catch (error) {
		console.error(`Error: ${error.message}`);
		process.exit(1); // process code 1 code means exit with failure, 0 means success
	}
};

const createUser = async (req, res, conn) =>{
    console.log("Post request received");
    const {Name,Age} = req.body;
    console.log("Name:", Name, "Age:", Age);
    res.status(200).json("success")

}
module.exports = {getHome, createUser}