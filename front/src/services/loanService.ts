import { ICreateLoan, IResponse} from "../interfaces/loanInterface";
import { api } from "./api";
interface IService {
  getLoans: () => Promise<IResponse>;
  createLoan: (newLoan: ICreateLoan) => Promise<IResponse>;
  deleteLoan: (_id: string) => Promise<IResponse>;
}

export const loanService: IService = {
  getLoans: () => api.get("/loans"),
  createLoan: (newLoan: ICreateLoan) => api.post('/loans/', newLoan),
  deleteLoan: (_id: string) => api.delete(`/loans/${_id}`),
};