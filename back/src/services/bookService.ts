import { Request } from "express";
import { bookRepository } from "../repositories/bookRepository";
import Book from "../entities/Book";

class BookService {
  async getBooks() {
    const books = await bookRepository.getBooks({isActive:true});

    if (!books.length) {
      console.log("ENTRO AL IF");
      return {
        code: 200,
        result: {
          result: [],
          error: "Book not founded.",
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
          error: "idBook not founded.",
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
    const { title, author, stock } = req.body;

    const book = new Book({
      title: title,
      author: author,
      stock: stock,
    });

    console.log("Creado", book);
    const createdBook = await bookRepository.createBook(book);
    if (!createdBook) {
      return {
        code: 200,
        result: {
          error: "Books was not created",
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
            code: 200,
            result: {
              error: "Book was not updated",
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
