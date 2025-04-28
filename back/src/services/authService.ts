import { Request } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { authRepository } from "../repositories/authRepository";

class AuthService {
  async login(req: Request) {
    const { username, password } = req.body;
    const user = await authRepository.getUser(username);
  
    if (!user || !(await bcrypt.compare(password, user.password!))) {
      return {
        statusCode: 401,
        data: {
          error: "El usuario o contraseña son incorrectos.",
          success: false,
        },
      };
    }
    return {
      statusCode: 200,
      data: {
        user: { _id: user._id, username: user.username, name: user.name, lastname: user.lastname, role: user.role, email: user.email},
        token: jwt.sign({ username: user.username, role: user.role }, "SECRET_KEY"),
        success: true,
      },
    };
  }
}
export const authService = new AuthService();