const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const categorySchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Category required'],
      unique: [true, 'Category must be unique'],
    }

  }, { timestamps: true });

const categoryModel = mongoose.model('category', categorySchema);
module.exports = categoryModel;