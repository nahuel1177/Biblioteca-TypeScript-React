import User from "../entities/User";

class UserRepository {
  async getUsers(criteriaOptions?: any) {
    return User.find({ ...criteriaOptions }).exec();
  }

  async getUserById(id: string) {
    return User.findById(id).exec();
  }

  async getUserByUsername(username: string){
    return User.findOne({username}).exec();
  }

  async createUser(newUser: any) {
    return User.create(newUser);
  }

  async updateUser(id: string, user: any) {
    return User.findByIdAndUpdate(id, {
      name: user.name,
      lastname: user.lastname,
      password: user.password,
      email: user.email,
      role: user.role,
    }).exec();
  }

  async deleteUser(id: string) {
    return User.findByIdAndUpdate(id, { isActive: false }).exec();
  }
}

export const userRepository = new UserRepository();
