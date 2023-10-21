import { Request, Response } from "express";
import { bookRepository } from "../repositories/bookRepository";
import { logger } from "../logs/logs"

const getBooks = async (_: Request, res: Response) => {
  try {
    const books = await bookRepository.getBooks();
    
    res.status(200).json(books);
  } catch (error) {
    logger.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getBookById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const book = await bookRepository.getBookById(id);

    if (!book) {
      res.status(404).json({ error: "book not found" });

      return;
    }

    res.status(200).json(book);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const createBook = async (req: Request, res: Response) => {
  const { title, author, stock } = req.body;

  try {
    const newBook = {
      title,
      author,
      stock
    };

    console.log("Libro creado:",newBook);
    const createdBook = await bookRepository.createBook(newBook);

    res.status(201).json(createdBook);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const book = { getBooks, getBookById, createBook };
export default book;