import { Request, Response } from "express";
import { ApiError } from "../lib/api-error";
import { sendResponse } from "../helpers/utils";
import { Project } from "../models/project.model";
import { Member } from "../models/member.model";
import { Role } from "../lib/enums";

export const getProjects = async (req: Request, res: Response) => {
  const { workspace } = req.query;
  const { currentAccountId } = res.locals;
  const member = await Member.findOne({
    workspace: workspace,
    account: currentAccountId,
    role: { $in: [Role.MANAGER, Role.ADMIN] },
  });

  if (!member) {
    throw ApiError.forbidden("You are not admin of this workspace");
  }

  // Find Project for admins members and managers
  const workspaceMembers = await Member.find({
    workspace: workspace,
    role: { $in: [Role.MANAGER, Role.ADMIN] },
  });

  const projects = await Project.find({
    workspace: workspace,
  });
  sendResponse(res, projects);
};

export const getProject = async (req: Request, res: Response) => {
  const { projectId } = req.params;
  const project = await Project.findOne({ _id: projectId }).populate(
    "workspace"
  );
  if (!project) {
    throw ApiError.notFound("Project not found");
  }

  // Get Project Members
  const projectMembers = await Member.find({
    project: projectId,
  }).populate("account");

  // Workspace Members
  const workspaceMembers = await Member.find({
    workspace: project.workspace,
  }).populate("account");

  // WorkspaceManagers
  const workspaceManagers = await Member.find({
    workspace: project.workspace,
    role: Role.MANAGER,
  }).populate("account");

  // Admin
  const workspaceAdmin = await Member.findOne({
    workspace: project.workspace,
    role: Role.ADMIN,
  }).populate("account");

  sendResponse(res, {
    ...project.toJSON(),
    projectMembers,
    workspaceMembers,
    workspaceManagers,
    workspaceAdmin,
  });
};

export const createProject = async (req: Request, res: Response) => {
  const { currentAccountId } = res.locals;

  const { workspaceId } = req.body;

  // Check if current user is admin
  const member = await Member.findOne({
    workspace: workspaceId,
    account: currentAccountId,
    role: Role.ADMIN,
  });

  if (!member) {
    throw ApiError.forbidden("You are not admin of this workspace");
  }

  const project = await Project.create({
    ...req.body,
    account: currentAccountId,
    workspace: workspaceId,
  });

  sendResponse(res, project);
};

export const updateProject = async (req: Request, res: Response) => {
  const { currentAccountId } = res.locals;

  // Check if current user is admin
  const member = await Member.findOne({
    workspace: req.body.workspaceId,
    account: currentAccountId,
    role: Role.ADMIN,
  });

  if (!member) {
    throw ApiError.forbidden("You are not admin of this workspace");
  }

  delete req.body.workspaceId;
  delete req.body.account;

  const { projectId } = req.params;
  const project = await Project.findOneAndUpdate(
    {
      _id: projectId,
    },
    { ...req.body },
    { new: true }
  );
  if (!project) {
    throw ApiError.notFound("Project not found");
  }
  sendResponse(res, project);
};

export const deleteProject = async (req: Request, res: Response) => {
  const { currentAccountId } = res.locals;

  // Check if current user is admin
  const member = await Member.findOne({
    workspace: req.query.workspaceId,
    account: currentAccountId,
    role: Role.ADMIN,
  });

  if (!member) {
    throw ApiError.forbidden("You are not admin of this workspace");
  }

  const { projectId } = req.params;
  const project = await Project.findOneAndDelete({
    _id: projectId,
  });
  if (!project) {
    throw ApiError.notFound("Project not found");
  }
  sendResponse(res, project);
};
