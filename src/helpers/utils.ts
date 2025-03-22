import { Response } from "express";

export const sendResponse = (res: Response, data: any) => {
  res.status(200).json({
    result: data,
    result_message: {
      status: 200,
      message: "Success",
      title: "Success",
    },
  });
};

export const generateInviteCode = (length = 6) => {
  let result = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};
