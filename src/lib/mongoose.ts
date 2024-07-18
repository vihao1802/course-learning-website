import mongoose from "mongoose";

let isConnected = false;

const connectDB = async () => {
  mongoose.set("strict", true); //prevent the redundant field (not defined in schema) from being saved to the database (strict mode)

  if (!process.env.MONGODB_URL)
    return console.log("MONGODB_URL is not defined");

  if (isConnected) return console.log("Already connected to database");

  try {
    await mongoose.connect(process.env.MONGODB_URL);
    isConnected = true;
    return console.log("Connected to database");
  } catch (error) {
    console.log(error);
  }
};

export default connectDB;
