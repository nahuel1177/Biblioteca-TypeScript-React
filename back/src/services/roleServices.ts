import { Request } from "express";
import { roleRepository } from "../repositories/roleRepository";
class RoleService {
  async getRoles() {
    const roles = await roleRepository.getRoles();

    if (!roles.length) {
      console.log("ENTRO AL IF");
      return {
        code: 500,
        result: {
          result: [],
          error: "User not founded.",
          success: false,
        },
      };
    }
    return {
      code: 200,
      result: {
        result: roles,
        success: true,
      },
    };
  }

async getRoleById(req: Request) {
    const { id } = req.params;

    const role = await roleRepository.getRoleById(id);
    if (!role) {
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
        result: role,
        success: true,
      },
    };
  }
}
export const roleService = new RoleService();
