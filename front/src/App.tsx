import { Routes, Route, BrowserRouter } from "react-router-dom";
import { LayoutModule } from "./modules/Layout";
import { User } from "./modules/User";
import { Book } from "./modules/Book";
import { Member } from "./modules/Member";
import { Loan } from "./modules/Loan";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import "./App.css";
import { CreateUserPage } from "./modules/User/CreateUserPage";
//import { Home } from "./modules/Home";


function App() {
  const darkTheme = createTheme({
    palette: {
      mode: "dark",
    },
  });
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <BrowserRouter>
        <LayoutModule />
        <Routes>
          {/* <Route path="/" element={<Home />} /> */}
          <Route path="usuarios" element={<User />} />
          <Route path="crear-usuario" element={<CreateUserPage />}/>
          <Route path="libros" element={<Book />} />
          <Route path="socios" element={<Member/>} />
          <Route path="prestamos" element={<Loan />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}
export default App;
