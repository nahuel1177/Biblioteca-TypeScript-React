import mongoose from "mongoose";

const Book = new mongoose.Schema({
  title: String,
  author: String,
  isbn: Number,
  loanable: Boolean,
  stockInt: Number,
  stockExt: Number,

  isActive: {
    type: Boolean,
    default: true,
  }

});

export default mongoose.model('Book', Book);