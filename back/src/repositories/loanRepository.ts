import Loan from "../entities/Loan";

class LoanRepository {
  async getLoans() {
    return Loan.find().exec();
  }

  async getLoanById(id: string) {
    return Loan.findById(id).exec();
  }

  async createLoan(newLoan: any) {
    return Loan.create(newLoan);
  }
}

export const loanRepository = new LoanRepository();