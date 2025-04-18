/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { userService } from "../../services/userService";
import Add from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { useNavigate } from "react-router-dom";
import { IUser } from "../../interfaces/userInterface";
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Stack,
  Fab,
  useTheme,
} from "@mui/material";
import { SearchBar } from '../SearchBar';
import { UserEditModal } from '../EditUserModal';
import { CreateUserModal } from '../CreateUserModal';
import { useSweetAlert } from "../../hooks/useSweetAlert";

export function User() {
  const [users, setUsers] = useState<IUser[]>([]);
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleCreateModalOpen = () => setCreateModalOpen(true);
  const handleCreateModalClose = () => setCreateModalOpen(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredUsers, setFilteredUsers] = useState<IUser[]>([]);
  const theme = useTheme();
  const swal = useSweetAlert();
  
  // Configure SweetAlert2 theme based on app theme
  useEffect(() => {
    // Set SweetAlert2 theme based on the app's current theme
    document.querySelector('.swal2-container')?.setAttribute('data-theme', theme.palette.mode);
  }, [theme.palette.mode]);
  
  // Add useEffect to handle body scrolling
  useEffect(() => {
    if (open || createModalOpen) {
      // Disable scrolling when any modal is open
      document.body.style.overflow = 'hidden';
    } else {
      // Re-enable scrolling when all modals are closed
      document.body.style.overflow = 'unset';
    }
    
    // Cleanup function to ensure scrolling is re-enabled when component unmounts
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [open, createModalOpen]);
  
  const fetchUsers = async () => {
    try {
      const response = await userService.getUsers();
      if (response.result) {
        setUsers(response.result);
      }
    } catch(error) {
      if ((error as any).response && (error as any).response.status >= 500) {
        navigate('/error-500');
      }
    }
  };
  
  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (searchTerm === "") {
      setFilteredUsers([]);
    }
  }, [searchTerm]);

  const onCLickCreate = async () => {
    handleCreateModalOpen();
  };

  const initialUserState: IUser = {
    _id: "",
    name: "",
    lastname: "",
    username: "",
    email: "",
  };

  const [user, setUser] = useState<IUser>(initialUserState);

  async function onClickUpdate(user: IUser) {
    try {
      setUser(user);
      handleOpen();
    } catch (error) {
      ("No existe el usuario");
    }
  }

  async function onClickDelete(id: string) {
    try {
      const result = await swal.confirm("¿Esta seguro que desea eliminar?");
      if (result.isConfirmed) {
        const response = await userService.deleteUser(id);
        if (response.success) {
          await fetchUsers();
          swal.success("El usuario fue eliminado");
        }
      }
    } catch (error) {
      swal.error("Hubo un problema, intentelo más tarde");
    }
  }

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>
  ) => {
    const { name, value } = e.target;
    setUser({ ...user, [name as string]: value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (user.name != "" && user.lastname != "" && user.email != "") {
      userService.updateUser(user._id, user);
      const response = await userService.getUsers();
      if (response.success) {
        setUsers(response.result);
        setUser(initialUserState);
        handleClose();
        swal.success("El usuario fue modificado");
      }
    } else {
      handleClose();
      swal.error("Datos faltantes o inválidos.");
    }
  };

  const onClickSearch = () => {
    const filtered = users.filter(user => 
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.username?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredUsers(filtered);
  };

  return (
    <Stack>
      <Container>
        <UserEditModal 
          open={open}
          onClose={handleClose}
          user={user}
          handleInputChange={handleInputChange}
          handleSubmit={handleSubmit}
        />
        
        <CreateUserModal
          open={createModalOpen}
          onClose={handleCreateModalClose}
          onUserCreated={fetchUsers}
        />
        
        <Card style={{ marginTop: "20px" }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Usuarios
            </Typography>

            <Stack 
              direction="row" 
              spacing={2} 
              style={{ marginTop: "20px" }}
              alignItems="center"
              justifyContent="space-between"
            >
              <Fab color="success" onClick={() => onCLickCreate()} size="small">
                <Add />
              </Fab>

              <SearchBar
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                onSearch={onClickSearch}
                placeholder="Buscar usuario..."
              />
            </Stack>
          </CardContent>
        </Card>

        <Grid container spacing={2}>
          {(filteredUsers.length > 0 ? filteredUsers : users).map((user, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card style={{ marginTop: "20px" }}>
                <CardContent>
                  <Typography variant="h6" component="div">
                    {user.username}
                  </Typography>

                  <Typography variant="body2" color="text.secondary">
                    {user.lastname}
                    {", "} {user.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Correo: {user.email}
                  </Typography>
                  <Stack
                    direction="row"
                    spacing={2}
                    style={{ marginTop: "20px" }}
                  >
                    <Fab
                      size="small"
                      color="primary"
                      aria-label="edit"
                      onClick={() => onClickUpdate(user)}
                    >
                      <EditIcon />
                    </Fab>
                    <Fab
                      size="small"
                      color="error"
                      aria-label="edit"
                      onClick={() => onClickDelete(user._id)}
                    >
                      <DeleteIcon />
                    </Fab>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Stack>
  );
}
