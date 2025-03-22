import { Router } from "express";
import { tryCatch } from "../middlewares/try-catch.middleware";
import { withAuth } from "../middlewares/auth.middleware";
import {
  createWorkspace,
  getWorkspaces,
  getWorkspace,
  updateWorkspace,
  deleteWorkspace,
  searchAccountsByEmail,
  getWorkspacesAnalytics
} from "../controllers/workspace.controller";

const router = Router();

router.post("/create-workspace", withAuth, tryCatch(createWorkspace));
router.get("/get-workspaces", withAuth, tryCatch(getWorkspaces));
router.get("/get-workspace/:workspaceId", withAuth, tryCatch(getWorkspace));
router.get("/get-workspaces-analytics/:workspaceId", withAuth, tryCatch(getWorkspacesAnalytics));
router.put(
  "/update-workspace/:workspaceId",
  withAuth,
  tryCatch(updateWorkspace)
);
router.delete(
  "/delete-workspace/:workspaceId",
  withAuth,
  tryCatch(deleteWorkspace)
);
router.get(
  "/search-accounts-by-email/:workspaceId",
  withAuth,
  tryCatch(searchAccountsByEmail)
);
export { router as workspaceRouter };
