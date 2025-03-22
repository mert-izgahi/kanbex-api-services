import { Request, Response } from "express";
import { ApiError } from "../lib/api-error";
import { sendResponse } from "../helpers/utils";
import { Account } from "../models/account.model";

import { AuthProvider } from "../lib/enums";

export const signUp = async (req: Request, res: Response) => {
  const { email } = req.body;
  const existingUser = await Account.findOne({ email });
  if (existingUser) {
    throw ApiError.duplicatedEmail("Email already exist");
  }
  const account = await Account.create({
    ...req.body,
    provider: AuthProvider.CREDENTIALS,
  });
  const accessToken = account.generateToken();
  sendResponse(res, {
    ...account.toJSON(),
    accessToken,
  });
};

export const signIn = async (req: Request, res: Response) => {
  const { email } = req.body;
  const account = await Account.findOne({ email });
  if (!account) {
    throw ApiError.notFound("User not found");
  }
  const isValid = await account.comparePassword(req.body.password);
  if (!isValid) {
    throw ApiError.invalidCredentials("Invalid credentials");
  }
  const accessToken = account.generateToken();
  sendResponse(res, {
    ...account.toJSON(),
    accessToken,
  });
};

export const authCallback = async (req: Request, res: Response) => {
  const { email, firstName, lastName, imageUrl, provider } = req.body;
  let account = await Account.findOne({ email });

  if (!account) {
    account = await Account.create({
      email,
      firstName,
      lastName,
      imageUrl,
      provider,
    });
  }
  const accessToken = account.generateToken();
  sendResponse(res, {
    ...account.toJSON(),
    accessToken,
  });
};

export const getMe = async (req: Request, res: Response) => {
  const { currentAccountId } = res.locals;
  const account = await Account.findById(currentAccountId);
  if (!account) {
    throw ApiError.notFound("User not found");
  }

  sendResponse(res, account);
};

export const signOut = async (req: Request, res: Response) => {
  sendResponse(res, { data: null });
};


