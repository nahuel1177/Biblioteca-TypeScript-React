import { IBook, ICreateBook, IResponse } from "../interfaces/bookInterface";
import { api } from "./api";
interface IService {
  getBooks: () => Promise<IResponse>;
  getBookByTitle: (title: string) => Promise<IResponse>;
  getBookByIsbn: (isbn: number) => Promise<IResponse>;
  createBook: (newBook: ICreateBook) => Promise<IResponse>;
  updateBook: (_id: string | undefined, book: IBook) => Promise<IResponse>;
  deleteBook: (_id: string) => Promise<IResponse>;
}

export const bookService: IService = {
  getBooks: () => api.get("/books"),
  getBookByTitle: (title: string) => api.get(`/books/title/${title}`),
  getBookByIsbn: (isbn: number) => api.get(`/books/isbn/${isbn}`),
  createBook: (newBook: ICreateBook) => api.post('/books/', newBook),
  updateBook: (_id: string | undefined, book: IBook) => api.put(`/books/${_id}`, book),
  deleteBook: (_id: string) => api.delete(`/books/${_id}`),
};