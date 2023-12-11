import { ICreateUser, IResponse, IUser} from "../interfaces/userInterface";
import { api } from "./api";
interface IService {
  getUsers: () => Promise<IResponse>;
  getUserById: (_id: string | undefined) => Promise<IResponse>;
  getUserByUsername: (username: string | undefined) => Promise<IResponse>;
  createUser: (newUser: ICreateUser) => Promise<IResponse>;
  updateUser: (_id: string | undefined, user: IUser) => Promise<IResponse>;
  deleteUser: (_id: string) => Promise<IResponse>;
}

export const userService: IService = {
  getUsers: () => api.get("/users"),
  getUserById: (_id: string | undefined) => api.get(`/users/${_id}`),
  getUserByUsername: (username: string | undefined) => api.get(`/users/username/${username}`),
  createUser: (newUser: ICreateUser) => api.post('/users/', newUser),
  updateUser: (_id: string | undefined, user: IUser) => api.put(`/users/${_id}`, user),
  deleteUser: (_id: string) => api.delete(`/users/${_id}`),
};