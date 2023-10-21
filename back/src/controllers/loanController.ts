import { Request, Response } from "express";
import { loanRepository } from "../repositories/loanRepository";
import { bookRepository } from "../repositories/bookRepository";
import Loan from "../entities/Loan";
import { memberRepository } from "../repositories/memberRepository";

const getLoans = async (_: Request, res: Response) => {
  try {
    const loans = await loanRepository.getLoans();

    res.status(200).json(loans);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getLoanById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const loan = await loanRepository.getLoanById(id);

    if (!loan) {
      res.status(404).json({ error: "loan not found" });

      return;
    }

    res.status(200).json(loan);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const createLoan = async (req: Request, res: Response) => {
  const { memberId, bookId } = req.body; // Assuming you pass member and book IDs in the request body
  try {
    const member = await memberRepository.getMemberById(memberId);
    const book = await bookRepository.getBookById(bookId);

    if (!member || !book) {
      return res.status(400).json({ message: "Member or book not found" });
    }

    const loan = new Loan({
      member: member._id,
      book: book._id,
      createdAt: new Date(),
    });

    const createdLoan = await loanRepository.createLoan(loan);
    return res.status(201).json(createdLoan);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const loan = { getLoans, getLoanById, createLoan };
export default loan;
