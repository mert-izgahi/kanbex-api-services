import { Request, Response, NextFunction } from "express";
import { ApiError } from "../lib/api-error";
import { logger } from "../lib/logger";

export const errorHandlerMiddleware = (
  error: ApiError | Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errorMessage = error instanceof Error ? error.message : error;
  logger.error(errorMessage);
  
  
  if (error instanceof ApiError) {
    res.status(error.status).json({
      result: null,
      result_message: {
        status: error.status,
        message: error.message,
        title: error.title,
      },
    });
    return;
  }

  res.status(500).json({
    result: null,
    result_message: {
      status: 500,
      message: "Something went wrong!",
      title: "ERROR",
    },
  });
  next();
};
