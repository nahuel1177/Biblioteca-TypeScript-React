import { Request } from "express";
import { memberRepository } from "../repositories/memberRepository";
import { bookRepository } from "../repositories/bookRepository";
import { loanRepository } from "../repositories/loanRepository";
import Loan from "../entities/Loan";

class LoanService {
  async getLoans() {
    const loans = await loanRepository.getLoans();

    if (!loans.length) {
        console.log("ENTRO AL IF")
      return {
        code: 200,
        result: {
          result: [],  
          error: "Loan not founded.",
          success: false,
        },
      };
    }
    return {
        code: 200,
        result: {
          result: loans,
          success: true,
        },
      };
  }

  async getLoanById(req: Request) {
    const { id } = req.params;

    const loan = await loanRepository.getLoanById(id);
    if (!loan) {
        return {
            code: 404,
            result: {
              error: "Update",
              success: false,
            },
          };
    }
    return {
        code: 200,
        result: {
          result: loan,
          success: true,
        },
      };
  }

  async createLoan(req: Request) {
    const { bookId, memberId } = req.body;
      
      const member = await memberRepository.getMemberById(memberId);
      const book = await bookRepository.getBookById(bookId);
    
      if (!member || !book) {
        return {
            code: 200,
            result: {
              error: "Loans was not created",
              success: false,
            },
          };
      }
  
      const loan = new Loan({
        bookId: book._id,
        memberId: member._id,
        createdAt: new Date(),
      });
    
      console.log("Creado", loan)
      const createdLoan = await loanRepository.createLoan(loan);
    if (!createdLoan) {
        return {
            code: 500,
            result: {
              error: "Loan was not created",
              success: false,
            },
          };
    }
    return {
        code: 201,
        result: {
          result: createdLoan,
          success: true,
        },
      };
  }

  async updateLoan(req: Request) {
    const { id } = req.params;
    const { name } = req.body;
    const updatedLoan = await loanRepository.updateLoan(id, {
      name,
    });
    if (!updatedLoan) {
        return {
            code: 200,
            result: {
              error: "Loan was not updated",
              success: false,
            },
          };
    }
    return {
        code: 200,
        result: {
          result: updatedLoan,
          success: true,
        },
      };
  }
}
export const loanService = new LoanService();