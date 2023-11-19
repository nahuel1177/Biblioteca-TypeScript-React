import { Router } from "express";
import member from "../controllers/memberController";

const router = Router();

router.get("/members/:id", member.getMemberById);
router.get("/members", member.getMembers);
router.post("/members", member.createMember);
router.delete("/members/:id", member.deleteMember);
export{router as memberRouter};