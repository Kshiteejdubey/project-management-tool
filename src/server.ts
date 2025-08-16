import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./config/db";
import authRoutes from "./routes/authRoutes";
import projectRoutes from "./routes/projectRoutes";
import taskRoutes from "./routes/taskRoutes";

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (_req, res) => res.send("Project Management API running"));
app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/tasks", taskRoutes);

const PORT = process.env.PORT || 4000;
connectDB().then(() => {
  app.listen(PORT, () => console.log(`Server on http://localhost:${PORT}`));
});
