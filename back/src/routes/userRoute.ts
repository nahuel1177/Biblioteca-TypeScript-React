import { Router } from "express";
import user from "../controllers/userController";

const router = Router();

router.get("/users", user.getUsers);
router.get("/users/:id", user.getUserById);
router.get("/users/username/:username", user.getUserByUsername)
router.post("/users/", user.createUser);
router.put("/users/:id", user.updateUser);
router.delete("/users/:id", user.deleteUser);
export{router as userRouter};