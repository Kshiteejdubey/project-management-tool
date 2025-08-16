import { Response } from "express";
import Task from "../models/Task";
import Project from "../models/Project";
import { AuthedRequest } from "../middleware/authMiddleware";

const assertOwnsProject = async (projectId: string, userId: string) => {
  const prj = await Project.findOne({ _id: projectId, user: userId });
  return !!prj;
};

export const createTask = async (req: AuthedRequest, res: Response) => {
  try {
    const { project, title, description, status, dueDate } = req.body;
    if (!(await assertOwnsProject(project, req.userId!))) return res.status(403).json({ message: "Forbidden" });
    const task = await Task.create({ project, title, description, status, dueDate });
    res.status(201).json(task);
  } catch (e) {
    res.status(500).json({ message: "Server error" });
  }
};

export const getTasks = async (req: AuthedRequest, res: Response) => {
  try {
    const { projectId } = req.params;
    const { status } = req.query as any;
    if (!(await assertOwnsProject(projectId, req.userId!))) return res.status(403).json({ message: "Forbidden" });
    const filter: any = { project: projectId };
    if (status) filter.status = status;
    const tasks = await Task.find(filter).sort({ createdAt: -1 });
    res.json(tasks);
  } catch (e) {
    res.status(500).json({ message: "Server error" });
  }
};

export const updateTask = async (req: AuthedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const task = await Task.findById(id);
    if (!task) return res.status(404).json({ message: "Not found" });
    if (!(await assertOwnsProject(task.project.toString(), req.userId!))) return res.status(403).json({ message: "Forbidden" });
    Object.assign(task, req.body);
    await task.save();
    res.json(task);
  } catch (e) {
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteTask = async (req: AuthedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const task = await Task.findById(id);
    if (!task) return res.status(404).json({ message: "Not found" });
    if (!(await assertOwnsProject(task.project.toString(), req.userId!))) return res.status(403).json({ message: "Forbidden" });
    await task.deleteOne();
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ message: "Server error" });
  }
};
