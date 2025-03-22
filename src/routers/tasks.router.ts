import { Router } from "express";
import { tryCatch } from "../middlewares/try-catch.middleware";
import { withAuth } from "../middlewares/auth.middleware";
import {
    createTask,
    getTasks,
    getTask,
    updateTask,
    deleteTask,
    updateTaskPosition,
    updateTaskStatus,
    getMyTasks
} from "../controllers/tasks.controller";

const router = Router();

router.post("/create-task", withAuth, tryCatch(createTask));
router.get("/get-tasks", withAuth, tryCatch(getTasks));
router.get("/get-my-tasks", withAuth, tryCatch(getMyTasks));
router.get("/get-task/:taskId", withAuth, tryCatch(getTask));
router.put("/update-task/:taskId", withAuth, tryCatch(updateTask));
router.delete("/delete-task/:taskId", withAuth, tryCatch(deleteTask));
router.put("/update-task-position/:taskId", withAuth, tryCatch(updateTaskPosition));
router.put("/update-task-status/:taskId", withAuth, tryCatch(updateTaskStatus));

export { router as tasksRouter };