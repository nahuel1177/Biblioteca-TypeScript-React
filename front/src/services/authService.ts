import { IResponseLogin } from "../interfaces/userInterface";
import { api } from "./api";

interface IUser {
  username: string;
  password: string;
}

interface IService {
  login: (user: IUser) => Promise<IResponseLogin>;
}

export const authService: IService = {
  login: (user: IUser) => api.post("/auth/login", user),
};