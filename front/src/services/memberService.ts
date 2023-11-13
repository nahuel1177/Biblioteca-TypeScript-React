import { ICreateMember, IResponse} from "../interfaces/memberInterface";
import { api } from "./api";
interface IService {
  getMembers: () => Promise<IResponse>;
  createMember: (newMember: ICreateMember) => Promise<IResponse>;
  deleteMember: (_id: string) => Promise<IResponse>;
}

export const memberService: IService = {
  getMembers: () => api.get("/members"),
  createMember: (newMember: ICreateMember) => api.post('/members/', newMember),
  deleteMember: (_id: string) => api.delete(`/members/${_id}`),
};