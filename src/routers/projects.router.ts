import { Router } from "express";
import { tryCatch } from "../middlewares/try-catch.middleware";
import { withAuth } from "../middlewares/auth.middleware";
import {
  createProject,
  getProjects,
  getProject,
  updateProject,
  deleteProject,
} from "../controllers/projects.controller";

const router = Router();

router.post("/create-project", withAuth, tryCatch(createProject));
router.get("/get-projects", withAuth, tryCatch(getProjects));
router.get("/get-project/:projectId", withAuth, tryCatch(getProject));
router.put("/update-project/:projectId", withAuth, tryCatch(updateProject));
router.delete("/delete-project/:projectId", withAuth, tryCatch(deleteProject));

export { router as projectsRouter };
