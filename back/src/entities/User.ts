import mongoose from "mongoose";

const User = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
  // Add more properties as needed
});

export default mongoose.model('User', User);