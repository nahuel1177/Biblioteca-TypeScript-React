import { Router } from "express";
import book from "../controllers/bookController";

const router = Router();

router.get("/books/:id", book.getBookById);
router.get("/books", book.getBooks);
router.post("/books", book.createBook);
router.delete("/books/:id", book.deleteBook);
export{router as bookRouter};