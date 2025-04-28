import mongoose from "mongoose";

const Book = new mongoose.Schema({
  title: String,
  author: String,
  isbn: Number,
  stockInt: Number,
  stockExt: Number,

  isActive: {
    type: Boolean,
    default: true,
  }

  // Add more properties as needed
});

export default mongoose.model('Book', Book);