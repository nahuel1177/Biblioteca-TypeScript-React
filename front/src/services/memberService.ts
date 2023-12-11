import { ICreateMember, IMember, IResponse} from "../interfaces/memberInterface";
import { api } from "./api";
interface IService {
  getMembers: () => Promise<IResponse>;
  getMemberByDni: (dni: number) => Promise<IResponse>;
  getMemberById: (_id: string | undefined) => Promise<IMember>;
  createMember: (newMember: ICreateMember) => Promise<IResponse>;
  updateMember: (_id: string | undefined, member: IMember) => Promise<IResponse>;
  sanctionMember: (member: IMember) => Promise<IResponse>;
  deleteMember: (_id: string) => Promise<IResponse>;
}

export const memberService: IService = {
  getMembers: () => api.get("/members"),
  getMemberByDni: (dni: number) => api.get(`/members/dni/${dni}`),
  getMemberById: (_id: string | undefined) => api.get(`/members/${_id}`),
  createMember: (newMember: ICreateMember) => api.post('/members/', newMember),
  updateMember: (_id: string | undefined, member: IMember,) => api.put(`/members/update/${_id}`, member),
  sanctionMember: ( member: IMember) => api.put('/members/sanction/', member),
  deleteMember: (_id: string) => api.delete(`/members/${_id}`),
};