import mongoose from "mongoose";

const Book = new mongoose.Schema({
  title: String,
  author: String,
  stock: Number,

  isTaken: {
    type: Boolean,
    default: false,
  },
  
  isActive: {
    type: Boolean,
    default: true,
  }

  // Add more properties as needed
});

export default mongoose.model('Book', Book);