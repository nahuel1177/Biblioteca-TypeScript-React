import Book from "../entities/Book";

class BookRepository {
  async getBooks(criteriaOptions?:any) {
    return Book.find({...criteriaOptions}).exec();
  }

  async getBookById(id: string) {
    return Book.findById(id).exec();
  }

  async createBook(newBook: any) {
    return Book.create(newBook);
  }

  async deleteBook(id: string){
    return Book.findByIdAndUpdate(id,  {isActive: false}).exec();
  }
}

export const bookRepository = new BookRepository();