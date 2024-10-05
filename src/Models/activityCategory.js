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
          // Allow alphanumeric characters and spaces only
          return /^[a-zA-Z0-9 ]+$/.test(v);
        },
        message: 'Category name can only contain letters, numbers, and spaces.'
      }
    }
  }, 
  { timestamps: true }
);

// Virtual property to create a slug from the name
categorySchema.virtual('slug').get(function () {
  return this.name.toLowerCase().replace(/ /g, '-');
});

categorySchema.set('toJSON', { virtuals: true });
categorySchema.set('toObject', { virtuals: true });

const categoryModel = mongoose.model('Category', categorySchema);
module.exports = categoryModel;