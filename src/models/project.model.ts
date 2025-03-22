import mongoose, { Document } from "mongoose";

export interface IProject extends Document {
  name: string;
  description: string;
  color?: string;
  workspace: mongoose.Schema.Types.ObjectId;
  account: mongoose.Schema.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const projectSchema = new mongoose.Schema<IProject>(
  {
    name: { type: String, required: true },
    description: { type: String },
    color: { type: String },
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
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

export const Project = mongoose.model<IProject>("Project", projectSchema);
