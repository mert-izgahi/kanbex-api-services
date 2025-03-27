import express, { Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { logger } from "./lib/logger";
import configs, { corsOptions } from "./configs";
import { connectDatabase } from "./lib/mongoose";

// Middlewares
import { authMiddleware } from "./middlewares/auth.middleware";
import { loggerMiddleware } from "./middlewares/logger.middleware";
import { errorHandlerMiddleware } from "./middlewares/error-handler.middleware";
import { notFoundMiddleware } from "./middlewares/not-found.middleware";
// Routers
import { authRouter } from "./routers/auth.router";
import { cloudinaryRouter } from "./routers/cloudinary.router";
import { workspaceRouter } from "./routers/workspace.router";
import { notificationsRouter } from "./routers/notifications.router";
import { membersRouter } from "./routers/members.router";
import { inviteRouter } from "./routers/invite.router";
import { projectsRouter } from "./routers/projects.router";
import { tasksRouter } from "./routers/tasks.router";
import { commentsRouter } from "./routers/comments.router";

const app = express();

app.use(cors({
  origin:"*"
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static("public"));

app.use(authMiddleware);
app.use(loggerMiddleware);
app.get("/api/health-check", (req: Request, res: Response) => {
  res.json({ success: true });
});
app.use("/api", authRouter);
app.use("/api", cloudinaryRouter);
app.use("/api", workspaceRouter);
app.use("/api", notificationsRouter);
app.use("/api", membersRouter);
app.use("/api", inviteRouter);
app.use("/api", projectsRouter);
app.use("/api", tasksRouter);
app.use("/api", commentsRouter);

app.use(errorHandlerMiddleware);
app.use(notFoundMiddleware);

app.listen(configs.PORT, async () => {
  await connectDatabase(configs.MONGODB_URI as string);
  logger.info(`Server is listening on port ${configs.PORT}`);
});
