import { ICreateLoan, IResponse} from "../interfaces/loanInterface";
import { api } from "./api";
interface IService {
  getLoans: () => Promise<IResponse>;
  getAllLoans: () => Promise<IResponse>;
  createLoan: (newLoan: ICreateLoan) => Promise<IResponse>;
  deleteLoan: (_id: string) => Promise<IResponse>;
}

export const loanService: IService = {
  getLoans: () => api.get('/loans/'),
  getAllLoans: () => api.get('/allLoans'),
  createLoan: (newLoan: ICreateLoan) => api.post('/loans/', newLoan),
  deleteLoan: (_id: string) => api.delete(`/loans/${_id}`),
};