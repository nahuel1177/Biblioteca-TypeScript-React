import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

import { logger } from "../logs/logs";

export const authentication = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = getToken(req);
    if (!token) {
      return sendUnauthorizedResponse(res, "Unauthorized");
    }
    const user = jwt.verify(token, "SECRET_KEY");
    if (!user) {
      return sendUnauthorizedResponse(res, "Unauthorized");
    }
    req.user = user;
    next();
  } catch (error) {
    sendErrorResponse(res, "Internal server error");
  }
};

const getToken = (req: Request) => {
  const tokenRegex = /^\s*Bearer\s+(\S+)/g;
  const authorizationHeader = req.headers.authorization;
  if (!authorizationHeader) {
    return null;
  }
  const matches = tokenRegex.exec(authorizationHeader);
  if (!matches) {
    return null;
  }
  return matches[1];
};

const sendUnauthorizedResponse = (res: Response, message: string) => {
  res.status(401).json({ success: false, message });
};

const sendErrorResponse = (res: Response, message: string) => {
  logger.error(`authentication middleware - authentication\n  Error JWT`);
  res.status(500).json({ success: false, message });
};