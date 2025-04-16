export interface IUser {
  _id: string;
  name?: string;
  lastname?: string;
  username?: string;
  password?: string;
  email?: string;
  role?: string;
}
export interface IResponse {
    result: IUser[];
    error?: string;
    success: boolean;
}
export interface IResponseLogin {
  user?: {
    username: string;
    type: string;
    name: string;
    lastname: string;
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