import { Request } from "express";
import Member from "../entities/Member";
import { memberRepository } from "../repositories/memberRepository";

class MemberService {
  async getMembers() {
    const members = await memberRepository.getMembers({isActive:true});

    if (!members.length) {
      return {
        code: 500,
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

  async getMemberByDni(req: Request) {
    const { dni } = req.params;
    const member = await memberRepository.getMemberByDni(parseInt(dni));
    if (!member) {
      return {
        code: 404,
        result: {
          error: "No se encontro socio",
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

  async getMemberByMail(req: Request) {
    const { email } = req.params;
    const member = await memberRepository.getMemberByMail((email));
    if (!member) {
      return {
        code: 404,
        result: {
          error: "No se encontro socio",
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
    const { name, lastname, email, dni } = req.body;
  
      const member = new Member({
        name: name,
        lastname: lastname,
        email: email,
        dni: parseInt(dni),
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

  async deleteMember(req: Request) {
    const { id } = req.params;
    const updatedMember = await memberRepository.deleteMember(id);
    if (!updatedMember) {
        return {
            code: 200,
            result: {
              error: "Member was not updated",
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

  async updateMember(req: Request) {
    const { name, lastname, email } = req.body;
    const { id } = req.params;
    const member = new Member({
      name: name,
      lastname: lastname,
      email: email,
    });
    const updatedMember = await memberRepository.updateMember(id, member);
    if (!updatedMember) {
      return {
        code: 500,
        result: {
          error: "Member was not updated",
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

  async sanctionMember(req: Request) {
    const { _id, isSanctioned, sanctionDate } = req.body;
    console.log("Estado: ", _id , isSanctioned);
    const sanctionMember = await memberRepository.sanctionMember(_id, isSanctioned, sanctionDate);
    if (!sanctionMember) {
        return {
            code: 200,
            result: {
              error: "Member was not updated",
              success: false,
            },
          };
    }
    return {
        code: 200,
        result: {
          result: sanctionMember,
          success: true,
        },
      };
  }
}
export const memberService = new MemberService();