import { Request, Response } from "express";
import { memberService } from "../services/memberService";
import { logger } from "../logs/logs";

export const getMembers = async (_: Request, res: Response) => {
  try {
    const { code, result } = await memberService.getMembers();
    res.status(code).json(result);
  } catch (error) {
    logger.error(`member controller - getMembers\n ${error}`);
    res.status(500).json({ success: false, data: "Internal Server Error" });
  }
};

const getMemberById = async (req: Request, res: Response) => {
  try {
    const { code, result } = await memberService.getMemberById(req);
    res.status(code).json(result);
  } catch (error) {
    logger.error(`member controller - getMemberById\n ${error}`);
    res.status(500).json({ success: false, data: "Internal Server Error" });
  }
};

const getMemberByMail = async (req: Request, res: Response) => {
  try {
    const { code, result } = await memberService.getMemberByMail(req);
    res.status(code).json(result);
  } catch (error) {
    logger.error(`member controller - getMemberByMail\n ${error}`);
    res.status(500).json({ success: false, data: "Internal Server Error" });
  }
};

const getMemberByDni = async (req: Request, res: Response) => {
  try {
    const { code, result } = await memberService.getMemberByDni(req);
    res.status(code).json(result);
  } catch (error) {
    logger.error(`member controller - getMermberByDni\n ${error}`);
    res.status(500).json({ success: false, data: "Internal Server Error" });
  }
};

const createMember = async (req: Request, res: Response) => {
  try {
    const { code, result } = await memberService.createMember(req);
    res.status(code).json(result);
  } catch (error) {
    logger.error(`member controller - createMember\n ${error}`);
    res.status(500).json({ success: false, data: "Internal Server Error" });
  }
};

const updateMember = async (req: Request, res: Response) => {
  try {
    const { code, result } = await memberService.updateMember(req);
    res.status(code).json(result);
  } catch (error) {
    logger.error(`member controller - updateMember\n ${error}`);
    res.status(500).json({ success: false, data: "Internal Server Error" });
  }
};

const deleteMember = async (req: Request, res: Response) => {
  try {
    const { code, result } = await memberService.deleteMember(req);
    res.status(code).json(result);
  } catch (error) {
    logger.error(`member controller - deleteMember\n ${error}`);
    res.status(500).json({ success: false, data: "Internal Server Error" });
  }
};

const sanctionMember = async (req: Request, res: Response) => {
  try {
    const { code, result } = await memberService.sanctionMember(req);
    res.status(code).json(result);
  } catch (error) {
    logger.error(`member controller - sanctionMember\n ${error}`);
    res.status(500).json({ success: false, data: "Internal Server Error" });
  }
};

const member = {
  getMembers,
  getMemberById,
  getMemberByDni,
  getMemberByMail,
  createMember,
  deleteMember,
  updateMember,
  sanctionMember,
};
export default member;
