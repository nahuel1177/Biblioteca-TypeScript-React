import User from "../entities/User";

class UserRepository {
  async getUsers(criteriaOptions?: any) {
    return User.find({ ...criteriaOptions }).exec();
  }

  async getUserById(id: string) {
    return User.findById(id).exec();
  }

  async createUser(newUser: any) {
    return User.create(newUser);
  }

  async updateUser(id: string, user: any) {
    return User.findByIdAndUpdate(id, {
      name: user.name,
      lastaname: user.lastname,
      password: user.password,
      email: user.email,
    }).exec();
  }

  async deleteUser(id: string) {
    return User.findByIdAndUpdate(id, { isActive: false }).exec();
  }
}

export const userRepository = new UserRepository();
