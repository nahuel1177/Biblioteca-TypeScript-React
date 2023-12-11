import { ICreateRole, IResponse, IRole } from "../interfaces/rolInterface";
import { api } from "./api";
interface IService {
  getRoles: () => Promise<IResponse>;
  getRoleById: (_id: string | undefined) => Promise<IRole>
  createRole: (newLoan: ICreateRole) => Promise<IResponse>;
  deleteRole: (_id: string) => Promise<IResponse>;
}

export const roleService: IService = {
  getRoles: () => api.get("/roles"),
  getRoleById: (_id: string | undefined) => api.get(`/roles/${_id}`),
  createRole: (newRole: ICreateRole) => api.post('/roles/', newRole),
  deleteRole: (_id: string) => api.delete(`/roles/${_id}`),
};