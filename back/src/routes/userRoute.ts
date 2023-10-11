import { Router } from "express";
import user from "../controllers/userController";

const router = Router();

router.get("/users/:id", user.getUserById);
router.get("/users", user.getUsers);
router.post("/users", user.createUser);
export{router as userRouter};