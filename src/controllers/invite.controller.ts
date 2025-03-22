import { Request, Response } from "express";
import { ApiError } from "../lib/api-error";
import { generateInviteCode, sendResponse } from "../helpers/utils";
import { Invite } from "../models/invite.model";
import { Member } from "../models/member.model";
import { InviteStatus, NotificationType, Role } from "../lib/enums";
import { Account } from "../models/account.model";
import { Notification } from "../models/notification.model";
import { mailer } from "../lib/mailer";
import { Workspace } from "../models/workspace.model";
import dayjs from "dayjs";
export const createInvite = async (req: Request, res: Response) => {
  const { currentAccountId } = res.locals;
  const { workspaceId, projectId, email, role } = req.body;
  // Current user is exist
  const currentUser = await Account.findById(currentAccountId);

  if (!currentUser) {
    throw ApiError.notFound("User not found");
  }

  // Check if workspace exist
  const workspace = await Workspace.findOne({ _id: workspaceId });
  if (!workspace) {
    throw ApiError.notFound("Workspace not found");
  }
  // Check if current user is admin
  const workspaceAdminMember = await Member.findOne({
    workspace: workspaceId,
    account: currentAccountId,
    role: Role.ADMIN,
  });

  if (!workspaceAdminMember) {
    throw ApiError.forbidden("You are not admin of this workspace");
  }

  // Check if user already invited
  const targetAccount = await Account.findOne({ email });
  if (!targetAccount) {
    throw ApiError.notFound("User not found");
  }

  // Check if email equal to current user
  if (targetAccount && targetAccount._id === currentAccountId) {
    throw ApiError.forbidden("You cannot invite yourself");
  }

  // Check if user aleady member of workspace
  const workspaceMember = await Member.findOne({
    workspace: workspaceId,
    account: targetAccount._id,
  });

  if (workspaceMember) {
    throw ApiError.forbidden("User already member of this workspace");
  }

  const projectMember = await Member.findOne({
    project: projectId,
    account: targetAccount._id,
  });

  if (projectMember) {
    throw ApiError.forbidden("User already member of this project");
  }

  // Create invite
  const inviteCode = generateInviteCode();
  const invite = await Invite.create({
    workspace: workspaceId,
    project: projectId,
    account: currentAccountId,
    email: targetAccount.email,
    role,
    inviteCode,
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 1 day
  });

  // Create Notification
  await Notification.create({
    account: targetAccount._id,
    type: NotificationType.INVITE,
    message: "You have been invited to join a workspace",
    metadata: {
      relatedItemId: invite._id,
    },
  });

  // Send email
  await mailer.sendInvitationEmail(
    targetAccount.email,
    workspace,
    currentUser,
    invite
  );

  sendResponse(res, invite);
};

export const getInvite = async (req: Request, res: Response) => {
  const { currentAccountId } = res.locals;

  // Check if current user is exist
  const currentUser = await Account.findById(currentAccountId);

  if (!currentUser) {
    throw ApiError.notFound("User not found");
  }

  const { inviteId } = req.params;

  const invite = await Invite.findById(inviteId).populate("workspace account");

  if (!invite) {
    throw ApiError.notFound("Invite not found");
  }
  sendResponse(res, invite);
};

export const acceptInvite = async (req: Request, res: Response) => {
  const { currentAccountId } = res.locals;

  // Check if current user is exist
  const currentUser = await Account.findById(currentAccountId);

  if (!currentUser) {
    throw ApiError.notFound("User not found");
  }

  const { inviteId } = req.params;
  const { inviteCode } = req.body;

  const invite = await Invite.findOne({
    _id: inviteId,
    inviteCode,
  });

  if (!invite) {
    throw ApiError.notFound("Invite not found");
  }

  // Check if invite is expired
  if (dayjs().isAfter(dayjs(invite.expiresAt))) {
    invite.status = InviteStatus.EXPIRED;
    await invite.save();
    throw ApiError.forbidden("Invite is expired");
  }

  // Check if user already member of workspace
  const workspaceMember = await Member.findOne({
    workspace: invite.workspace,
    account: currentAccountId,
  });

  if (workspaceMember) {
    throw ApiError.forbidden("User already member of this workspace");
  }

  // Check if user already member of project
  const projectMember = await Member.findOne({
    project: invite.project,
    account: currentAccountId,
  });

  if (projectMember) {
    throw ApiError.forbidden("User already member of this project");
  }

  // Create member
  const member = await Member.create({
    workspace: invite.workspace,
    project: invite.project,
    account: currentAccountId,
    role: invite.role,
  });

  // Update invite status
  invite.status = InviteStatus.ACCEPTED;
  await invite.save();

  sendResponse(res, member);
};
