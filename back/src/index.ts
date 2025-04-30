import express from "express";
import { connectDB } from "./db/connection";
import cors from 'cors';
import { userRouter } from "./routes/userRoute";
import { bookRouter } from "./routes/bookRoute";
import { loanRouter } from "./routes/loanRoute";
import { memberRouter } from "./routes/memberRoute";
import { authRouter } from "./routes/authRoute";
import { authentication, authorization } from "./middlewares";
import { PORT } from "./common/constants";


const app = express();

app.use(cors());
app.use(express.json());

// Ruta de autenticación (login) - sin protección
app.use("/api", authRouter);

// Crear un router para las rutas protegidas
const protectedRoutes = express.Router();

// Aplicar middlewares de autenticación y autorización a todas las rutas protegidas
protectedRoutes.use(authentication);
protectedRoutes.use(authorization(['admin', 'employee']));

// Registrar las rutas protegidas
protectedRoutes.use("/users", userRouter);
protectedRoutes.use("/books", bookRouter);
protectedRoutes.use("/loans", loanRouter);
protectedRoutes.use("/members", memberRouter);

// Montar las rutas protegidas bajo /api
app.use("/api", protectedRoutes);

async function start() {
  try {
    await connectDB();

    const port = PORT || 3000;

    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (error) {
    console.error("Error initializing the application:", error);
    process.exit(1); // Terminate the application on error
  }
}
start();
