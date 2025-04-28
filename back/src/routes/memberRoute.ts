import { Router } from "express";
import member from "../controllers/memberController";

const router = Router();

router.get("/members", member.getMembers);
router.get("/members/:id", member.getMemberById);
router.get("/members/dni/:dni", member.getMemberByDni);
router.get("/members/email/:email", member.getMemberByMail);
router.post("/members", member.createMember);
router.put("/members/sanction", member.sanctionMember);
router.put("/members/update/:id", member.updateMember);
router.delete("/members/:id", member.deleteMember);

export{router as memberRouter};