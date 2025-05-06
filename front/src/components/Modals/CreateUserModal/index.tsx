import { useState, ChangeEvent, FormEvent, useEffect } from "react";
import {
  Typography,
  TextField,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Button,
  Stack,
  Box,
  Modal,
  Paper,
  Divider,
  IconButton,
  CircularProgress,
  FormHelperText,
} from "@mui/material";
import { userService } from "../../../services/userService";
import CloseIcon from "@mui/icons-material/Close";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import Swal from "sweetalert2";
import { useTheme } from "@mui/material/styles";

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
  const theme = useTheme(); // Obtener el tema actual
  const [formData, setFormData] = useState({
    name: "",
    lastname: "",
    username: "",
    email: "",
    password: "",
    role: "",
  });
  const [loading, setLoading] = useState(false);
  const [checkingUsername, setCheckingUsername] = useState(false);
  const [checkingEmail, setCheckingEmail] = useState(false);
  const [errors, setErrors] = useState({
    name: false,
    lastname: false,
    username: false,
    email: false,
    password: false,
    role: false,
  });
  const [errorMessages, setErrorMessages] = useState({
    username: "",
    email: "",
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

  // Add debounce for username and email checks
  useEffect(() => {
    const timer = setTimeout(() => {
      if (formData.username && !errors.username) {
        checkUsernameAvailability(formData.username);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [errors.username, formData.username]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (formData.email && !errors.email) {
        checkEmailAvailability(formData.email);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [errors.email, formData.email]);

  const checkUsernameAvailability = async (username: string) => {
    setCheckingUsername(true);
    try {
      const response = await userService.getUserByUsername(username);
      if (response.success) {
        setErrors(prev => ({ ...prev, username: true }));
        setErrorMessages(prev => ({ ...prev, username: "Este nombre de usuario ya está en uso" }));
      }
    } catch (error) {
      console.error("Error checking username:", error);
    } finally {
      setCheckingUsername(false);
    }
  };

  const checkEmailAvailability = async (email: string) => {
    setCheckingEmail(true);
    try {
      const response = await userService.getUserByMail(email);
      if (response.success) {
        setErrors(prev => ({ ...prev, email: true }));
        setErrorMessages(prev => ({ ...prev, email: "Este correo electrónico ya está registrado" }));
      }
    } catch (error) {
      console.error("Error checking email:", error);
    } finally {
      setCheckingEmail(false);
    }
  };

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name as string]: value });

    // Clear error when user types
    if (name && errors[name as keyof typeof errors]) {
      // For email, validate format as user types
      if (name === 'email') {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const isEmailValid = value === '' || emailRegex.test(value as string);

        setErrors({
          ...errors,
          [name]: !isEmailValid,
        });

        if (!isEmailValid && value !== '') {
          setErrorMessages(prev => ({
            ...prev,
            [name]: "Formato de correo inválido",
          }));
        } else {
          setErrorMessages(prev => ({
            ...prev,
            [name]: "",
          }));
        }
      } else if (name === 'username') {
        // Validar que el nombre de usuario no esté vacío
        const isUsernameValid = value !== '';

        setErrors({
          ...errors,
          [name]: !isUsernameValid,
        });

        if (!isUsernameValid) {
          setErrorMessages(prev => ({
            ...prev,
            [name]: "El usuario es requerido",
          }));
        } else {
          setErrorMessages(prev => ({
            ...prev,
            [name]: "",
          }));

          // Si el nombre de usuario es válido, verificar disponibilidad
          if (value !== '') {
            // La verificación real se hará en el useEffect con debounce
            setCheckingUsername(true);
          }
        }
      } else if (name === 'password') {
        // Validar la contraseña mientras se escribe
        const isPasswordValid = value === '' || (value as string).length >= 6;
        
        setErrors({
          ...errors,
          [name]: !isPasswordValid,
        });
      } else {
        setErrors({
          ...errors,
          [name]: false,
        });
      }
    } else if (name === 'email') {
      // Also validate email even if there was no previous error
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const isEmailValid = value === '' || emailRegex.test(value as string);

      if (!isEmailValid && value !== '') {
        setErrors({
          ...errors,
          [name]: true,
        });
        setErrorMessages(prev => ({
          ...prev,
          [name]: "Formato de correo inválido",
        }));
      }
    } else if (name === 'username' && value !== '') {
      // Iniciar verificación de disponibilidad del nombre de usuario
      setCheckingUsername(true);
    } else if (name === 'password' && value !== '') {
      // Validar la contraseña en tiempo real incluso si no había error previo
      const isPasswordValid = (value as string).length >= 6;
      
      setErrors({
        ...errors,
        [name]: !isPasswordValid,
      });
    }
  };

  const validateForm = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isEmailValid = emailRegex.test(formData.email);
    const isPasswordValid = formData.password.length >= 6;

    const newErrors = {
      name: formData.name.trim() === "",
      lastname: formData.lastname.trim() === "",
      username: formData.username.trim() === "" || errors.username,
      email: formData.email.trim() === "" || !isEmailValid || errors.email,
      password: formData.password.trim() === "" || !isPasswordValid,
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

    // Final check for username and email availability before submission
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
          background: theme.palette.background.paper,
          color: theme.palette.text.primary,
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "No se pudo crear el usuario",
          confirmButtonColor: "#f44336",
          background: theme.palette.background.paper,
          color: theme.palette.text.primary,
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo crear el usuario",
        confirmButtonColor: "#f44336",
        background: theme.palette.background.paper,
        color: theme.palette.text.primary,
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
              error={errors.username}
              helperText={errors.username ?
                (errorMessages.username || "El usuario es requerido") : ""}
              variant="outlined"
              sx={{ mb: 2 }}
              InputProps={{
                endAdornment: checkingUsername ? <CircularProgress size={20} /> : null
              }}
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
              error={errors.email}
              helperText={errors.email ?
                (errorMessages.email ||
                  (formData.email.trim() === "" ? "El correo es requerido" : "Formato de correo inválido"))
                : ""}
              variant="outlined"
              sx={{ mb: 2 }}
              InputProps={{
                endAdornment: checkingEmail ? <CircularProgress size={20} /> : null
              }}
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
              error={errors.password}
              helperText={errors.password ?
                (formData.password.trim() === "" ? "La contraseña es requerida" : "La contraseña debe tener al menos 6 caracteres")
                : ""}
              variant="outlined"
              sx={{ mb: 2 }}
            />

            <FormControl
              fullWidth
              margin="normal"
              size="small"
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
                <FormHelperText error>
                  El rol es requerido
                </FormHelperText>
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