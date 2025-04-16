import "./index.css";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import React from "react";
import { useTheme } from "../../context/ThemeContext";
import { Sun, Moon } from "lucide-react";
import { useState, useEffect } from "react";
import ImportContactsIcon from "@mui/icons-material/ImportContacts";
import { localStorage } from "../../services/localStorage";

const pages = ["usuarios", "libros", "socios", "prestamos"];
const settings = ["Salir"];

export const LayoutModule: React.FC<{ roleType: string | undefined }> = ({
  roleType,
}) => {
  const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
  const navigate = useNavigate();
  console.log("Layout", roleType);
  const { theme, toggleTheme } = useTheme();

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleLogout = () => {
    navigate("/login");
  };

  const [name, setName] = useState<string>("");
  const [lastname, setLastname] = useState<string>("");
  const [userInitials, setUserInitials] = useState<string>("");

  useEffect(() => {
    const userData = localStorage.get();
    if (userData) {
      const parsedData = typeof userData === "string" ? JSON.parse(userData) : userData;
      const name = parsedData.user?.name || "";
      const lastname = parsedData.user?.lastname || "";
      
      // Create initials from name and lastname
      const initials = `${name.charAt(0)}${lastname.charAt(0)}`.toUpperCase();
      
      setName(name);
      setLastname(lastname)
      setUserInitials(initials);
    }
  }, []);

  return (
    <>
      <div className="background-image-layout"></div>
      <AppBar position="static">
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            <ImportContactsIcon
              sx={{ display: { xs: "none", md: "flex" }, mr: 1 }}
            />
            <Typography
              variant="h6"
              noWrap
              sx={{
                mr: 2,
                display: { xs: "none", md: "flex" },
                fontWeight: 700,
              }}
            >
              BIBLIOTECA
            </Typography>
            <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleOpenNavMenu}
                color="inherit"
              >
                <MenuIcon />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorElNav}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "left",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "left",
                }}
                open={Boolean(anchorElNav)}
                onClose={handleCloseNavMenu}
                sx={{
                  display: { xs: "block", md: "none" },
                }}
              >
                {roleType === "admin" && (
                  <div>
                    {pages.map((page) => (
                      <Button
                        key={page}
                        onClick={handleCloseNavMenu}
                        sx={{ my: 2, color: "white", display: "block" }}
                      >
                        <Link
                          style={{ textDecoration: "none", color: "white" }}
                          to={`/${page}`}
                        >
                          {page}
                        </Link>
                      </Button>
                    ))}
                  </div>
                )}
                {roleType === "employee" && (
                  <div>
                    {pages
                      .filter(
                        (page) => page !== "usuarios" && page !== "socios"
                      )
                      .map((page) => (
                        <Button
                          key={page}
                          onClick={() => {
                            handleCloseNavMenu();
                          }}
                          style={{ textDecoration: "none", color: "white" }}
                        >
                          <Link
                            style={{ textDecoration: "none", color: "white" }}
                            to={`/${page}`}
                          >
                            {page}
                          </Link>
                        </Button>
                      ))}
                  </div>
                )}
              </Menu>
            </Box>
            <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
              {roleType === "admin" && (
                <>
                  {pages.map((page) => (
                    <Button
                      key={page}
                      onClick={handleCloseNavMenu}
                      sx={{ my: 2, color: "black", display: "block" }}
                    >
                      <Link
                        style={{ textDecoration: "none", color: "white" }}
                        to={`/${page}`}
                      >
                        {page}
                      </Link>
                    </Button>
                  ))}
                </>
              )}
              {roleType === "employee" && (
                <>
                  {pages
                    .filter((page) => page !== "usuarios")
                    .map((page) => (
                      <Button
                        key={page}
                        onClick={handleCloseNavMenu}
                        sx={{ my: 2, color: "white", display: "block" }}
                      >
                        <Link
                          style={{ textDecoration: "none", color: "white" }}
                          to={`/${page}`}
                        >
                          {page}
                        </Link>
                      </Button>
                    ))}
                </>
              )}
            </Box>
            <Box
              sx={{
                flexGrow: 0,
                display: "flex",
                alignItems: "center",
                gap: 2,
                ml: "auto",
              }}
            >
              <IconButton onClick={toggleTheme} color="inherit" size="small">
                {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
              </IconButton>
              <Typography
                variant="subtitle1"
                sx={{
                  display: { xs: "none", md: "flex" },
                  alignItems: "center",
                  gap: 1,
                }}
              >
                {name} {lastname}
              </Typography>

              <Tooltip title="Cerrar Sesion">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <Avatar sx={{ bgcolor: 'primary.main' }}>
                    {userInitials}
                  </Avatar>
                </IconButton>
              </Tooltip>
              <Menu
                sx={{ mt: "45px" }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                {settings.map((setting) => (
                  <MenuItem key={setting} onClick={handleCloseUserMenu}>
                    <Typography textAlign="center">
                      {setting === "Salir" ? (
                        <a
                          onClick={(e) => {
                            e.preventDefault();
                            handleLogout();
                          }}
                        >
                          {setting}
                        </a>
                      ) : (
                        setting
                      )}
                    </Typography>
                  </MenuItem>
                ))}
              </Menu>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
    </>
  );
};
