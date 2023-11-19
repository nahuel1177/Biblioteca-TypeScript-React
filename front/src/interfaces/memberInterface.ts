export interface IMember {
  _id?: string;
  name?: string;
  lastname?: string;
  email?: string;
}

export interface IResponse {
  data: {
    result: IMember[];
    error?: string;
    success: boolean;
  };
}

export interface ICreateMember {
  name: string;
  email: string;
}
