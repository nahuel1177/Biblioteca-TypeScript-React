export interface IUser {
  _id?: string;
  name?: string;
  lastname?: string;
  username?: string;
  password?: string;
  email?: string;
  roleType?: string;
}

export interface IResponse {
  data: {
    result: IUser[];
    error?: string;
    success: boolean;
  };
}

export interface ICreateUser {
  name: string;
  lastname: string;
  username: string;
  password: string;
  email: string;
  roleType: string;
}

export interface IUpdateUser {
  _id?: string;
  name?: string;
  lastname?: string;
  username?: string;
  password?: string;
  email?: string;
}