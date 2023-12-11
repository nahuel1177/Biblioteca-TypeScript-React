import Member from "../entities/Member";

class MemberRepository {
  async getMembers(criteriaOptions?: any) {
    return Member.find({ ...criteriaOptions }).exec();
  }

  async getMemberById(id: string) {
    return Member.findById(id).exec();
  }

  async getMemberByDni(dni: number){
    return Member.findOne({dni}).exec();
  }

  async createMember(newMember: any) {
    return Member.create(newMember);
  }

  async updateMember(id: string, member: any) {
    return Member.findByIdAndUpdate(id, {
      name: member.name,
      lastname: member.lastname,
      email: member.email,
    }).exec();
  }

  async deleteMember(id: string) {
    return Member.findByIdAndUpdate(id, { isActive: false }).exec();
  }

  async sanctionMember(id: string, state: boolean, sanctionDate: Date | undefined) {
    return Member.findByIdAndUpdate(id, { isSanctioned: state , sanctionDate: sanctionDate}).exec();
  }
}
export const memberRepository = new MemberRepository();
