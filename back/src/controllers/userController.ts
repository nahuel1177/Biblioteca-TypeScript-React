import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { userRepository } from "../repositories/userRepository";
import { roleRepository } from "../repositories/roleRepository";
import User from "../entities/User"

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
  const { name, lastname, username, email, password, roleId } = req.body;
  try {
    
    const role = await roleRepository.getRoleById(roleId);

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    if (!role) {
      return res.status(400).json({ message: 'Role not found' });
    }
    console.log("Hash", hashedPassword)

    const user = new User({
      name: name,
      lastname: lastname,
      username: username,
      email: email,
      password: hashedPassword,
      role: role._id
    });
  
    console.log("Creado", user)
    const createdUser = await userRepository.createUser(user);
    return res.status(201).json(createdUser);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const user = { getUsers, getUserById, createUser };
export default user;
