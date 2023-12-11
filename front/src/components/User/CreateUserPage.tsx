import React, { useState, ChangeEvent, FormEvent, useEffect } from "react";
import {
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Container,
  Stack,
  Typography,
} from "@mui/material";
import { ICreateUser, IUser } from "../../interfaces/userInterface";
import { userService } from "../../services/userService";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

// Componente principal
export const CreateUserPage: React.FC = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState<IUser[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await userService.getUsers();
      if (response.success) {
        setUsers(response.result);
        console.log(users);
      }
    };
    fetchData();
  }, []);

  // Estado inicial del formulario
  const initialUserState: ICreateUser = {
    name: "",
    lastname: "",
    username: "",
    password: "",
    email: "",
    role: "", // Aquí podrías establecer un valor por defecto si lo deseas
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

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    // Manejar los datos del usuario al servidor o realizar otras acciones según necesidades
    if (
      user.name != "" &&
      user.lastname != "" &&
      user.email != "" &&
      user.password != "" &&
      user.role != "" &&
      user.username != ""
    ) {
      const userFinded = await userService.getUserByUsername(user.username);
      if (!userFinded.success) {
        userService.createUser(user);
        Swal.fire({
          position: "center",
          icon: "success",
          text: "El usuario fue dado de alta",
          showConfirmButton: true,
        });
        // Puedes reiniciar el formulario después de enviar los datos
        setUser(initialUserState);
      } else {
        Swal.fire({
          position: "center",
          icon: "error",
          text: "El usuario ya existe.",
          showConfirmButton: true,
        });
      }
    }else{
      Swal.fire({
        position: "center",
        icon: "error",
        text: "Datos faltantes o inválidos.",
        showConfirmButton: true,
      });
    }
  };

  const handleHome = async () => {
    navigate("/usuarios");
  };

  return (
    <Stack>
      <Container maxWidth="xs">
        <Typography variant="h6" gutterBottom marginTop={2}>
          Alta de Usuario
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Nombres"
            name="name"
            value={user.name}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
            size="small"
          />
          <TextField
            label="Apellidos"
            name="lastname"
            value={user.lastname}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
            size="small"
          />
          <TextField
            label="Usuario"
            name="username"
            value={user.username}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
            size="small"
          />
          <TextField
            label="Contraseña"
            name="password"
            value={user.password}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
            type="password"
            size="small"
          />
          <TextField
            label="Correo electrónico"
            name="email"
            value={user.email}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
            type="email"
            size="small"
          />
          <FormControl fullWidth margin="normal" size="small">
            <InputLabel>Seleccionar Rol</InputLabel>
            <Select
              label="Seleccionar Rol"
              name="role"
              value={user.role}
              onChange={(e) =>
                handleInputChange(
                  e as ChangeEvent<{ name?: string; value: unknown }>
                )
              }
            >
              <MenuItem value="admin">Administrador</MenuItem>
              <MenuItem value="employee">Empleado</MenuItem>
              {/* Agrega más roles según sea necesario*/}
            </Select>
          </FormControl>

          <Stack direction="row" spacing={2} style={{ marginTop: "20px" }}>
            <Button type="submit" variant="contained" color="success">
              <Typography fontSize={13}>Crear</Typography>
            </Button>
            <Button variant="contained" color="error" onClick={handleHome}>
              <Typography fontSize={13}>Cancelar</Typography>
            </Button>
          </Stack>
        </form>
      </Container>
    </Stack>
  );
};
