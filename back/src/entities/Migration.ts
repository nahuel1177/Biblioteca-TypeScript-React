import mongoose from "mongoose";

import { MONGODB_URI } from "../common/constants";
import User from "./User";
import Book from "./Book";
import Member from "./Member";

export class Migration {
  static async getUserModel() {
    await mongoose.connect(MONGODB_URI);
    return {
      User,
    };
  }
  
  static async getMemberModel() {
    await mongoose.connect(MONGODB_URI);
    return {
      Member,
    };
  }
  
  static async getBookModel() {
    await mongoose.connect(MONGODB_URI);
    return {
      Book,
    };
  }
}