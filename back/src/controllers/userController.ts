import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { userRepository } from "../repositories/userRepository";
import { roleRepository } from "../repositories/roleRepository";

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
  const {name, lastname, username, email, password, roleId } = req.body;
  const role = await roleRepository.getRoleById(roleId);
  try {

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    if (!role) {
      return res.status(400).json({ message: 'Role not found' });
    }
    console.log("Hash", hashedPassword)
    const newUser = {
      name,
      lastname,
      username,
      email,
      password: hashedPassword,
      role: role._id
    };
    console.log("Creado", newUser)
    const createdUser = await userRepository.createUser(newUser);

    res.status(201).json(createdUser);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const user = { getUsers, getUserById, createUser };
export default user;
