import { ICreateUser, IResponse} from "../interfaces/userInterface";
import { api } from "./api";
interface IService {
  getUsers: () => Promise<IResponse>;
  createUser: (newUser: ICreateUser) => Promise<IResponse>;
  deleteUser: (_id: string) => Promise<IResponse>;
}

export const userService: IService = {
  getUsers: () => api.get("/users"),
  createUser: (newUser: ICreateUser) => api.post('/users/', newUser),
  deleteUser: (_id: string) => api.delete(`/users/${_id}`),
};