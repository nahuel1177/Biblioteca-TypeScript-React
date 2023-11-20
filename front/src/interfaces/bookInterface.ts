export interface IBook {
  _id?: string;
  title: string;
  author: string;
  stock: number;
}

export interface IResponse {
  data: {
    result: IBook[];
    error?: string;
    success: boolean;
  };
}

export interface ICreateBook {
  title: string;
  author: string;
  stock: number;
}
