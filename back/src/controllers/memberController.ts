import { Request, Response } from "express";
import { memberRepository } from "../repositories/memberRepository";

const getMembers = async (_: Request, res: Response) => {
  try {
    const members = await memberRepository.getMembers();

    res.status(200).json(members);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getMemberById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const member = await memberRepository.getMemberById(id);

    if (!member) {
      res.status(404).json({ error: "Miembro no encontrado" });

      return;
    }

    res.status(200).json(member);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const createMember = async (req: Request, res: Response) => {
    const { name, lastname, email, status } = req.body;

  try {
    const newMember = {
      name,
      lastname,
      email,
      status
    };

    console.log("Miembro creado",newMember);
    const createdMember = await memberRepository.createMember(newMember);

    res.status(201).json(createdMember);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const member = { getMembers, getMemberById, createMember };
export default member;