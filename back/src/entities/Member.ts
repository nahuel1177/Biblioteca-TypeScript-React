import mongoose from "mongoose";

const Member = new mongoose.Schema({
  name: String,
  lastname: String,
  email: String,
  dni: Number,

  sanctionDate: {
    type: Date,
  },
  
  limitSanctionDays: {
    type: Number,
    default: 15,
  },

  isSanctioned: {
    type: Boolean,
    default: false,
  },

  isActive: {
    type: Boolean,
    default: true,
  }
  // Add more properties as needed
});

export default mongoose.model('Member', Member);