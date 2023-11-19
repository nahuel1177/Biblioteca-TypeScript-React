import Member from "../entities/Member";

class MemberRepository {
  async getMembers(criteriaOptions?:any) {
    return Member.find({...criteriaOptions}).exec();
  }

  async getMemberById(id: string) {
    return Member.findById(id).exec();
  }

  async createMember(newMember: any) {
    return Member.create(newMember);
  }

  async deleteMember(id: string){
    return Member.findByIdAndUpdate(id, {isActive: false}).exec();
  }
}

export const memberRepository = new MemberRepository();