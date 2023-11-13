import User from "../entities/User";

class UserRepository {
  async getUsers() {
    return User.find().exec();
  }

  async getUserById(id: string) {
    return User.findById(id).exec();
  }

  async createUser(newUser: any) {
    return User.create(newUser);
  }

  async updateUser(id: string, updatedUser: any){
    return User.findByIdAndUpdate(id, updatedUser).exec();
  }
}

export const userRepository = new UserRepository();
