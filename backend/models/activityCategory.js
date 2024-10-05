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
                // Allow alphanumeric characters and spaces
                return /^[a-zA-Z0-9 -]+$/.test(v);
            },
            message: 'Tag name can only contain letters, numbers, and spaces.'
        }
      }
  
    }, { timestamps: true });



const categoryModel = mongoose.model('Category', categorySchema);
export default categoryModel;