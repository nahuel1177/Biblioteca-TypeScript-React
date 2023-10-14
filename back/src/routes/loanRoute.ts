import { Router } from "express";
import loan from "../controllers/loanController";

const router = Router();

router.get("/loans/:id", loan.getLoanById);
router.get("/loans", loan.getLoans);
router.post("/loans", loan.createLoan);
export{router as loanRouter};