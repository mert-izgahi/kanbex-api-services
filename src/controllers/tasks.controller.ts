import { Request, Response } from "express";
import { ApiError } from "../lib/api-error";
import { sendResponse } from "../helpers/utils";
import { Task } from "../models/task.model";
import { Member } from "../models/member.model";
import { Role } from "../lib/enums";
import { Project } from "../models/project.model";
import configs from "../configs";
import dayjs from "dayjs";
import { Account } from "../models/account.model";
import { Workspace } from "../models/workspace.model";

export const getTasks = async (req: Request, res: Response) => {
  const {
    projectId,
    workspaceId,
    status,
    priority,
    dueDate,
    search,
    sortBy,
    sortOrder,
  } = req.query;

  if (!projectId) {
    throw ApiError.notFound("Project not found");
  }

  const query = {
    workspace: workspaceId,
    project: projectId,
  } as any;

  if (status) {
    query["status"] = status;
  }

  if (priority) {
    query["priority"] = priority;
  }

  if (dueDate) {
    const parsedDate = new Date(dueDate as string);
    if (!isNaN(parsedDate.getTime())) {
      const startOfTheDay = dayjs(parsedDate).startOf("day").toDate();
      const endOfTheDay = dayjs(parsedDate).endOf("day").toDate();
      query["dueDate"] = {
        $gte: startOfTheDay,
        $lte: endOfTheDay,
      };
    }
  }

  if (search) {
    query["$or"] = [
      { name: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
    ];
  }

  const sortByValue = (sortBy as string) || "createdAt";
  const sortOrderValue = sortOrder === "asc" ? 1 : -1;

  const tasks = await Task.find(query)
    .populate({
      path: "assignee",
      populate: {
        path: "account", // Assuming Member has a `user` field referencing another collection
        model: "Account",
      },
    })
    .populate("account")
    .sort({ [sortByValue]: sortOrderValue });
  sendResponse(res, tasks);
};

export const getMyTasks = async (req: Request, res: Response) => {
  const { currentAccountId } = res.locals;
  // Check if current user is exist
  const account = await Account.findById(currentAccountId);

  if (!account) {
    throw ApiError.notFound("User not found");
  }

  const {
    projectId,
    workspaceId,
    status,
    priority,
    dueDate,
    search,
    sortBy,
    sortOrder,
  } = req.query;

  // Check if workspace exist
  const workspace = await Workspace.findOne({ _id: workspaceId });

  if (!workspace) {
    throw ApiError.notFound("Workspace not found");
  }

  const accountMembers = await Member.find({
    account: currentAccountId,
  });

  const query = {
    workspace: workspaceId,
    assignee: {
      $in: accountMembers.map((member) => member._id),
    },
  } as any;

  if (status) {
    query["status"] = status;
  }

  if (priority) {
    query["priority"] = priority;
  }

  if (projectId) {
    query["project"] = projectId;
  }

  if (dueDate) {
    const parsedDate = new Date(dueDate as string);
    if (!isNaN(parsedDate.getTime())) {
      const startOfTheDay = dayjs(parsedDate).startOf("day").toDate();
      const endOfTheDay = dayjs(parsedDate).endOf("day").toDate();
      query["dueDate"] = {
        $gte: startOfTheDay,
        $lte: endOfTheDay,
      };
    }
  }

  if (search) {
    query["$or"] = [
      { name: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
    ];
  }

  const sortByValue = (sortBy as string) || "createdAt";
  const sortOrderValue = sortOrder === "asc" ? 1 : -1;

  const tasks = await Task.find(query)
    .populate({
      path: "assignee",
      populate: {
        path: "account", // Assuming Member has a `user` field referencing another collection
        model: "Account",
      },
    })
    .populate("account project workspace")
    .sort({ [sortByValue]: sortOrderValue });

  console.log(tasks);

  sendResponse(res, tasks);
};

export const getTask = async (req: Request, res: Response) => {
  const { taskId } = req.params;
  const task = await Task.findOne({ _id: taskId })
    .populate({
      path: "assignee",
      populate: {
        path: "account",
        model: "Account",
      },
    })
    .populate("project workspace");

  if (!task) {
    throw ApiError.notFound("Task not found");
  }  
  sendResponse(res, task);
};

export const createTask = async (req: Request, res: Response) => {
  const { currentAccountId } = res.locals;

  const { workspaceId } = req.body;
  // Check if workspace exist
  const workspace = await Workspace.findOne({ _id: workspaceId });
  if (!workspace) {
    throw ApiError.notFound("Workspace not found");
  }
  // Check if current user is member
  const member = await Member.findOne({
    workspace: workspaceId,
    account: currentAccountId,
    role: Role.MEMBER,
  });

  if (member) {
    throw ApiError.forbidden("You are member of this workspace");
  }

  const { projectId } = req.body;

  // Check if project exist
  const project = await Project.findOne({ _id: projectId });
  if (!project) {
    throw ApiError.notFound("Project not found");
  }

  const { assigneeId } = req.body;

  // Check if assignee exist
  const assignee = await Member.findOne({ _id: assigneeId });
  if (!assignee) {
    throw ApiError.notFound("Assignee not found");
  }

  // Find Highest task position
  const tasks = await Task.find({ project: projectId }).sort({ position: -1 });
  const position =
    tasks.length > 0
      ? tasks[0].position + 1
      : Number(configs.TASK_POSITION_INCREMENT);

  const task = await Task.create({
    ...req.body,
    project: projectId,
    workspace: workspaceId,
    assignee: assigneeId,
    account: currentAccountId,
    position,
  });

  sendResponse(res, task);
};

export const updateTask = async (req: Request, res: Response) => {
  const { taskId } = req.params;

  const { assigneeId } = req.body;

  // Check if assignee exist
  const assignee = await Member.findOne({ _id: assigneeId });
  if (!assignee) {
    throw ApiError.notFound("Assignee not found");
  }

  // Find Account of assignee
  const account = await Account.findOne({ _id: assignee.account });
  if (!account) {
    throw ApiError.notFound("Account not found");
  }

  const task = await Task.findOneAndUpdate(
    {
      _id: taskId,
    },
    { ...req.body, assignee: assignee._id },
    { new: true }
  );
  if (!task) {
    throw ApiError.notFound("Task not found");
  }
  sendResponse(res, task);
};

export const deleteTask = async (req: Request, res: Response) => {
  const { taskId } = req.params;
  const task = await Task.findOneAndDelete({ _id: taskId });
  if (!task) {
    throw ApiError.notFound("Task not found");
  }
  sendResponse(res, task);
};

export const updateTaskPosition = async (req: Request, res: Response) => {
  const { taskId } = req.params;
  const { position } = req.body;
  const task = await Task.findOneAndUpdate(
    {
      _id: taskId,
    },
    { position: position + Number(configs.TASK_POSITION_INCREMENT) },
    { new: true }
  );
  if (!task) {
    throw ApiError.notFound("Task not found");
  }
  sendResponse(res, task);
};

export const updateTaskStatus = async (req: Request, res: Response) => {
  const { taskId } = req.params;
  const { status } = req.body;
  const task = await Task.findOneAndUpdate(
    {
      _id: taskId,
    },
    { status },
    { new: true }
  );
  if (!task) {
    throw ApiError.notFound("Task not found");
  }
  sendResponse(res, task);
};
