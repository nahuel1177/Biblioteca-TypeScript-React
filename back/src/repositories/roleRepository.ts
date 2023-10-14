import Role from "../entities/Role";

class RoleRepository {
  async getRoles() {
    return Role.find().exec();
  }

  async getRoleById(id: string) {
    return Role.findById(id).exec();
  }

  async createRole(newRole: any) {
    return Role.create(newRole);
  }
}

export const roleRepository = new RoleRepository();