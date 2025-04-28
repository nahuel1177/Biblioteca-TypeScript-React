import { Request, Response } from "express";
import { authService } from "../services/authService";
import { logger } from "../logs/logs";

const login = async (req: Request, res: Response) => {

  try {
    const { statusCode, data } = await authService.login(req);
    res.status(statusCode).json(data);
  } catch (error) {
    logger.error(`auth controller - login\n ${error}`);
    res.status(500).json({ success: false, data: "Internal Server Error" });
  }
};
const auth = { login };
export default auth;