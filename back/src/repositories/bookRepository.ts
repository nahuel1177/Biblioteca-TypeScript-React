import Book from "../entities/Book";

class BookRepository {
  async getBooks() {
    return Book.find().exec();
  }

  async getBookById(id: string) {
    return Book.findById(id).exec();
  }

  async createBook(newBook: any) {
    return Book.create(newBook);
  }

  async updateBook(id: string, updatedBook: any){
    return Book.findByIdAndUpdate(id, updatedBook).exec();
  }
}

export const bookRepository = new BookRepository();