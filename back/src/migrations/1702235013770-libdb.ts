import Book from "../entities/Book";
import { Migration } from "../entities/Migration";

export async function up (): Promise<void> {

  const { Member } = await Migration.getMemberModel();
  const { User } = await Migration.getUserModel();
  const { Book } = await Migration.getBookModel();	
  

  await User.create([
    {
      name: "Jorge",
      lastname: "Perez",
      email: "jperez@com",
      username: "jperez",
      password: "$2a$12$utsFOZvj787rtB3Fav7k8OTtcTcAIgvXZXAJquGEtSijYxXV8lewe",
      role: "admin",
    },

    {
      name: "Carlos",
      lastname: "Rodriguez",
      email: "crodriguez@com",
      username: "crodriguez",
      password: "$2a$12$utsFOZvj787rtB3Fav7k8OTtcTcAIgvXZXAJquGEtSijYxXV8lewe",
      role: "employee",
    },
  ]);

  await Member.create([
    {
      name: "Alberto",
      lastname: "Dominguez",
      email: "adominguez@com",
      dni: 99423402,
    },
  ]);

  await Book.create([
    {
      title: "La vuelta al mundo en 80 dias",
      author: "Julio Verne" ,
      stockInt: 2,
      stockExt: 2,
    },
  ]);

  await Book.create([
    {
      title: "La isla del Tesoro",
      author: "Robert Louis Stevenson",
      stockInt: 1,
      stockExt: 3,
    },
  ]);
}
