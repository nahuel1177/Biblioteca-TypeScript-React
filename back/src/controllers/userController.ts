import { Request, Response } from "express";
import { userRepository } from "../repositories/userRepository";

const getUsers = async (_: Request, res: Response) => {
  try {
    const users = await userRepository.getUsers();

    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getUserById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const user = await userRepository.getUserById(id);

    if (!user) {
      res.status(404).json({ error: "User not found" });

      return;
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const createUser = async (req: Request, res: Response) => {
  const { username, email, password } = req.body;

  try {
    const newUser = {
      username,
      email,
      password
    };

    const createdUser = await userRepository.createUser(newUser);

    res.status(201).json(createdUser);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const user = { getUsers, getUserById, createUser };
export default user;
