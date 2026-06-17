import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_CONNECTION_STRING)
        console.log("Connection successful");
        
    } catch (error) {
        console.error("Connection failed:", error);
        process.exit(1); // Exit the process with an error code
    }
}