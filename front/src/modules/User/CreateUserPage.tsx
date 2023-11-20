import React, { useState, ChangeEvent, FormEvent } from "react";
import {
  TextField,
  Button,
  //FormControl,
  //InputLabel,
  //Select,
  //MenuItem,
  Container,
  Stack,
  Typography,
} from "@mui/material";
import { ICreateUser } from "../../interfaces/userInterface";
import { userService } from "../../services/userService";
import { useNavigate } from "react-router-dom";
//import { Add } from "@mui/icons-material";

// Componente principal
export const CreateUserPage: React.FC = () => {

  const navigate = useNavigate();

  // Estado inicial del formulario
  const initialUserState: ICreateUser = {
    name: "",
    lastname: "",
    username: "",
    password: "",
    email: "",
    roleType: "employee", // Aquí podrías establecer un valor por defecto si lo deseas
  };

  // Estado del formulario
  const [user, setUser] = useState<ICreateUser>(initialUserState);

  // Manejar cambios en los campos del formulario
  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>
  ) => {
    const { name, value } = e.target;
    setUser({ ...user, [name as string]: value });
  };

  // Manejar envío del formulario
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    // Aquí podrías enviar los datos del usuario al servidor o realizar otras acciones según tus necesidades
    userService.createUser(user);
    console.log("Usuario creado:", user);
    // Puedes reiniciar el formulario después de enviar los datos
    setUser(initialUserState);
  };

  const handleHome = async () => {
    navigate("/usuarios");
  };

  return (
    <Stack>
      <Container maxWidth="xs">
        <form onSubmit={handleSubmit}>
          <TextField
            label="Nombre"
            name="name"
            value={user.name}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Apellido"
            name="lastname"
            value={user.lastname}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Nombre de usuario"
            name="username"
            value={user.username}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Contraseña"
            name="password"
            value={user.password}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
            type="password"
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

          {/*<FormControl fullWidth margin="normal">
                        <InputLabel>Rol</InputLabel>
                        <Select
                            name="roleId"
                            value={user.roleId}
                            onChange={handleInputChange}
                        >
                            <MenuItem value="admin">Administrador</MenuItem>
                            <MenuItem value="employee">Usuario</MenuItem>
                            {/* Agrega más roles según sea necesario
                        </Select>
                    </FormControl>*/}
          <Stack direction="row" spacing={2} style={{ marginTop: "20px" }}>
            <Button type="submit" variant="contained" color="success">
              <Typography fontSize={13}>Crear Usuario</Typography>
            </Button>
            <Button variant="contained" color="primary" onClick={handleHome}>
              <Typography fontSize={13}>Volver</Typography>
            </Button>
          </Stack>
        </form>
      </Container>
    </Stack>
  );
};
