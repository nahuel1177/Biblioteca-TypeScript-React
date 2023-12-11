import { Request, Response } from "express";
import { roleRepository } from "../repositories/roleRepository";

const getRoles = async (_: Request, res: Response) => {
  try {
    const roles = await roleRepository.getRoles();

    res.status(200).json(roles);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getRoleById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const role = await roleRepository.getRoleById(id);

    if (!role) {
      res.status(404).json({ error: "role not found" });

      return;
    }
    res.status(200).json(role);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getRoleByType = async (req: Request, res: Response) => {
  const { type } = req.params;

  try {
    const role = await roleRepository.getRoleByType(type);

    if (!role) {
      res.status(404).json({ error: "role not found" });

      return;
    }

    res.status(200).json(role);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const createRole = async (req: Request, res: Response) => {
  const { type } = req.body;

  try {
    const newRole = {
      type,
    };

    console.log("Rol creado:", newRole);
    const createdRole = await roleRepository.createRole(newRole);

    return res.status(201).json(createdRole);
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const role = { getRoles, getRoleById, createRole, getRoleByType };
export default role;
