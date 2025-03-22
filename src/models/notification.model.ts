import mongoose, { Document } from "mongoose";
import { NotificationType } from "../lib/enums";

export interface INotification extends Document {
  account: mongoose.Schema.Types.ObjectId;
  type: NotificationType;
  message: string;
  metadata: object;
  read: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const notificationSchema = new mongoose.Schema<INotification>(
  {
    account: { type: mongoose.Schema.Types.ObjectId, ref: "Account", required: true },
    type: { type: String, required: true },
    message: { type: String, required: true },
    metadata: { type: Object, default: {} },
    read: { type: Boolean, default: false },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

export const Notification = mongoose.model<INotification>(
  "Notification",
  notificationSchema
);