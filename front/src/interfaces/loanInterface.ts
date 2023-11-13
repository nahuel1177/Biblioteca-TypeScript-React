export interface ILoan {
    member: string,
    book: string,
    createdAt: Date,
  }
  
  export interface IResponse {
    data: {
      result: ILoan[];
      error?: string;
      success: boolean;
    };
  }
  
  export interface ICreateLoan {
    member: string;
    book: string;
    createdAt: Date,
  }