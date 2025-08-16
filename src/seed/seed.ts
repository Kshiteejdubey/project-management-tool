import "dotenv/config";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "../models/User";
import Project from "../models/Project";
import Task from "../models/Task";

const run = async () => {
  const uri = process.env.MONGODB_URI) || "mongodb://localhost:27017/project_tool";
  await mongoose.connect(uri);
  await User.deleteMany({});
  await Project.deleteMany({});
  await Task.deleteMany({});
  const password = await bcrypt.hash("Test@123", 10);
  const user = await User.create({ email: "test@example.com", password });
  for (let i = 1; i <= 2; i++) {
    const project = await Project.create({
      title: `Project ${i}`,
      description: `Description for project ${i}`,
      status: "active",
      user: user._id
    });
    for (let j = 1; j <= 3; j++) {
      await Task.create({
        title: `Task ${j} for Project ${i}`,
        description: `Some details ${j}`,
        status: "todo",
        dueDate: new Date(Date.now() + j * 86400000),
        project: project._id
      });
    }
  }
  console.log("✅ Seeded. User: test@example.com / Test@123");
  await mongoose.disconnect();
};

run().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1); });
