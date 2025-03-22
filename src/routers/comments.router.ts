import { Router } from "express";
import { tryCatch } from "../middlewares/try-catch.middleware";
import { withAuth } from "../middlewares/auth.middleware";
import {
  createComment,
  getComments,
  deleteComment,
} from "../controllers/comments.controller";

const router = Router();

router.post("/create-comment", withAuth, tryCatch(createComment));
router.get("/get-comments", withAuth, tryCatch(getComments));
router.delete("/delete-comment/:commentId", withAuth, tryCatch(deleteComment));

export { router as commentsRouter };
