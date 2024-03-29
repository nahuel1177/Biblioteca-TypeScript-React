//import { consoleTestResultHandler } from "tslint/lib/test";
import Loan from "../entities/Loan";

class LoanRepository {
  async getLoans(criteriaOptions?: any) {
    return Loan.find({ ...criteriaOptions }).exec();
  }

  async getLoanById(id: string) {
    return Loan.findById(id).exec();
  }

  async createLoan(newLoan: any) {
    return Loan.create(newLoan);
  }

  async deleteLoan(id: string){
    return Loan.findByIdAndUpdate(id, { isActive: false }).exec();
  }
}

export const loanRepository = new LoanRepository();