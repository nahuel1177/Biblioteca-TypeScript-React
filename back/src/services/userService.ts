import { Request } from "express";
import bcrypt from "bcrypt";
import { userRepository } from "../repositories/userRepository";
import { roleRepository } from "../repositories/roleRepository";
import User from "../entities/User";

class UserService {
  async getUsers() {
    const users = await userRepository.getUsers({isActive:true});

    if (!users.length) {
        console.log("ENTRO AL IF")
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
              error: "Update",
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
    const { name, lastname, username, password, email, roleType } = req.body;
      console.log("Entro a createUSer: ", roleType)
      
      const role = await roleRepository.getRoleByType(roleType);
      console.log("despues de await CreateUser")
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      if (!role) {
        console.log("Entro al IF del createUser")
        return {
            code: 200,
            result: {
              error: "Users was not created",
              success: false,
            },
          };
      }
      console.log("Hash", hashedPassword)
  
      const user = new User({
        name: name,
        lastname: lastname,
        username: username,
        password: hashedPassword,
        email: email,
        role: role._id,
      });
    
      console.log("Creado", user)
      const createdUser = await userRepository.createUser(user);
    if (!createdUser) {
        return {
            code: 500,
            result: {
              error: "Users was not created",
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
    const updatedUser = await userRepository.deleteUser(id);
    if (!updatedUser) {
        return {
            code: 200,
            result: {
              error: "Users was not updated",
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