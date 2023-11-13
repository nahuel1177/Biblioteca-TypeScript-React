export interface IUser {
  _id?: string;
  name?: string;
  lastname?: string;
  username?: string;
  email?: string;
  status?: number;
}

export interface IResponse {
  data: {
    result: IUser[];
    error?: string;
    success: boolean;
  };
}

export interface ICreateUser {
  _id?: string;
  name?: string;
  lastname?: string;
  username?: string;
  email?: string;
  status?: number;
}