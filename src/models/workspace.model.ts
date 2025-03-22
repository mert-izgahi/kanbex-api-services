import mongoose, { Document } from "mongoose";

export interface IWorkspace extends Document {
  name: string;
  description?: string;
  imageUrl?: string;
  account: mongoose.Schema.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export const workspaceSchema = new mongoose.Schema<IWorkspace>(
  {
    name: { type: String, required: true },
    description: { type: String },
    imageUrl: { type: String },
    account: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Account",
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);


workspaceSchema.virtual("members", {
  ref: "Member",
  localField: "_id",
  foreignField: "workspace",
});

workspaceSchema.virtual("projects", {
  ref: "Project",
  localField: "_id",
  foreignField: "workspace",
});

export const Workspace = mongoose.model<IWorkspace>(
  "Workspace",
  workspaceSchema
);
