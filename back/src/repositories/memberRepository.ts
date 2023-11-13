import Member from "../entities/Member";

class MemberRepository {
  async getMembers() {
    return Member.find().exec();
  }

  async getMemberById(id: string) {
    return Member.findById(id).exec();
  }

  async createMember(newMember: any) {
    return Member.create(newMember);
  }

  async updateMember(id: string, updatedMember: any){
    return Member.findByIdAndUpdate(id, updatedMember).exec();
  }
}

export const memberRepository = new MemberRepository();