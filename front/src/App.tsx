import { Routes, Route, BrowserRouter, Navigate } from "react-router-dom";
//import { LayoutModule } from "./modules/Layout";
import "./App.css";
import { useEffect, useState } from "react";
import { Login } from "./modules/Login";
import { MemberModule } from "./modules/Member/index";
import { LoanModule } from "./modules/Loan/index";
import { localStorage } from "./services/localStorage";
import { LayoutModule } from "./modules/Layout";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "./context/ThemeContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { User } from "./components/User";
import { NotFound } from './components/Errors/NotFound';
import { Error500 } from './components/Errors/Error500';
import { UserModule } from "./modules/User";
import { BookModule } from "./modules/Book";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<{ username: string; role: string }>({
    username: "",
    role: "",
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
      
      const userData = typeof data === 'string' ? JSON.parse(data) : data;
      const userRole = userData.user?.role || "";
      const username = userData.user?.username || "";
      
      console.log("User role from localStorage:", userRole);
      
      setUser({ 
        username: username, 
        role: userRole
      });
    }
  }, []);

  const handleLogin = async (
    loggedIn: boolean,
    user: { username: string; role: string } | undefined
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
  console.log("Tipo de Usuario: ", user?.role);
  return (
    <ThemeProvider>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              isLoggedIn ? (
                <LayoutModule roleType={user.role} />
              ) : (
                <Navigate to="/login" replace={true} />
              )
            }
          />
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          {isLoggedIn && (
            <>
              {user?.role === "admin" && (
                <>
                  <Route
                    path="/usuarios"
                    element={<UserModule roleType={user?.role} />}
                  />
                </>
              )}
              {user?.role === "employee" && (
                <>
                  <Route
                    path="/libros"
                    element={<BookModule roleType={user?.role} />}
                  />
                  <Route
                    path="/socios"
                    element={<MemberModule roleType={user?.role} />}
                  />
                  <Route
                    path="/prestamos"
                    element={<LoanModule roleType={user?.role} />}
                  />
                  <Route
                    path="/usuarios"
                    element={
                      <ProtectedRoute
                        roleType={user.role}
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
          <Route path="/error-500" element={<Error500 />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}
export default App;
