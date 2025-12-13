import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import taskRoutes from "./routes/tasksRoutes.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/todoapp";

mongoose
  .connect(MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

app.use("/api/tasks", taskRoutes);

app.get("/", (req, res) => res.send("Todo API is running"));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
