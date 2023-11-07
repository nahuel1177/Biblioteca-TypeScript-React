import mongoose from "mongoose";

const Role = new mongoose.Schema({
  type: String,
  
  isDelete: {
    type: Boolean,
    default: false,
  }
  // Add more properties as needed
});

export default mongoose.model('Role', Role);