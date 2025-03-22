import mongoose, { Document } from "mongoose";
import { MemberStatus, Role } from "../lib/enums";

export interface IMember extends Document {
  workspace: mongoose.Schema.Types.ObjectId;
  account: mongoose.Schema.Types.ObjectId;
  project: mongoose.Schema.Types.ObjectId;
  role: Role;
  workspaces: mongoose.Schema.Types.ObjectId[];
  status: MemberStatus;
  createdAt: Date;
  updatedAt: Date;
}

export const memberSchema = new mongoose.Schema<IMember>(
  {
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
    project: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Project",
    },
    role: { type: String, required: true },
    status: { type: String, required: true, default: MemberStatus.ACTIVE },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

memberSchema.index({ workspace: 1, account: 1 }, { unique: true });

memberSchema.virtual("workspaces", {
  ref: "Workspace",
  localField: "_id",
  foreignField: "members",
});

export const Member = mongoose.model<IMember>("Member", memberSchema);
