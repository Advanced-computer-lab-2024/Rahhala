const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const categorySchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Category required'],
      unique: [true, 'Category must be unique'],
      minlength: [3, 'Too short category name'],
      maxlength: [24, 'Too long category name']
    }

  }, { timestamps: true });

const categoryModel = mongoose.model('category', categorySchema);
module.exports = categoryModel;