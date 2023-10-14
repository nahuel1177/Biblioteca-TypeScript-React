import express from "express";
import { connectDB } from "./db/connection";
import cors from 'cors';
import { userRouter } from "./routes/userRoute";
import { bookRouter } from "./routes/bookRoute";
import { loanRouter } from "./routes/loanRoute";
import { memberRouter } from "./routes/memberRoute";

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api",userRouter);
app.use("/api",bookRouter);
app.use("/api",loanRouter);
app.use("/api",memberRouter);

async function start() {
  try {
    await connectDB();

    const port = process.env.PORT || 3001;

    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (error) {
    console.error("Error initializing the application:", error);

    process.exit(1); // Terminate the application on error
  }
}
start();
