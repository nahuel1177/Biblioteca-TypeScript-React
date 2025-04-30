import { Router } from "express";
import user from "../controllers/userController";

const router = Router();

router.get("/", user.getUsers);
router.get("/:id", user.getUserById);
router.get("/username/:username", user.getUserByUsername)
router.get("/email/:email", user.getUserByMail)
router.post("/", user.createUser);
router.put("/:id", user.updateUser);
router.delete("/:id", user.deleteUser);
export{router as userRouter};