import mongoose from "mongoose";

const Member = new mongoose.Schema({
  name: String,
  lastname: String,
  email: String,
  
  isActive: {
    type: Boolean,
    default: true,
  }
  // Add more properties as needed
});

export default mongoose.model('Member', Member);