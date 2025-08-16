import { Response } from "express";
import Project from "../models/Project";
import Task from "../models/Task";
import { AuthedRequest } from "../middleware/authMiddleware";

export const createProject = async (req: AuthedRequest, res: Response) => {
  try {
    const { title, description, status } = req.body;
    const project = await Project.create({ title, description, status, user: req.userId! });
    res.status(201).json(project);
  } catch (e) {
    res.status(500).json({ message: "Server error" });
  }
};

export const getProjects = async (req: AuthedRequest, res: Response) => {
  try {
    const { page = 1, limit = 10, q = "" } = req.query as any;
    const filter = { user: req.userId, title: { $regex: q, $options: "i" } };
    const [items, total] = await Promise.all([
      Project.find(filter).sort({ createdAt: -1 }).skip((+page-1)*+limit).limit(+limit),
      Project.countDocuments(filter)
    ]);
    res.json({ items, total, page: +page, limit: +limit });
  } catch (e) {
    res.status(500).json({ message: "Server error" });
  }
};

export const getProjectById = async (req: AuthedRequest, res: Response) => {
  try {
    const project = await Project.findOne({ _id: req.params.id, user: req.userId });
    if (!project) return res.status(404).json({ message: "Not found" });
    res.json(project);
  } catch (e) {
    res.status(500).json({ message: "Server error" });
  }
};

export const updateProject = async (req: AuthedRequest, res: Response) => {
  try {
    const project = await Project.findOneAndUpdate(
      { _id: req.params.id, user: req.userId },
      req.body,
      { new: true }
    );
    if (!project) return res.status(404).json({ message: "Not found" });
    res.json(project);
  } catch (e) {
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteProject = async (req: AuthedRequest, res: Response) => {
  try {
    const project = await Project.findOneAndDelete({ _id: req.params.id, user: req.userId });
    if (!project) return res.status(404).json({ message: "Not found" });
    await Task.deleteMany({ project: project._id });
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ message: "Server error" });
  }
};
