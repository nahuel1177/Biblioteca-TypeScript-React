/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { userService } from "../../services/userService";
import { useNavigate } from "react-router-dom";
import { IUser } from "../../interfaces/userInterface";
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Stack,
  useTheme,
  Chip,
} from "@mui/material";
import { SearchBar } from '../SearchBar';
import { UserEditModal } from '../Modals/EditUserModal';
import { CreateUserModal } from '../Modals/CreateUserModal';
import { ViewUserModal } from '../Modals/ViewUserModal';
import { useSweetAlert } from "../../hooks/useSweetAlert";
import { CreateButton, EditButton, DeleteButton, ViewButton } from "../Buttons";


export function User() {
  const [users, setUsers] = useState<IUser[]>([]);
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleCreateModalOpen = () => setCreateModalOpen(true);
  const handleCreateModalClose = () => setCreateModalOpen(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredUsers, setFilteredUsers] = useState<IUser[]>([]);
  const theme = useTheme();
  const swal = useSweetAlert();
  
  
  useEffect(() => {
    document.querySelector('.swal2-container')?.setAttribute('data-theme', theme.palette.mode);
  }, [theme.palette.mode]);
  
  
  useEffect(() => {
    if (open || createModalOpen || viewModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [open, createModalOpen, viewModalOpen]);
  
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const fetchUsers = async () => {
    try {
      const response = await userService.getUsers();
      if (response.result) {
        setUsers(response.result);
      }else{
        swal.fire({
          toast: true,
          position: "top-end",
          text: "Error al cargar los usuarios",
          icon: "error",
          showConfirmButton: false,
          timer: 1500,
        });
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
    role: "",
  };

  const [user, setUser] = useState<IUser>(initialUserState);

  async function onClickUpdate(user: IUser) {
    try {
      // Verificar si el usuario es administrador
      if (user.role === "admin") {
        swal.fire({
          title: "Acción no permitida",
          text: "No se pueden modificar los datos de un usuario administrador",
          icon: "warning",
          confirmButtonText: "Entendido"
        });
        return;
      }
      
      setUser(user);
      handleOpen();
    } catch (error) {
      swal.error("No existe el usuario");
    }
  }

  async function onClickDelete(id: string, role: string) {
    try {
      // Verificar si el usuario es administrador
      if (role === "admin") {
        swal.fire({
          title: "Acción no permitida",
          text: "No se puede eliminar un usuario administrador",
          icon: "warning",
          confirmButtonText: "Entendido"
        });
        return;
      }
      
      const result = await swal.confirm("¿Esta seguro que desea eliminar?");
      if (result.isConfirmed) {
        const response = await userService.deleteUser(id);
        if (response.success) {
          await fetchUsers();
          swal.success("El usuario fue eliminado");
        } else {
          swal.error(response.error || "Error al eliminar el usuario");
        }
      }
    } catch (error) {
      swal.error("Hubo un problema, intentelo más tarde");
    }
  }

  const handleViewUser = (user: IUser) => {
    setUser(user);
    setViewModalOpen(true);
  };

  const handleCloseViewModal = () => {
    setViewModalOpen(false);
  };

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>
  ) => {
    const { name, value } = e.target;
    setUser({ ...user, [name as string]: value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (user.name != "" && user.lastname != "" && user.email != "") {
      const updateResponse = await userService.updateUser(user._id, user);
      if (updateResponse.success) {
        await fetchUsers();
        setUser(initialUserState);
        handleClose();
        swal.success("El usuario fue modificado");
      } else {
        swal.error("Error al modificar el usuario");
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
        
        <ViewUserModal
          open={viewModalOpen}
          onClose={handleCloseViewModal}
          user={user}
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
              <CreateButton 
                onClick={onCLickCreate} 
                tooltipTitle="Agregar Usuario" 
              />

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
                  <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
                    <Typography component="div">
                      {user.username}
                    </Typography>
                    {user.role && (
                      <Chip 
                        label={user.role === "admin" ? "Administrador" : "Usuario"} 
                        color={user.role === "admin" ? "primary" : "success"}
                        size="small"
                      />
                    )}
                  </Stack>

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
                    {user.role === "admin" ? (
                      <ViewButton
                        onClick={() => handleViewUser(user)}
                        tooltipTitle="Ver Detalles"
                      />
                    ) : (
                      <>
                        <EditButton 
                          onClick={() => onClickUpdate(user)} 
                          tooltipTitle="Editar Usuario"
                        />
                        <DeleteButton 
                          onClick={() => onClickDelete(user._id, user.role || "")} 
                          tooltipTitle="Eliminar Usuario"
                        />
                      </>
                    )}
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
