import mongoose from "mongoose";

const Role = new mongoose.Schema({
  type: String,
  
  isActive: {
    type: Boolean,
    default: true,
  }
  // Add more properties as needed
});

export default mongoose.model('Role', Role);