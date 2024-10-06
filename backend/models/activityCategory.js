import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema(
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
// handling for duplicate name
categorySchema.post('save', function(error, doc, next) {
  if (error.code === 11000) {
    next(new Error('Category name already exists. Please choose a different name.'));
  } else {
    next(error);  // Pass other errors
  }
});

const categoryModel = mongoose.model('Category', categorySchema);
export default categoryModel;