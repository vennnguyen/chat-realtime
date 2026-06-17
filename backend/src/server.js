import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./libs/db.js";

const app = express();
dotenv.config();
const PORT = process.env.PORT || 5001;

//middleware
app.use(express.json());

connectDB().then(() => {
    app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
});
