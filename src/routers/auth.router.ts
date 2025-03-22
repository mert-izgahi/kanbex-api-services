import { Router } from "express";
import { tryCatch } from "../middlewares/try-catch.middleware";
import {
  signIn,
  signUp,
  authCallback,
  signOut,
  getMe,
} from "../controllers/auth.controller";
import { withAuth } from "../middlewares/auth.middleware";

const router = Router();

router.post("/sign-up", tryCatch(signUp));
router.post("/sign-in", tryCatch(signIn));
router.post("/callback", tryCatch(authCallback));
router.get("/get-me", withAuth, tryCatch(getMe));
router.post("/sign-out", withAuth, tryCatch(signOut));


export { router as authRouter };
