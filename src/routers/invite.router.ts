import { Router } from "express";
import { tryCatch } from "../middlewares/try-catch.middleware";
import { withAuth } from "../middlewares/auth.middleware";
import {
  createInvite,
  getInvite,
  acceptInvite,
} from "../controllers/invite.controller";

const router = Router();

router.post("/create-invite", withAuth, tryCatch(createInvite));
router.post("/accept-invite/:inviteId", withAuth, tryCatch(acceptInvite));
router.get("/get-invite/:inviteId", withAuth, tryCatch(getInvite));
export { router as inviteRouter };
