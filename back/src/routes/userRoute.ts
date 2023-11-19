import { Router } from "express";
import user from "../controllers/userController";

const router = Router();

router.get("/users/:id", user.getUserById);
router.get("/users", user.getUsers);
router.post("/users/", user.createUser);
router.delete("/users/:id", user.deleteUser);
export{router as userRouter};