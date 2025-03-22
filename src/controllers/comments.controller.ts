import { Request, Response } from "express";
import { ApiError } from "../lib/api-error";
import { sendResponse } from "../helpers/utils";
import { Comment } from "../models/comment.model";
import { Notification } from "../models/notification.model";
import { Member } from "../models/member.model";
import { NotificationType } from "../lib/enums";
import { Task } from "../models/task.model";

export const createComment = async (req: Request, res: Response) => {
  const { currentAccountId } = res.locals;
  const { content, taskId, media, mediaType, projectId, workspaceId } =
    req.body;
    console.log(taskId);
    
  // GET TASK
  const task = await Task.findOne({ _id: taskId });
  if (!task) {
    throw ApiError.notFound("Task not found");
  }

  const comment = await Comment.create({
    content,
    task: taskId,
    account: currentAccountId,
    project: projectId,
    workspace: workspaceId,
    media,
    mediaType,
  });

  // Create notification
  await Notification.create({
    account: currentAccountId,
    message: "You have commented on a task",
    type: NotificationType.COMMENT,
    metadata: { taskId },
    project: projectId,
    workspace: workspaceId,
  });

  sendResponse(res, comment);
};

export const getComments = async (req: Request, res: Response) => {
  const { taskId } = req.query;
  const comments = await Comment.find({ task: taskId }).populate("account task project workspace");
  sendResponse(res, comments);
};

export const deleteComment = async (req: Request, res: Response) => {
  const { currentAccountId } = res.locals;
  const { commentId } = req.params;
  const comment = await Comment.findOneAndDelete({
    _id: commentId,
    account: currentAccountId,
  });
  if (!comment) {
    throw ApiError.notFound("Comment not found");
  }
  sendResponse(res, comment);
};
