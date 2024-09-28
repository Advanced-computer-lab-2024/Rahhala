// configure reading from .env
const dotenv = require("dotenv")
dotenv.config({path: "../.env"});
const port = process.env.PORT //getting port from .env


// connect to MongoDB server
const mongoose = require("mongoose");
let conn;
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

// import required routes
const {getHome, createUser} = require("./routes")


// new express app
const express = require('express')
const app = express() // express app init
app.use(express.json());


// listen for requests
app.listen(port,() => {
    console.log('listening on port', port)
})

app.get(["/", "/home"], (req, res) => getHome(req, res, conn));
app.post("/createUser", (req, res) => createUser(req, res, conn))

