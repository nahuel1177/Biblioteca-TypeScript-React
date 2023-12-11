import { Request, Response } from "express";
import { loanService } from "../services/loanService";
import { logger } from "../logs/logs";

export const getLoans = async (_: Request, res: Response) => {
  try {
    const { code, result } = await loanService.getLoans();
    res.status(code).json(result);
  } catch (error) {
    logger.error(`loan controller - getLoans\n ${error}`);
    res.status(500).json({ success: false, data: "Internal Server Error" });
  }
};

export const getAllLoans = async (_: Request, res: Response) => {
  try {
    const { code, result } = await loanService.getAllLoans();
    res.status(code).json(result);
  } catch (error) {
    logger.error(`loan controller - getLoans\n ${error}`);
    res.status(500).json({ success: false, data: "Internal Server Error" });
  }
};

const getLoanById = async (req: Request, res: Response) => {
  try {
    const { code, result } = await loanService.getLoanById(req);
    res.status(code).json(result);
  } catch (error) {
    logger.error(`loan controller - getLoansById\n ${error}`);
    res.status(500).json({ success: false, data: "Internal Server Error" });
  }
};

const createLoan = async (req: Request, res: Response) => {
  try {
    const { code, result } = await loanService.createLoan(req);
    res.status(code).json(result);
  } catch (error) {
    logger.error(`loan controller - createLoan\n ${error}`);
    res.status(500).json({ success: false, data: "Internal Server Error" });
  }
};

const deleteLoan = async (req: Request, res: Response) => {
  try {
    const { code, result } = await loanService.deleteLoan(req);
    res.status(code).json(result);
  } catch (error) {
    logger.error(`loan controller - updateLoan\n ${error}`);
    res.status(500).json({ success: false, data: "Internal Server Error" });
  }
};

const loan = { getLoans, getAllLoans, getLoanById, createLoan, deleteLoan };
export default loan;
