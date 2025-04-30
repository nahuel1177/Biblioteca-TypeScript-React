import { Router } from "express";
import loan from "../controllers/loanController";

const router = Router();

router.get("/", loan.getLoans);
router.get("/:id", loan.getLoanById);
router.post("/", loan.createLoan);
router.delete("/:id", loan.deleteLoan);
export{router as loanRouter};