import { Routes, Route, BrowserRouter, Navigate } from "react-router-dom";
//import { LayoutModule } from "./modules/Layout";
import "./App.css";
import { useEffect, useState } from "react";
import { Login } from "./modules/Login";
import { CreateUserModule, UserModule } from "./modules/User/index";
import { MemberModule, CreateMemberModule } from "./modules/Member/index";
import { BookModule, CreateBookModule } from "./modules/Book/index";
import { LoanModule, CreateLoanModule } from "./modules/Loan/index";
import { localStorage } from "./services/localStorage";
import { LayoutModule } from "./modules/Layout";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "./context/ThemeContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { User } from "./components/User";
import { NotFound } from './components/NotFound';
import { Error500 } from './components/Error500';

//import { userService } from "./services/userService"
function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<{ username: string; type: string }>({
    username: "",
    type: "",
  });

  useEffect(() => {
    const storedLoginStatus = localStorage.getLoggedIn();
    const data = localStorage.get();
    console.log("UseEffect Data: ", data);
    console.log("UseEffect storeLogin: ", storedLoginStatus);

    if (storedLoginStatus && data) {
      console.log("UseEffect IsLoggedIn antes: ", isLoggedIn);
      setIsLoggedIn(true);
      console.log("UseEffect IsLoggedIn despues: ", isLoggedIn);
      setUser(data.user || { username: "", type: "" });
    }
  }, []);

  const handleLogin = async (
    loggedIn: boolean,
    user: { username: string; type: string } | undefined
  ) => {
    setIsLoggedIn(loggedIn);
    localStorage.setLoggedIn(loggedIn.toString());
    console.log(
      "handleLogin LocalStorage.gettLoggedIn(): ",
      localStorage.getLoggedIn()
    );
    if (user) {
      setUser(user);
    }
  };
  console.log("Tipo de Usuario: ", user?.type);
  return (
    <ThemeProvider>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              isLoggedIn ? (
                <LayoutModule roleType={user.type} />
              ) : (
                <Navigate to="/login" replace={true} />
              )
            }
          />
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          {isLoggedIn && (
            <>
              {user?.type === "admin" && (
                <>
                  <Route
                    path="/usuarios"
                    element={<UserModule roleType={user?.type} />}
                  />
                  <Route
                    path="/crear-usuario"
                    element={<CreateUserModule roleType={user?.type} />}
                  />
                  <Route
                    path="/socios"
                    element={<MemberModule roleType={user?.type} />}
                  />
                  <Route
                    path="/crear-miembro"
                    element={<CreateMemberModule roleType={user?.type} />}
                  />
                  <Route
                    path="/libros"
                    element={<BookModule roleType={user?.type} />}
                  />
                  <Route
                    path="/crear-libro"
                    element={<CreateBookModule roleType={user?.type} />}
                  />
                  <Route
                    path="/prestamos"
                    element={<LoanModule roleType={user?.type} />}
                  />
                  <Route
                    path="/crear-prestamo"
                    element={<CreateLoanModule roleType={user?.type} />}
                  />
                </>
              )}
              {user?.type === "employee" && (
                <>
                  <Route
                    path="/libros"
                    element={<BookModule roleType={user?.type} />}
                  />
                  <Route
                    path="/crear-libro"
                    element={<CreateBookModule roleType={user?.type} />}
                  />
                  <Route
                    path="/socios"
                    element={<MemberModule roleType={user?.type} />}
                  />
                  <Route
                    path="/crear-miembro"
                    element={<CreateMemberModule roleType={user?.type} />}
                  />
                  <Route
                    path="/prestamos"
                    element={<LoanModule roleType={user?.type} />}
                  />
                  <Route
                    path="/crear-prestamo"
                    element={<CreateLoanModule roleType={user?.type} />}
                  />
                  <Route
                    path="/usuarios"
                    element={
                      <ProtectedRoute
                        roleType={user.type}
                        allowedRoles={["admin"]}
                      >
                        <User />
                      </ProtectedRoute>
                    }
                  />
                </>
              )}
            </>
          )}
          {/* Add Error500 route */}
          <Route path="/error-500" element={<Error500 />} />
          
          {/* This should remain the last route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}
export default App;
