import {Router} from "express";
import { withAuth } from "../middlewares/auth.middleware";
import { tryCatch } from "../middlewares/try-catch.middleware";
import { getNotifications,readNotification } from "../controllers/notifications.controller";

const router = Router();

router.get("/get-notifications", withAuth, tryCatch(getNotifications));
router.put("/read-notification/:notificationId", withAuth, tryCatch(readNotification));

export { router as notificationsRouter };