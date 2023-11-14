import { Request, Response } from "express";
import { userService } from "../services/userService";
import { logger } from "../logs/logs";

export const getUsers = async (_: Request, res: Response) => {
  try {
    const { code, result } = await userService.getUsers();
    res.status(code).json(result);
  } catch (error) {
    logger.error(`user controller - getUsers\n ${error}`);
    res.status(500).json({ success: false, data: "Internal Server Error" });
  }
};

const getUserById = async (req: Request, res: Response) => {
  try {
    const { code, result } = await userService.getUserById(req);
    res.status(code).json(result);
  } catch (error) {
    logger.error(`user controller - getUsersById\n ${error}`);
    res.status(500).json({ success: false, data: "Internal Server Error" });
  }
};

const createUser = async (req: Request, res: Response) => {
  try {
    const { code, result } = await userService.createUser(req);
    res.status(code).json(result);
  } catch (error) {
    logger.error(`user controller - createUser\n ${error}`);
    res.status(500).json({ success: false, data: "Internal Server Error" });
  }
};

const deleteUser = async (req: Request, res: Response) => {
  console.log("Entro al controlador: ", req.params)
  try {
    const { code, result } = await userService.deleteUser(req);
    res.status(code).json(result);
  } catch (error) {
    logger.error(`user controller - updateUser\n ${error}`);
    res.status(500).json({ success: false, data: "Internal Server Error" });
  }
};

const user = { getUsers, getUserById, createUser, deleteUser };
export default user;
