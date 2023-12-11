import User from "../entities/User";

class AuthRepository {
  async getUser(username: string) {
    return User.findOne({ username }).exec();
  }
}
export const authRepository = new AuthRepository();