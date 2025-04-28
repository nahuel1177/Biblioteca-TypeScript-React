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