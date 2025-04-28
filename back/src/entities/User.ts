import mongoose from "mongoose";

const User = new mongoose.Schema({
  name: String,
  lastname: String,
  username: String,
  password: String,
  email: String,
  role: String,

  isActive: {
    type: Boolean,
    default: true,
  }

  // Add more properties as needed
});

export default mongoose.model("User", User);
