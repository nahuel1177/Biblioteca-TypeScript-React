import { Router } from "express";
import role from "../controllers/roleController";

const router = Router();

router.get("/roles/:id", role.getRoleById);
router.get("/roles", role.getRoles);
router.post("/roles", role.createRole);
export{router as roleRouter};