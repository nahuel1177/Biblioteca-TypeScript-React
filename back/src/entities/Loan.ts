import mongoose from "mongoose";
import Member from "./Member";
import Book from "./Book";

const Loan = new mongoose.Schema({

  type: String, 
  isDefeated: {
    type: String,
    default: "Vigente",
  },

  memberId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: Member, // Reference to the User model
    required: true,
  },

  bookId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: Book, // Reference to the Book model
    required: true,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },

  dateLimit: {
    type: Date, 
    default: null,
  },

  isActive: {
    type: Boolean,
    default: true,
  },
});

export default mongoose.model("Loan", Loan);
