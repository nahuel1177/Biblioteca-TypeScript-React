import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { userService } from "../../services/userService";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import Add from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from "@mui/icons-material/Search";
import EditIcon from "@mui/icons-material/Edit";
//import CreateIcon from "@mui/icons-material/Create";
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
  Button,
  Modal,
} from "@mui/material";

const style = {
  position: "absolute",
  top: "40%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
};

export function User() {
  const [users, setUsers] = useState<IUser[]>([]);
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  useEffect(() => {
    const fetchData = async () => {
      const response = await userService.getUsers();
      if (response.data.success) {
        setUsers(response.data.result);
      }
    };
    fetchData();
  }, []);

  const onCLickCreate = async () => {
    navigate("/crear-usuario");
  };
  //async function onClickSearch(id: string | undefined) {

  //}

  const initialUserState: IUser = {
    _id: "",
    name: "",
    lastname: "",
    username: "",
    email: "",
    // Aquí podrías establecer un valor por defecto si lo deseas
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

  async function onClickDelete(id: string | undefined) {
    try {
      if (!id) {
        return "Id invalido";
      }
      const response = await userService.deleteUser(id);
      if (response.data.success) {
        const response = await userService.getUsers();
        setUsers(response.data.result);
        return "Se elimino el usuario";
      }
    } catch (error) {
      ("No existe el usuario");
    }
  }

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>
  ) => {
    const { name, value } = e.target;
    setUser({ ...user, [name as string]: value });
    console.log("Usuario: ", user);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    // Aquí podrías enviar los datos del usuario al servidor o realizar otras acciones según tus necesidades
    console.log("Usuario actualizado:", user);
    userService.updateUser(user._id, user);
    // Puedes reiniciar el formulario después de enviar los datos
    const response = await userService.getUsers();
    if (response.data.success) {
      const response = await userService.getUsers();
      setUsers(response.data.result);
      setUser(initialUserState);
      handleClose();
    }
  };

  return (
    <Stack>
      <Container>
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
          sx={style}
        >
          <Container maxWidth="xs">
            <Typography variant="h6" gutterBottom marginTop={2}>
              Modificación de Usuario
            </Typography>
            <form onSubmit={handleSubmit}>
              <TextField
                label="Nombres"
                name="name"
                value={user.name}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Apellidos"
                name="lastname"
                value={user.lastname}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Usuario"
                name="username"
                value={user.username}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
                disabled
              />
              <TextField
                label="Correo electrónico"
                name="email"
                value={user.email}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
                type="email"
              />

              {/* <FormControl fullWidth margin="normal">
                        <InputLabel>Rol</InputLabel>
                        <Select
                        name="roleId"
                        value={user.roleId}
                        onChange={handleInputChange}
                        >
                        <MenuItem value="admin">Administrador</MenuItem>
                        <MenuItem value="employee">Usuario</MenuItem>
                         Agrega más roles según sea necesario
                        </Select>
                      </FormControl> */}
              <Stack direction="row" spacing={2} style={{ marginTop: "20px" }}>
                <Button
                  type="submit"
                  variant="contained"
                  color="success"
                  onClick={handleSubmit}
                >
                  <Typography fontSize={13}>Guardar</Typography>
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleClose}
                >
                  <Typography fontSize={13}>Volver</Typography>
                </Button>
              </Stack>
            </form>
          </Container>
        </Modal>
        <Card style={{ marginTop: "20px" }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Administración de Usuarios
            </Typography>
            <Stack spacing={2} sx={{ width: 300 }}>
              <Autocomplete
                freeSolo
                id="search"
                disableClearable
                options={users.map((option) => option.username)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Buscar"
                    InputProps={{
                      ...params.InputProps,
                      type: "search",
                    }}
                  />
                )}
                size="small"
              />
            </Stack>
            <Stack direction="row" spacing={2} style={{ marginTop: "20px" }}>
              <Button
                variant="contained"
                color="success"
                startIcon={<Add />}
                onClick={() => onCLickCreate()}
              >
                <Typography fontSize={13}>Usuario</Typography>
              </Button>
              <Button
                variant="contained"
                color="primary"
                startIcon={<SearchIcon />}
              >
                <Typography fontSize={13}>Buscar</Typography>
              </Button>
            </Stack>
          </CardContent>
        </Card>

        <Grid container spacing={2}>
          {users.map((user, index) => (
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
