import { useState, ChangeEvent, FormEvent } from "react";
import { userService } from "../../services/userService";
import {
  Typography,
  TextField,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Button,
  Stack,
  Container,
  Box,
  Modal,
} from "@mui/material";
import Swal from "sweetalert2";

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

interface CreateUserModalProps {
  open: boolean;
  onClose: () => void;
  onUserCreated: () => Promise<void>;
}

export const CreateUserModal = ({
  open,
  onClose,
  onUserCreated,
}: CreateUserModalProps) => {
  const [formData, setFormData] = useState({
    name: "",
    lastname: "",
    username: "",
    email: "",
    password: "",
    role: "",
  });

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name as string]: value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (
      formData.name !== "" &&
      formData.lastname !== "" &&
      formData.username !== "" &&
      formData.email !== "" &&
      formData.password !== "" &&
      formData.role !== ""
    ) {
      try {
        const response = await userService.createUser(formData);
        if (response.success) {
          setFormData({
            name: "",
            lastname: "",
            username: "",
            email: "",
            password: "",
            role: "",
          });
          onClose();
          await onUserCreated();
          Swal.fire({
            position: "center",
            icon: "success",
            text: "Usuario creado exitosamente",
            showConfirmButton: false,
            timer: 2000,
          });
        }
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "No se pudo crear el usuario",
        });
      }
    } else {
      Swal.fire({
        position: "center",
        icon: "error",
        text: "Todos los campos son obligatorios",
        showConfirmButton: true,
      });
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      disableEscapeKeyDown
      disableAutoFocus
      disableEnforceFocus
      BackdropProps={{
        sx: {
          backgroundColor: "rgba(0, 0, 0, 0.7)",
        },
      }}
    >
      <Box
        sx={{
          ...style,
          zIndex: 1300,
        }}
      >
        <Container maxWidth="xs">
          <Typography variant="h6" gutterBottom marginTop={2}>
            Crear Nuevo Usuario
          </Typography>
          <form onSubmit={handleSubmit}>
            <TextField
              label="Nombres"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
              size="small"
            />
            <TextField
              label="Apellidos"
              name="lastname"
              value={formData.lastname}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
              size="small"
            />
            <TextField
              label="Usuario"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
              size="small"
            />
            <TextField
              label="Correo electrónico"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
              type="email"
              size="small"
            />
            <TextField
              label="Contraseña"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
              type="password"
              size="small"
            />
            <FormControl fullWidth margin="normal" size="small">
              <InputLabel>Rol</InputLabel>
              <Select
                label="Rol"
                name="role"
                value={formData.role}
                onChange={(e) =>
                  handleInputChange(
                    e as ChangeEvent<{ name?: string; value: unknown }>
                  )
                }
              >
                <MenuItem value="admin">Administrador</MenuItem>
                <MenuItem value="employee">Usuario</MenuItem>
              </Select>
            </FormControl>
            <Stack direction="row" spacing={2} style={{ marginTop: "20px" }}>
              <Button
                type="submit"
                variant="contained"
                color="success"
                onClick={handleSubmit}
              >
                <Typography fontSize={13}>Crear</Typography>
              </Button>
              <Button variant="contained" color="error" onClick={onClose}>
                <Typography fontSize={13}>Cancelar</Typography>
              </Button>
            </Stack>
          </form>
        </Container>
      </Box>
    </Modal>
  );
};