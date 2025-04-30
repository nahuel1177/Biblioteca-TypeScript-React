import { Router } from "express";
import member from "../controllers/memberController";

const router = Router();

router.get("/", member.getMembers);
router.get("/:id", member.getMemberById);
router.get("/dni/:dni", member.getMemberByDni);
router.get("/email/:email", member.getMemberByMail);
router.post("/", member.createMember);
router.put("/sanction", member.sanctionMember);
router.put("/update/:id", member.updateMember);
router.delete("/:id", member.deleteMember);

export{router as memberRouter};