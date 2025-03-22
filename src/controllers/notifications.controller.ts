import { Request, Response } from "express";
import { ApiError } from "../lib/api-error";
import { sendResponse } from "../helpers/utils";
import { Notification } from "../models/notification.model";

export const getNotifications = async (req: Request, res: Response) => {
  const { currentAccountId } = res.locals;
  
  const notifications = await Notification.find({
    account: currentAccountId,
  }).sort({ createdAt: -1 });
  sendResponse(res, notifications);
};

export const readNotification = async (req: Request, res: Response) => {
  const { currentAccountId } = res.locals;
  const { notificationId } = req.params;
  const notification = await Notification.findOneAndUpdate(
    {
      _id: notificationId,
      account: currentAccountId,
    },
    {
      $set: {
        read: true,
      },
    },
    { new: true }
  );
  if (!notification) {
    throw ApiError.notFound("Notification not found");
  }
  sendResponse(res, notification);
};