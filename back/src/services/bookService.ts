import { Request } from "express";
import { bookRepository } from "../repositories/bookRepository";
import Book from "../entities/Book";

class BookService {
  async getBooks() {
    const books = await bookRepository.getBooks({isActive:true});

    if (!books) {
      console.log("ENTRO AL IF");
      return {
        code: 500,
        result: {
          result: [],
          error: "No hay libros para mostrar.",
          success: false,
        },
      };
    }
    return {
      code: 200,
      result: {
        result: books,
        success: true,
      },
    };
  }

  async getBookById(req: Request) {
    const { id } = req.params;

    const book = await bookRepository.getBookById(id);
    if (!book) {
      return {
        code: 404,
        result: {
          error: "Libro no encontrado.",
          success: false,
        },
      };
    }
    return {
      code: 200,
      result: {
        result: book,
        success: true,
      },
    };
  }

  async getBookByIsbn(req: Request) {
    const { isbn } = req.params;

    const book = await bookRepository.getBookByIsbn(parseInt(isbn));
    if (!book) {
      return {
        code: 404,
        result: {
          error: "Libro no encontrado.",
          success: false,
        },
      };
    }
    return {
      code: 200,
      result: {
        result: book,
        success: true,
      },
    };
  }

  async getBookByTitle(req: Request) {
    const { title } = req.params;
    const book = await bookRepository.getBookByTitle(title);
    if (!book) {
      return {
        code: 404,
        result: {
          error: "No se encontro Libro",
          success: false,
        },
      };
    }
    return {
      code: 200,
      result: {
        result: book,
        success: true,
      },
    };
  }

  async createBook(req: Request) {
    const { title, author, isbn, loanable, stockInt, stockExt } = req.body;

    const book = new Book({
      title: title,
      author: author,
      isbn: isbn,
      loanable: loanable,
      stockInt: stockInt,
      stockExt: stockExt,
    });

    console.log("Creado", book);
    const createdBook = await bookRepository.createBook(book);
    if (!createdBook) {
      return {
        code: 500,
        result: {
          error: "No se pudo dar de alta el libro.",
          success: false,
        },
      };
    }
    return {
      code: 201,
      result: {
        result: createdBook,
        success: true,
      },
    };
  }

  async deleteBook(req: Request) {
    const { id } = req.params;
    const updatedBook = await bookRepository.deleteBook(id);
    if (!updatedBook) {
        return {
            code: 500,
            result: {
              error: "El libro no pudo ser eliminado.",
              success: false,
            },
          };
    }
    return {
        code: 200,
        result: {
          result: updatedBook,
          success: true,
        },
      };
  }

  async updateBook(req: Request) {
    const { title, author, loanable, stockInt, stockExt } = req.body;
    const { id } = req.params;
    const book = new Book({
      title: title,
      author: author,
      loanable: loanable,
      stockInt: stockInt,
      stockExt: stockExt,
    });
    console.log("Actualizado", book);
    const updatedBook = await bookRepository.updateBook(id, book);
    if (!updatedBook) {
      return {
        code: 500,
        result: {
          error: "El libro no pudo ser actualizado",
          success: false,
        },
      };
    }
    return {
      code: 200,
      result: {
        result: updatedBook,
        success: true,
      },
    };
  }
}
export const bookService = new BookService();
