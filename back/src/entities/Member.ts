import mongoose from "mongoose";

const Member = new mongoose.Schema({
  name: String,
  lastname: String,
  email: String,
  
  // Add more properties as needed
});

export default mongoose.model('User', Member);