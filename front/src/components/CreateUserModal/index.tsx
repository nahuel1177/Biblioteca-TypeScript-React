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
  Paper,
  Divider,
  IconButton,
} from "@mui/material";
import Swal from "sweetalert2";
import CloseIcon from "@mui/icons-material/Close";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import PersonAddIcon from "@mui/icons-material/PersonAdd";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 450,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 0,
  borderRadius: 2,
  outline: "none",
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
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({
    name: false,
    lastname: false,
    username: false,
    email: false,
    password: false,
    role: false,
  });

  const resetForm = () => {
    setFormData({
      name: "",
      lastname: "",
      username: "",
      email: "",
      password: "",
      role: "",
    });
    setErrors({
      name: false,
      lastname: false,
      username: false,
      email: false,
      password: false,
      role: false,
    });
  };

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name as string]: value });
    
    // Clear error when user types
    if (name && errors[name as keyof typeof errors]) {
      setErrors({
        ...errors,
        [name]: false,
      });
    }
  };

  const validateForm = () => {
    const newErrors = {
      name: formData.name.trim() === "",
      lastname: formData.lastname.trim() === "",
      username: formData.username.trim() === "",
      email: formData.email.trim() === "",
      password: formData.password.trim() === "",
      role: formData.role.trim() === "",
    };
    
    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const response = await userService.createUser(formData);
      if (response.success) {
        resetForm();
        onClose();
        await onUserCreated();
        Swal.fire({
          position: "center",
          icon: "success",
          title: "¡Éxito!",
          text: "Usuario creado exitosamente",
          showConfirmButton: true,
          confirmButtonColor: "#4caf50",
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "No se pudo crear el usuario",
          confirmButtonColor: "#f44336",
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo crear el usuario",
        confirmButtonColor: "#f44336",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    resetForm();
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={handleCancel}
      aria-labelledby="create-modal-title"
      aria-describedby="create-modal-description"
    >
      <Paper sx={style} elevation={5}>
        <Box sx={{ 
          p: 2, 
          display: "flex", 
          justifyContent: "space-between", 
          alignItems: "center", 
          bgcolor: (theme) => theme.palette.mode === 'dark' ? 'primary.dark' : 'primary.main', 
          color: "white",
          borderTopLeftRadius: 8,
          borderTopRightRadius: 8
        }}>
          <Stack direction="row" spacing={1} alignItems="center">
            <PersonAddIcon />
            <Typography variant="h6" component="h2" fontWeight="bold">
              Crear Nuevo Usuario
            </Typography>
          </Stack>
          <IconButton onClick={handleCancel} size="small" aria-label="cerrar" sx={{ color: "white" }}>
            <CloseIcon />
          </IconButton>
        </Box>
        
        <Box sx={{ p: 3 }}>
          <form onSubmit={handleSubmit}>
            <TextField
              label="Nombres"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
              size="small"
              required
              error={errors.name}
              helperText={errors.name ? "El nombre es requerido" : ""}
              autoFocus
              variant="outlined"
              sx={{ mb: 2 }}
            />
            
            <TextField
              label="Apellidos"
              name="lastname"
              value={formData.lastname}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
              size="small"
              required
              error={errors.lastname}
              helperText={errors.lastname ? "El apellido es requerido" : ""}
              variant="outlined"
              sx={{ mb: 2 }}
            />
            
            <TextField
              label="Usuario"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
              size="small"
              required
              error={errors.username}
              helperText={errors.username ? "El usuario es requerido" : ""}
              variant="outlined"
              sx={{ mb: 2 }}
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
              required
              error={errors.email}
              helperText={errors.email ? "El correo es requerido" : ""}
              variant="outlined"
              sx={{ mb: 2 }}
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
              required
              error={errors.password}
              helperText={errors.password ? "La contraseña es requerida" : ""}
              variant="outlined"
              sx={{ mb: 2 }}
            />
            
            <FormControl 
              fullWidth 
              margin="normal" 
              size="small" 
              required
              error={errors.role}
              sx={{ mb: 2 }}
            >
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
              {errors.role && (
                <Typography variant="caption" color="error">
                  El rol es requerido
                </Typography>
              )}
            </FormControl>
            
            <Divider sx={{ my: 3 }} />
            
            <Stack direction="row" spacing={2} justifyContent="flex-end">
              <Button
                variant="outlined"
                color="error"
                onClick={handleCancel}
                startIcon={<CancelIcon />}
                disabled={loading}
              >
                Cancelar
              </Button>
              
              <Button
                type="submit"
                variant="contained"
                color="primary"
                startIcon={<SaveIcon />}
                disabled={loading}
              >
                Guardar
              </Button>
            </Stack>
          </form>
        </Box>
      </Paper>
    </Modal>
  );
};