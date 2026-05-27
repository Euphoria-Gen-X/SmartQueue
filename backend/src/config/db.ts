import mongoose from "mongoose";
import { env } from "./env.js";

const connectDB = async () => {
  try {
    const connection = await mongoose.connect(env.mongoUri);
    console.log(`MongoDB connected: ${connection.connection.host}`);
  } catch (error) {
    throw new Error(`MongoDB connection failed: ${(error as Error).message}`);
  }
};

export default connectDB;
