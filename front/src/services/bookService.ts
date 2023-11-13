import { ICreateBook, IResponse} from "../interfaces/bookInterface";
import { api } from "./api";
interface IService {
  getBooks: () => Promise<IResponse>;
  createBook: (newBook: ICreateBook) => Promise<IResponse>;
  deleteBook: (_id: string) => Promise<IResponse>;
}

export const bookService: IService = {
  getBooks: () => api.get("/books"),
  createBook: (newBook: ICreateBook) => api.post('/books/', newBook),
  deleteBook: (_id: string) => api.delete(`/books/${_id}`),
};