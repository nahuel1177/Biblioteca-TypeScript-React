import mongoose from "mongoose";
import Member from "./Member";
import Book from "./Book";

const Loan = new mongoose.Schema({
  member: {
    type: mongoose.Schema.Types.ObjectId,
    ref: Member, // Reference to the User model
    required: true,
  },

  book: {
    type: mongoose.Schema.Types.ObjectId,
    ref: Book, // Reference to the Book model
    required: true,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },

  isActive: {
    type: Boolean,
    default: true,
  },
});

export default mongoose.model("Loan", Loan);
