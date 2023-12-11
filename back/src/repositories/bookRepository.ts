import Book from "../entities/Book";

class BookRepository {
  async getBooks(criteriaOptions?:any) {
    return Book.find({...criteriaOptions}).exec();
  }

  async getBookById(id: string) {
    return Book.findById(id).exec();
  }

  async getBookByTitle(title: string){
    return Book.findOne({title}).exec();
  }

  async createBook(newBook: any) {
    return Book.create(newBook);
  }

  async updateBook(id: string, book: any) {
    return Book.findByIdAndUpdate(id, {
      title: book.title,
      author: book.author,
      stockInt: book.stockInt,
      stockExt: book.stockExt,
    }).exec();
  }

  async deleteBook(id: string){
    return Book.findByIdAndUpdate(id,  {isActive: false}).exec();
  }
}

export const bookRepository = new BookRepository();