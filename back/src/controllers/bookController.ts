import { Request, Response } from "express";
import { logger } from "../logs/logs";
import { bookService } from "../services/bookService";

export const getBooks = async (_: Request, res: Response) => {
  try {
    const { code, result } = await bookService.getBooks();
    res.status(code).json(result);
  } catch (error) {
    logger.error(`book controller - getBook\n ${error}`);
    res.status(500).json({ success: false, data: "Internal Server Error" });
  }
};

const getBookById = async (req: Request, res: Response) => {
  try {
    const { code, result } = await bookService.getBookById(req);
    res.status(code).json(result);
  } catch (error) {
    logger.error(`book controller - getBookById\n ${error}`);
    res.status(500).json({ success: false, data: "Internal Server Error" });
  }
};

const createBook = async (req: Request, res: Response) => {
  try {
    const { code, result } = await bookService.createBook(req);
    res.status(code).json(result);
  } catch (error) {
    logger.error(`book controller - createBook\n ${error}`);
    res.status(500).json({ success: false, data: "Internal Server Error" });
  }
};

const deleteBook = async (req: Request, res: Response) => {
  try {
    const { code, result } = await bookService.deleteBook(req);
    res.status(code).json(result);
  } catch (error) {
    logger.error(`book controller - updateBook\n ${error}`);
    res.status(500).json({ success: false, data: "Internal Server Error" });
  }
};

const book = { getBooks, getBookById, createBook, deleteBook };
export default book;
