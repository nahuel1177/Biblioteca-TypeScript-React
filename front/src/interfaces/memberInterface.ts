export interface IMember {
  _id?: string;
  name?: string;
  lastname?: string;
  email?: string;
  dni: number;
  isSanctioned?: boolean;
  isActive?: boolean;
  sanctionDate?: Date | null;
  limitSanctionDays?: number,
}
export interface IResponse {
  result: IMember[];
  error?: string;
  success: boolean;
}

export interface ICreateMember {
  name: string;
  lastname: string;
  email: string;
  dni: number;
}
