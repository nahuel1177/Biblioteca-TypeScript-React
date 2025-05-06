import { Migration } from "../entities/Migration";

export async function up (): Promise<void> {

  const { Member } = await Migration.getMemberModel();
  const { User } = await Migration.getUserModel();
  const { Book } = await Migration.getBookModel();	
  

  await User.create([
    {
      name: "Jorge",
      lastname: "Perez",
      email: "jperez@gmail.com",
      username: "jperez",
      password: "$2a$10$SliJr1a1mXugx7RXvlpFjudYPCSx/F/6SegdMHedKZmwV7WtfP6/m",
      role: "admin",
    },

    {
      name: "Carlos",
      lastname: "Gentili",
      email: "cgentili@gmail.com",
      username: "cgentili",
      password: "$2a$10$SliJr1a1mXugx7RXvlpFjudYPCSx/F/6SegdMHedKZmwV7WtfP6/m",
      role: "employee",
    },
  ]);

  await Member.create([
    {
      name: "Alberto",
      lastname: "Dominguez",
      email: "adominguez@yahoo.com",
      dni: 30341177,
    },
  ]);

  await Book.create([
    {
      title: "La vuelta al mundo en 80 días",
      author: "Julio Verne" ,
      isbn: 9789878933849,
      loanable: true,
      stockInt: 2,
      stockExt: 2,
    },
  ]);

  await Book.create([
    {
      title: "La isla del Tesoro",
      author: "Robert Louis Stevenson",
      isbn: 9789500746830,
      loanable: false,
      stockInt: 3,
      stockExt: 0,
    },
  ]);
}
