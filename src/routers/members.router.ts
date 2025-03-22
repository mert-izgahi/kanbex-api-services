import { Router } from "express";
import { tryCatch } from "../middlewares/try-catch.middleware";
import { withAuth } from "../middlewares/auth.middleware";
import { getMembers,getMembersByProjectId } from "../controllers/members.controller";

const router = Router();

router.get("/get-members", withAuth, tryCatch(getMembers));
router.get("/get-members-by-project-id/:projectId", withAuth, tryCatch(getMembersByProjectId));
export { router as membersRouter };