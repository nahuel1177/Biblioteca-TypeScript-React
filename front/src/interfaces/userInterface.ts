export interface IUser {
  _id: string;
  name: string;
  lastname: string;
  username: string;
  password?: string;
  email: string;
  role?: string;
}
export interface IResponse {
  result: IUser[];
  error?: string;
  success: boolean;
}
export interface ICreateUser {
  name: string;
  lastname: string;
  username: string;
  password: string;
  email: string;
  role: string;
}