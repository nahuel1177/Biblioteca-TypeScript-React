import mongoose from "mongoose";

const mongoUri = "mongodb://127.0.0.1:27017/libdb?authSource=admin";

export const connectDB = async () => {
  try {
    await mongoose.connect(mongoUri);

    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);

    process.exit(1);
  }
};
