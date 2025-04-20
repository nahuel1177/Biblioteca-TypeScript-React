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
export interface IResponseLogin {
  user?: {
    _id: string;
    username: string;
    name: string;
    lastname: string;
    password?: string;
    email?: string;
    role: string;
  };
  token?: string;
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