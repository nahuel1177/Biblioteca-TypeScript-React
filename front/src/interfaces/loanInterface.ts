export interface ILoan {
  _id: string;
  memberId: string;
  bookId: string;
  type: string;
  createdAt: Date;
  dateLimit: Date,
  isDefeated: string;
}
export interface IResponse {
  result: ILoan[];
  error?: string;
  success: boolean;
}

export interface ICreateLoan {
  memberId: string;
  bookId: string;
  type: string;
}
