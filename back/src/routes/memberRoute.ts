import { Router } from "express";
import member from "../controllers/memberController";

const router = Router();

router.get("/members/:id", member.getMemberById);
router.get("/member", member.getMembers);
router.post("/members", member.createMember);
export{router as memberRouter};