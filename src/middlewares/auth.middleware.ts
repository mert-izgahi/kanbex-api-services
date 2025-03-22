import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import configs from "../configs";
import { ApiError } from "../lib/api-error";
import { logger } from "../lib/logger";

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    console.log(token);

    if (!token) {
      next();
      return;
    }
    let decoded = null;
    try {
      decoded = jwt.verify(token, configs.JWT_SECRET!) as {
        id: string;
        role: string;
      };
    } catch (error) {
      const isExpired = error instanceof jwt.TokenExpiredError;
      

      if (isExpired) {
        res.status(401).json({
          result: null,
          result_message: {
            status: 401,
            message: "Token expired",
            title: "Unauthorized",
          },
        });
        return;
      }
    }

    if (!decoded) {
      next();
      return;
    }

    const currentAccountId = decoded.id;
    if (!currentAccountId) {
      next();
      return;
    }

    res.locals.currentAccountId = currentAccountId;
    next();
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : error;
    logger.error(errorMessage, "Error in auth middleware");
  }
};

export const withAuth = (req: Request, res: Response, next: NextFunction) => {
  const { currentAccountId } = res.locals;
  console.log({currentAccountId});
  
  if (!currentAccountId) {
    throw ApiError.invalidCredentials("Unauthorized");
  }
  return next();
};
