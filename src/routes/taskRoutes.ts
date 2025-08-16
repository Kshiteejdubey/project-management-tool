import { Router } from "express";
import { auth } from "../middleware/authMiddleware";
import { createTask, deleteTask, getTasks, updateTask } from "../controllers/taskController";

const router = Router();
router.use(auth);
router.get("/:projectId", getTasks);
router.post("/", createTask);
router.put("/:id", updateTask);
router.delete("/:id", deleteTask);
export default router;
