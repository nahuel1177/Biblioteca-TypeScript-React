import { Request } from "express";
import Member from "../entities/Member";
import { memberRepository } from "../repositories/memberRepository";

class MemberService {
  async getMembers() {
    const members = await memberRepository.getMembers();

    if (!members.length) {
        console.log("ENTRO AL IF")
      return {
        code: 200,
        result: {
          result: [],  
          error: "Member not founded.",
          success: false,
        },
      };
    }
    return {
        code: 200,
        result: {
          result: members,
          success: true,
        },
      };
  }

  async getMemberById(req: Request) {
    const { id } = req.params;

    const member = await memberRepository.getMemberById(id);
    if (!member) {
        return {
            code: 404,
            result: {
              error: "Update",
              success: false,
            },
          };
    }
    return {
        code: 200,
        result: {
          result: member,
          success: true,
        },
      };
  }

  async createMember(req: Request) {
    const { name, lastname, email } = req.body;
  
      const member = new Member({
        name: name,
        lastname: lastname,
        email: email,
        status: 1,
      });
    
      console.log("Creado", member)
      const createdMember = await memberRepository.createMember(member);
    if (!createdMember) {
        return {
            code: 200,
            result: {
              error: "Members was not created",
              success: false,
            },
          };
    }
    return {
        code: 201,
        result: {
          result: createdMember,
          success: true,
        },
      };
  }

  async updateMember(req: Request) {
    const { id } = req.params;
    const { name } = req.body;
    const updatedMember = await memberRepository.updateMember(id, {
      name,
    });
    if (!updatedMember) {
        return {
            code: 200,
            result: {
              error: "Members was not updated",
              success: false,
            },
          };
    }
    return {
        code: 200,
        result: {
          result: updatedMember,
          success: true,
        },
      };
  }
}
export const memberService = new MemberService();