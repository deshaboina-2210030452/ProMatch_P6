import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import problemRoutes from "./routes/problemRoutes.js";

dotenv.config();

const app = express();
const mongoURL = process.env.MONGODB_URL;
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

mongoose.connect(mongoURL)
.then(() => console.log("✅ MongoDB Connected"))
.catch((err) => console.error("❌ MongoDB connection error:", err));

app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

app.use("/api/problems", problemRoutes);



app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
