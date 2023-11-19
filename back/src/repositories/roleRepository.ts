import Role from "../entities/Role";
class RoleRepository {
  async getRoles() {
    return Role.find().exec();
  }

  async getRoleById(id: string) {
    return Role.findById(id).exec();
  }

  async getRoleByType(type: string) {
    const roles = await this.getRoles();
    const rolesFiltered = roles.filter(role => (role.type == type));
    return rolesFiltered[0]._id;
  }

  async createRole(newRole: any) {
    return Role.create(newRole);
  }
}

export const roleRepository = new RoleRepository();
