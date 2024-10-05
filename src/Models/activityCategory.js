const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const categorySchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Category required'],
      unique: [true, 'Category must be unique'],
      minlength: [3, 'Too short category name'],
      maxlength: [24, 'Too long category name'],
      validate: {
        validator: function (v) {
          // Alphanumeric, spaces, and hyphens allowed
          return /^[a-zA-Z0-9\- ]+$/.test(v);
        },
        message: 'Category name can only contain letters, numbers, spaces, and hyphens.'
      }
    }
  },
  { timestamps: true }
);

// Error handling middleware for `save`
categorySchema.post('save', function(error, doc, next) {
  if (error.code === 11000) {
    next(new Error('Category name already exists. Please choose a different name.'));
  } else {
    next(error);  // Pass other errors
  }
});

// Error handling middleware for `insertMany`
categorySchema.post('insertMany', function(error, docs, next) {
  if (error.code === 11000) {
    next(new Error('One or more categories already exist. Duplicate entry.'));
  } else {
    next(error);
  }
});

const categoryModel = mongoose.model('Category', categorySchema);
module.exports = categoryModel;