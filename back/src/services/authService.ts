import { Request } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { authRepository } from "../repositories/authRepository";
//import User from "../entities/User";

class AuthService {
  async login(req: Request) {
    const { username, password } = req.body;
    const user = await authRepository.getUser(username);
    console.log("Entro a authService", user?.role)
    if (!user || !(await bcrypt.compare(password, user.password!))) {
      return {
        statusCode: 401,
        data: {
          error: "Usuario y/o contraseña inválidas",
          success: false,
        },
      };
    }
    return {
      statusCode: 200,
      data: {
        user: { username: user.username, type: user.role },
        token: jwt.sign({ username: user.username, type: user.role }, "SECRET_KEY"),
        success: true,
      },
    };
  }
}
export const authService = new AuthService();