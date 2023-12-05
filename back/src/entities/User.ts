import mongoose from "mongoose";
import Role from "./Role";

const User = new mongoose.Schema({
  name: String,
  lastname: String,
  username: String,
  password: String,
  email: String,

  role: {
    type: mongoose.Schema.Types.ObjectId,
    ref: Role, // Reference to the Role model
    required: true,
  },

  isActive: {
    type: Boolean,
    default: true,
  }


  // Add more properties as needed
});

export default mongoose.model("User", User);
