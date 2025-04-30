import { Request, NextFunction, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

declare global {
  namespace Express {
    interface Request {
      isAdmin: () => boolean;
      isEmployee: () => boolean;
      user: any;
    }
  }
}

export const authorization =
  (roles: string[]) => (req: Request, res: Response, next: NextFunction) => {
    const token = getToken(req);
    console.log("Autorization middleware");
    if (!token) {
      res.status(403).json({ message: "Unauthorized" });
      return;
    }
    try {
      
      const user = jwt.verify(token, "SECRET_KEY") as JwtPayload;
      if (!roles.includes(user.role)) {
        res.status(403).json({ message: "Unauthorized" });
      } else {
        next();
      }
    } catch (error) {
      res.status(403).json({ message: "Unauthorized" });
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