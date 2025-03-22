import { Request, Response } from "express";
import { ApiError } from "../lib/api-error";
import { sendResponse } from "../helpers/utils";
import { Member } from "../models/member.model";

export const getMembers = async (req: Request, res: Response) => {
  const { currentAccountId } = res.locals;

  const member = await Member.findOne({
    workspace: req.query.workspace,
    account: currentAccountId,
  });

  if (!member) {
    throw ApiError.forbidden("You are not admin of this workspace");
  }

  const { workspace } = req.query;

  const members = await Member.find({ workspace: workspace }).populate({
    path: "account",
    select: "-password",
  });
  sendResponse(res, members);
};

export const getMembersByProjectId = async (req: Request, res: Response) => {
  const { projectId } = req.params;
  console.log({ projectId });
  
  const members = await Member.find({ project: projectId }).populate({
    path: "account",
    select: "-password",
  });
  sendResponse(res, members);
};
