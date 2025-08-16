import { Router } from "express";
import { auth } from "../middleware/authMiddleware";
import { createProject, deleteProject, getProjectById, getProjects, updateProject } from "../controllers/projectController";

const router = Router();
router.use(auth);
router.get("/", getProjects);
router.post("/", createProject);
router.get("/:id", getProjectById);
router.put("/:id", updateProject);
router.delete("/:id", deleteProject);
export default router;
