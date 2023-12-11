import { Router } from "express";
import book from "../controllers/bookController";

const router = Router();

router.get("/books", book.getBooks);
router.get("/books/:id", book.getBookById);
router.get("/books/title/:title", book.getBookByTitle)
router.post("/books", book.createBook);
router.put("/books/:id", book.updateBook);
router.delete("/books/:id", book.deleteBook);
export{router as bookRouter};