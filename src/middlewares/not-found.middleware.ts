﻿import { NextFunction, Request, Response } from "express";
export const notFoundMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.status(404).json({
    result: null,
    result_message: {
      status: 404,
      message: "Route not found",
      title: "NotFound",
    },
  });
  next();
};
