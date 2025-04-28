export interface IBook {
  _id: string;
  title: string;
  author: string;
  isbn: number;
  stockInt: number;
  stockExt: number;
}
export interface IResponse {
  result: IBook[];
  error?: string;
  success: boolean;
}

export interface ICreateBook {
  title: string;
  author: string;
  isbn: number;
  stockInt: number;
  stockExt: number;
}
