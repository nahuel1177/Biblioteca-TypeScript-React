import User from "../entities/User";

class UserRepository {
  async getUsers(criteriaOptions?:any) {
    return User.find({...criteriaOptions}).exec();
  }

  async getUserById(id: string) {
    return User.findById(id).exec();
  }

  async createUser(newUser: any) {
    return User.create(newUser);
  }

  async deleteUser(id: string){
    return User.findByIdAndUpdate(id, {isActive: false}).exec();
  }
}

export const userRepository = new UserRepository();
