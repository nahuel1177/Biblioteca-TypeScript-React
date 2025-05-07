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
import { EditProfileModal } from "../../components/Modals/EditProfileModal";
import { IUser } from "../../interfaces/userInterface";

const pages = ["usuarios", "libros", "socios", "prestamos"];
const settings = ["perfil", "salir"];

export const LayoutModule: React.FC<{ roleType: string | undefined }> = ({
  roleType,
}) => {
  const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const [openProfileModal, setOpenProfileModal] = useState(false);
  const [currentUser, setCurrentUser] = useState<IUser | null>(null);

  // Handle opening and closing the profile modal
  const handleOpenProfileModal = () => setOpenProfileModal(true);
  const handleCloseProfileModal = () => setOpenProfileModal(false);

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
    localStorage.delete();
    navigate("/login");
  };
  
  const [name, setName] = useState<string>("");
  const [lastname, setLastname] = useState<string>("");
  const [userInitials, setUserInitials] = useState<string>("");

  useEffect(() => {
    const userData = localStorage.get();
    console.log("Datos del User: ", userData);
    if (userData) {
      const parsedData = typeof userData === "string" ? JSON.parse(userData) : userData;
      const name = parsedData.user.name || "";
      const lastname = parsedData.user.lastname || "";
      
      // Crear las iniciales del usuario
      const initials = `${name.charAt(0)}${lastname.charAt(0)}`.toUpperCase();
      
      setName(name);
      setLastname(lastname);
      setUserInitials(initials);
      
      // Actualizar el estado del usuario actual
      setCurrentUser(parsedData.user || null);
    }
  }, []);

  // Handle del menu de usuario
  const handleMenuItemClick = (setting: string) => {
    handleCloseUserMenu();
    
    if (setting === "salir") {
      handleLogout();
    } else if (setting === "perfil") {
      handleOpenProfileModal();
    }
  };

  // Handle de actualizacion de perfil de usuario en el formulario
  const handleProfileUpdate = (updatedUser: IUser) => {
    setName(updatedUser.name || "");
    setLastname(updatedUser.lastname || "");
    const initials = `${updatedUser.name?.charAt(0) || ""}${updatedUser.lastname?.charAt(0) || ""}`.toUpperCase();
    setUserInitials(initials);
    setCurrentUser(updatedUser);
    
    // Actulizar localStorage
    const userData = localStorage.get();
    if (userData) {
      const parsedData = typeof userData === "string" ? JSON.parse(userData) : userData;
      parsedData.user = updatedUser;
      localStorage.set(parsedData);
    }
  };

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
                        (page) => page !== "usuarios"
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
                  {pages.filter((page) => page !== "libros" && page!== "socios" && page!== "prestamos")
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

              <Tooltip title="Menú">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <Avatar sx={{ bgcolor: 'steelblue' }}>
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
                  <MenuItem 
                    key={setting} 
                    onClick={() => handleMenuItemClick(setting)}
                  >
                    <Typography textAlign="center">
                      {setting}
                    </Typography>
                  </MenuItem>
                ))}
              </Menu>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
      
      {/* Profile Edit Modal */}
      {currentUser && (
        <EditProfileModal
          open={openProfileModal}
          onClose={handleCloseProfileModal}
          user={currentUser}
          onUpdate={handleProfileUpdate}
        />
      )}
    </>
  );
};
