import express from "express";
import auth from "../controllers/authController";

const router = express.Router();

router.post("/auth/login", auth.login);
export {router as authRouter}