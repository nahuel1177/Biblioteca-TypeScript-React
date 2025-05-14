import { Request } from "express";
import { loanRepository } from "../repositories/loanRepository";
import Loan from "../entities/Loan";
import { bookRepository } from "../repositories/bookRepository";

class LoanService {
  async getLoans() {
    const loans = await loanRepository.getLoans({ isActive: true });

    if (!loans.length) {
      return {
        code: 500,
        result: {
          result: [],
          error: "Préstamo no encotrado.",
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
  async getAllLoans() {
    const loans = await loanRepository.getLoans();

    if (!loans.length) {
      return {
        code: 500,
        result: {
          result: [],
          error: "Préstamo no encotrado.",
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
    const { bookId, memberId, type } = req.body;
    if (!memberId || !bookId) {
      return {
        code: 500,
        result: {
          error: "EL prestamo no es posible. Libro o socio inexistente.",
          success: false,
        },
      };
    }
    const takenBook = await bookRepository.getBookById(bookId);

    if (takenBook == null) {
      return {
        code: 500,
        result: {
          error: "EL préstamo no es posible, el libro no existe.",
          success: false,
        },
      };
    }
    if (type == "external") {
      if (takenBook?.stockExt !== undefined && takenBook.stockExt > 0) {
        takenBook.stockExt--;
      } else {
        return {
          code: 500,
          result: {
            error: "No hay ejemplares para el préstamo en biblioteca.",
            success: false,
          },
        };
      }
    }

    if (type == "internal") {
      if (takenBook?.stockInt !== undefined && takenBook.stockInt > 0) {
        takenBook.stockInt--;
      } else {
        return {
          code: 500,
          result: {
            error: "No hay ejemplares para el préstamo en biblioteca.",
            success: false,
          },
        };
      }
      bookRepository.updateBook(takenBook.id, takenBook);
      const dateLimit = new Date();
      const loan = new Loan({
        bookId: bookId,
        memberId: memberId,
        type: type,
        dateLimit: dateLimit,
      });
      const createdLoan = await loanRepository.createLoan(loan);

      if (!createdLoan) {
        return {
          code: 500,
          result: {
            error: "Préstamo realizado con éxito.",
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

    bookRepository.updateBook(takenBook.id, takenBook);
    const dateOfLoan = 1296000000;
    const dateNow = new Date();
    const dateLimit = new Date(dateNow.getTime() + dateOfLoan);
    const loan = new Loan({
      bookId: bookId,
      memberId: memberId,
      type: type,
      dateLimit: dateLimit,
    });

    const createdLoan = await loanRepository.createLoan(loan);

    if (!createdLoan) {
      return {
        code: 500,
        result: {
          error: "Error al crear el préstamo.",
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

  async deleteLoan(req: Request) {
    const { id } = req.params;
    const loan = await loanRepository.getLoanById(id);

    if (loan != null && loan.bookId != null) {
      const book = await bookRepository.getBookById(loan.bookId.toString());
      if (book) {
        if (loan.type == "external") {
          if (book != null && book.stockExt !== undefined) {
            book.stockExt++;
            await bookRepository.updateBook(book.id, book);
          } else {
            return {
              code: 500,
              result: {
                error: "Imposible actualizar stock externo.",
                success: false,
              },
            };
          }
        }
        if (loan.type == "internal") {
          if (book != null && book.stockInt !== undefined) {
            book.stockInt++;
            await bookRepository.updateBook(book.id, book);
          } else {
            return {
              code: 500,
              result: {
                error: "Imposible actualizar stock interno.",
                success: false,
              },
            };
          }
        }

        bookRepository.updateBook(book.id, book);
        const deletedLoan = await loanRepository.deleteLoan(id);

        if (!deletedLoan) {
          return {
            code: 500,
            result: {
              error: "Préstamo no realizado.",
              success: false,
            },
          };
        }
        return {
          code: 201,
          result: {
            result: deletedLoan,
            success: true,
          },
        };
      }
    }
    return {
      code: 500,
      result: {
        error: "Préstamo no realizado.",
        success: false,
      },
    };
  }
}
export const loanService = new LoanService();
