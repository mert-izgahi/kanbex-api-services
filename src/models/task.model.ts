import mongoose, { Document } from "mongoose";
import { TaskStatus, TaskPriority } from "../lib/enums";

export interface ITask extends Document {
  name: string;
  description: string;
  media?: string;
  mediaType?: string;
  project: mongoose.Schema.Types.ObjectId;
  workspace: mongoose.Schema.Types.ObjectId;
  account: mongoose.Schema.Types.ObjectId;
  assignee: mongoose.Schema.Types.ObjectId;
  status: TaskStatus;
  priority: TaskPriority;
  position: number;
  dueDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

const taskSchema = new mongoose.Schema<ITask>(
  {
    name: { type: String, required: true },
    description: { type: String },
    media: { type: String },
    mediaType: { type: String },
    project: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Project",
    },
    workspace: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Workspace",
    },
    account: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Account",
    },
    assignee: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Member",
    },
    status: { type: String, required: true },
    priority: { type: String, required: true },
    position: { type: Number, required: true, min: 1000, max: 9999 },
    dueDate: { type: Date },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

export const Task = mongoose.model<ITask>("Task", taskSchema);
