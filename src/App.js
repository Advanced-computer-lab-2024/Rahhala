const express = require("express");
const mongoose = require('mongoose');
require("dotenv").config();

const MongoURI = process.env.MONGO_URI;
const {getCategories,createCategory,updateCategory,deleteCategory} = require('./Routes/categoryController');
const {getTags,createTag,updateTag,deleteTag} = require('./Routes/tagController')

const app = express();
const port = process.env.PORT || "8000";
const category = require('./Models/activityCategory');

mongoose.connect(MongoURI)
.then(()=>{
  console.log("MongoDB is now connected!");
 app.listen(port, () => {
    console.log(`Listening to requests on http://localhost:${port}`);
  })
})
.catch(err => console.log(err));
app.use(express.json())
app.get("/Categories",getCategories);
app.post("/createCategory",createCategory);
app.put("/updateCategory/:id",updateCategory);
app.delete("/deleteCategory/:id",deleteCategory);
app.get("/Tags",getTags);
app.post("/createTag",createTag);
app.put("/updateTag/:id",updateTag);
app.delete("/deleteTag/:id",deleteTag);