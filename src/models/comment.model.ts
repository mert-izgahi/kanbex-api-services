import mongoose, { Document } from "mongoose";

export interface IComment extends Document {
  content: string;
  task: mongoose.Schema.Types.ObjectId;
  project: mongoose.Schema.Types.ObjectId;
  workspace: mongoose.Schema.Types.ObjectId;
  media?: string;
  mediaType?: string;
  account: mongoose.Schema.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const commentSchema = new mongoose.Schema<IComment>(
  {
    content: { type: String, required: true },
    task: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Task",
    },
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
    media: { type: String },
    mediaType: { type: String },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

export const Comment = mongoose.model<IComment>("Comment", commentSchema);