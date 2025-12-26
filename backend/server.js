import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import connectDB from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import folderRoutes from "./routes/folderRoutes.js";
import flashcardRoutes from "./routes/flashcardRoutes.js";

dotenv.config();
connectDB();

const app = express();

//middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//routes
app.use("/api/users", userRoutes);
app.use("/api/folders", folderRoutes);
app.use("/api/flashcards", flashcardRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () =>
  console.log(` Server running on port ${PORT}`)
);
