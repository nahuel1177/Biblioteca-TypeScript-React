import mongoose from "mongoose";

const Role = new mongoose.Schema({
  role: String,
  
  // Add more properties as needed
});

export default mongoose.model('Role', Role);