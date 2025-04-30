import { Router } from "express";
import book from "../controllers/bookController";

const router = Router();

router.get("/", book.getBooks);
router.get("/:id", book.getBookById);
router.get("/title/:title", book.getBookByTitle)
router.get("/isbn/:isbn", book.getBookByIsbn)
router.post("/", book.createBook);
router.put("/:id", book.updateBook);
router.delete("/:id", book.deleteBook);
export{router as bookRouter};