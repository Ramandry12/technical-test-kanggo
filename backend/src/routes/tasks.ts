import { Router } from "express";
import {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
} from "../controllers/taskController";
import { authenticate } from "../middleware/auth";
import { validate } from "../middleware/validate";
import {
  createTaskSchema,
  updateTaskSchema,
  taskQuerySchema,
} from "../validators/taskValidator";

const router = Router();

router.use(authenticate);
router.get("/", validate(taskQuerySchema, "query"), getTasks);
router.post("/", validate(createTaskSchema), createTask);
router.put("/:id", validate(updateTaskSchema), updateTask);
router.delete("/:id", deleteTask);

export default router;
