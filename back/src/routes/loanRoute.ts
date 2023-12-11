import { Router } from "express";
import loan from "../controllers/loanController";

const router = Router();

router.get("/loans", loan.getLoans);
router.get("/allLoans", loan.getAllLoans);
router.get("/loans/:id", loan.getLoanById);
router.post("/loans", loan.createLoan);
router.delete("/loans/:id", loan.deleteLoan);
export{router as loanRouter};