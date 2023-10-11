import mongoose from "mongoose";

const Book = new mongoose.Schema({
  title: String,
  author: String,
  // Add more properties as needed
});

export default mongoose.model('Book', Book);