// configure reading from .env
import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import routes from './routes.js';
dotenv.config({path: "../.env"});
const port = process.env.PORT //getting port from .env


// connect to MongoDB server
let conn; // used to communicate with DB
async function connectDB() {
    try {
      conn = await mongoose.connect(process.env.MONGO_URI);
      console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
      console.error(`Error: ${error.message}`);
      process.exit(1); // Exit the process with failure
    }
  }
connectDB();


// new express app
const app = express() // express app init
app.use(express.json());


// listen for requests
app.listen(port,() => {
    console.log('listening on port', port)
})

// endpoints
app.delete("/deleteEntity/:entityType/:id", routes.deleteEntity);
app.post("/addGovernor", routes.addGovernor);
app.post("/addAdmin", routes.addAdmin);
app.get("/Categories", routes.getCategories);
app.post("/createCategory", routes.createCategory);
app.put("/updateCategory/:id", routes.updateCategory);
app.delete("/deleteCategory/:id", routes.deleteCategory);