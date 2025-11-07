import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const dbURI = process.env.MONGODB_URI || "mongodb+srv://mshamel460_db_user:rrqT10vNmVgsdqLx@cluster0.hyumno8.mongodb.net/TapTalk?retryWrites=true&w=majority&appName=TapTalk";
    const result = await mongoose.connect(dbURI, {
      serverSelectionTimeoutMS: 30000
    });
    console.log(result.models);
    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};

export default connectDB;
