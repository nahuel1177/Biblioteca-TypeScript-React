import { Request } from "express";
import bcrypt from "bcrypt";
import { userRepository } from "../repositories/userRepository";
import User from "../entities/User";

class UserService {
  async getUsers() {
    const users = await userRepository.getUsers({ isActive: true });

    if (!users.length) {
      return {
        code: 200,
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
        result: users,
        success: true,
      },
    };
  }

  async getUserById(req: Request) {
    const { id } = req.params;

    const user = await userRepository.getUserById(id);
    if (!user) {
      return {
        code: 404,
        result: {
          error: "No se encontró usuario",
          success: false,
        },
      };
    }
    return {
      code: 200,
      result: {
        result: user,
        success: true,
      },
    };
  }

  async getUserByUsername(req: Request) {
    const { username } = req.params;
    const user = await userRepository.getUserByUsername(username);
    if (!user) {
      return {
        code: 404,
        result: {
          error: "No se encontró usuario",
          success: false,
        },
      };
    }
    return {
      code: 200,
      result: {
        result: user,
        success: true,
      },
    };
  }

  async getUserByMail(req: Request) {
    const { email } = req.params;
    const user = await userRepository.getUserByMail(email);
    if (!user) {
      return {
        code: 404,
        result: {
          error: "No se encontró email",
          success: false,
        },
      };
    }
    return {
      code: 200,
      result: {
        result: user,
        success: true,
      },
    };
  }

  async createUser(req: Request) {
    const { name, lastname, username, password, email, role } = req.body;
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const user = new User({
      name: name,
      lastname: lastname,
      username: username,
      password: hashedPassword,
      email: email,
      role: role,
    });
    const createdUser = await userRepository.createUser(user);
    if (!createdUser) {
      return {
        code: 500,
        result: {
          error: "No se pudo crear el usuario",
          success: false,
        },
      };
    }
    return {
      code: 201,
      result: {
        result: createdUser,
        success: true,
      },
    };
  }

  async deleteUser(req: Request) {
    const { id } = req.params;
    const deletedUser = await userRepository.deleteUser(id);
    if (!deletedUser) {
      return {
        code: 200,
        result: {
          error: "No se pudo eliminar el usuario",
          success: false,
        },
      };
    }
    return {
      code: 200,
      result: {
        result: deletedUser,
        success: true,
      },
    };
  }

  async updateUser(req: Request) {
    const { name, lastname, username, password, email, role } = req.body;
    const { id } = req.params;
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const user = new User({
      name: name,
      lastname: lastname,
      username: username,
      password: hashedPassword,
      email: email,
      role: role,
    });
    const updatedUser = await userRepository.updateUser(id, user);
    if (!updatedUser) {
      return {
        code: 200,
        result: {
          error: "El usuario no pudo ser actualizado",
          success: false,
        },
      };
    }
    return {
      code: 200,
      result: {
        result: updatedUser,
        success: true,
      },
    };
  }
}
export const userService = new UserService();
