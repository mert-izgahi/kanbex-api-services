import { Request, Response } from "express";
import { ApiError } from "../lib/api-error";
import { generateInviteCode, sendResponse } from "../helpers/utils";
import { Workspace } from "../models/workspace.model";
import { Notification } from "../models/notification.model";
import { Member } from "../models/member.model";
import { Role, TaskStatus } from "../lib/enums";
import { Account } from "../models/account.model";
import { Project } from "../models/project.model";
import { Task } from "../models/task.model";

export const createWorkspace = async (req: Request, res: Response) => {
  const { currentAccountId } = res.locals;
  const inviteCode = generateInviteCode();
  const workspace = await Workspace.create({
    ...req.body,
    inviteCode,
    account: currentAccountId,
  });

  // Create Get Started Project
  const project = await Project.create({
    name: "Get Started",
    workspace: workspace._id,
    account: currentAccountId,
  });

  // Set current user as admin
  await Member.create({
    workspace: workspace._id,
    project: project._id,
    account: currentAccountId,
    role: Role.ADMIN,
  });

  // Create notification

  await Notification.create({
    account: currentAccountId,
    type: "workspace",
    message: "You have created a new workspace",
    metadata: {
      relatedItemId: workspace._id,
    },
  });
  sendResponse(res, workspace);
};

export const getWorkspaces = async (req: Request, res: Response) => {
  const { currentAccountId } = res.locals;
  const memberIn = await Member.find({
    account: currentAccountId,
  });

  const workspacesIds = memberIn.map((member) => member.workspace);

  const workspaces = await Workspace.find({
    _id: { $in: workspacesIds },
  });

  sendResponse(res, workspaces);
};

export const getWorkspace = async (req: Request, res: Response) => {
  const { currentAccountId } = res.locals;
  const { workspaceId } = req.params;
  const workspace = await Workspace.findOne({
    _id: workspaceId,
  }).populate("projects");

  if (!workspace) {
    throw ApiError.notFound("Workspace not found");
  }

  const member = await Member.findOne({
    workspace: workspaceId,
    account: currentAccountId,
  });

  const currentAccountPermission = member?.role;
  const currentAccountStatus = member?.status;
  if (!member) {
    throw ApiError.forbidden("You are not member of this workspace");
  }

  sendResponse(res, {
    ...workspace.toJSON(),
    currentAccountPermission,
    currentAccountStatus,
  });
};

export const updateWorkspace = async (req: Request, res: Response) => {
  const { currentAccountId } = res.locals;
  const { workspaceId } = req.params;

  // Check if current user is admin
  const member = await Member.findOne({
    workspace: workspaceId,
    account: currentAccountId,
    role: Role.ADMIN,
  });

  if (!member) {
    throw ApiError.forbidden("You are not admin of this workspace");
  }

  const workspace = await Workspace.findOneAndUpdate(
    {
      _id: workspaceId,
    },
    { ...req.body },
    { new: true }
  );
  if (!workspace) {
    throw ApiError.notFound("Workspace not found");
  }
  sendResponse(res, workspace);
};

export const deleteWorkspace = async (req: Request, res: Response) => {
  const { currentAccountId } = res.locals;
  const { workspaceId } = req.params;

  // Check if current user is admin
  const member = await Member.findOne({
    workspace: workspaceId,
    account: currentAccountId,
    role: Role.ADMIN,
  });

  if (!member) {
    throw ApiError.forbidden("You are not admin of this workspace");
  }

  const workspace = await Workspace.findOneAndDelete({
    _id: workspaceId,
  });
  if (!workspace) {
    throw ApiError.notFound("Workspace not found");
  }
  sendResponse(res, workspace);
};

export const searchAccountsByEmail = async (req: Request, res: Response) => {
  const { search } = req.query;


  const { workspaceId } = req.params;

  // Check if workspace exist
  const workspace = await Workspace.findOne({ _id: workspaceId });
  if (!workspace) {
    throw ApiError.notFound("Workspace not found");
  }

  // Check if current user is admin
  const workspaceAdminMember = await Member.findOne({
    workspace: workspaceId,
    account: res.locals.currentAccountId,
    role: Role.ADMIN,
  });

  if (!workspaceAdminMember) {
    throw ApiError.forbidden("You are not admin of this workspace");
  }

  const workspaceMembers = await Member.find({
    workspace: workspaceId,
  });

  const membersAccountIds = workspaceMembers.map((member) => member.account);

  const accounts = await Account.find({
    email: { $regex: search, $options: "i" },
    _id: { $nin: membersAccountIds },
  });

  sendResponse(res, accounts);
};

export const getWorkspacesAnalytics = async (req: Request, res: Response) => {
  const { workspaceId } = req.params;

  // Check if workspace exist
  const workspace = await Workspace.findOne({ _id: workspaceId });
  if (!workspace) {
    throw ApiError.notFound("Workspace not found");
  }

  // Get Workspace porjects count

  const projectsCount = await Project.countDocuments({
    workspace: workspaceId,
  }).populate("tasks");

  // Get Workspace tasks count
  const tasksCount = await Task.countDocuments({
    workspace: workspaceId,
  });

  // Get Workspace members count
  const membersCount = await Member.countDocuments({
    workspace: workspaceId,
  });

  // UnComplete Tasks count
  const unCompleteTasksCount = await Task.countDocuments({
    workspace: workspaceId,
    status: { $ne: TaskStatus.DONE },
  });

  // GET last workspace project

  const lastProjects = await Project.find({
    workspace: workspaceId,
  })
    .sort({ createdAt: -1 })
    .limit(5);

  // GET last workspace tasks

  const lastTasks = await Task.find({
    workspace: workspaceId,
  })
    .sort({ createdAt: -1 })
    .limit(5);

  sendResponse(res, {
    workspace,
    tasksCount,
    unCompleteTasksCount,
    projectsCount,
    membersCount,
    lastProjects,
    lastTasks,
  });
};
