import mongoose, { Document } from "mongoose";
import { InviteStatus, Role } from "../lib/enums";

export interface IInvite extends Document {
  workspace: mongoose.Schema.Types.ObjectId;
  project: mongoose.Schema.Types.ObjectId;
  account: mongoose.Schema.Types.ObjectId;
  email: string;
  role: Role;
  inviteCode: string;
  status: InviteStatus;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const inviteSchema = new mongoose.Schema<IInvite>(
  {
    workspace: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Workspace",
    },
    project: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Project",
    },
    account: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Account",
    },
    email: { type: String, required: true, lowercase: true },
    role: { type: String, required: true, default: Role.MEMBER },
    inviteCode: { type: String, required: true, unique: true },
    status: { type: String, required: true, default: InviteStatus.PENDING },
    expiresAt: { type: Date, required: true },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

export const Invite = mongoose.model<IInvite>("Invite", inviteSchema);
