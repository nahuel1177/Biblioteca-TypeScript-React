import { ChangeEvent, FormEvent, useState } from "react";
import { IUser } from "../../../interfaces/userInterface";
import {
  Typography,
  TextField,
  Button,
  Stack,
  Box,
  Modal,
  Paper,
  Divider,
  IconButton,
  CircularProgress,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import EditIcon from "@mui/icons-material/Edit";
import { useEffect } from "react";
import { userService } from "../../../services/userService";

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

interface UserEditModalProps {
  open: boolean;
  onClose: () => void;
  user: IUser;
  handleInputChange: (
    e: ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>
  ) => void;
  handleSubmit: (e: FormEvent) => Promise<void>;
  resetUser?: () => void; // Nueva prop para restablecer el usuario
}

export const UserEditModal = ({
  open,
  onClose,
  user,
  handleInputChange,
  handleSubmit,
  resetUser,
}: UserEditModalProps) => {
  const [loading, setLoading] = useState(false);
  const [checkingEmail, setCheckingEmail] = useState(false);
  const [errors, setErrors] = useState({
    name: false,
    lastname: false,
    email: false,
    role: false,
  });
  const [errorMessages, setErrorMessages] = useState({
    name: "",
    lastname: "",
    email: "",
    role: "",
  });

  const handleFormSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    // Verificación final de disponibilidad de correo electrónico antes del envío
    if (user.email !== originalEmail) {
      const emailCheck = await userService.getUserByMail(user.email || '');
      if (emailCheck.success) {
        setErrors(prev => ({ ...prev, email: true }));
        setErrorMessages(prev => ({ ...prev, email: "Este correo electrónico ya está registrado" }));
        return;
      }
    }
    
    setLoading(true);
    try {
      await handleSubmit(e);
    } finally {
      setLoading(false);
    }
  };

  const checkEmailAvailability = async (email: string) => {
    setCheckingEmail(true);
    try {
      const response = await userService.getUserByMail(email);
      if (response.success) {
        setErrors((prev) => ({ ...prev, email: true }));
        setErrorMessages(prev => ({ ...prev, email: "Este correo electrónico ya está registrado" }));
      } else {
        setErrors((prev) => ({ ...prev, email: false }));
        setErrorMessages(prev => ({ ...prev, email: "" }));
      }
    } catch (error) {
      console.error("Error checking email:", error);
    } finally {
      setCheckingEmail(false);
    }
  };

  const validateEmailFormat = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isEmailValid = user.email ? emailRegex.test(user.email) : false;
    
    const newErrors = {
      name: !user.name || user.name.trim() === "",
      lastname: !user.lastname || user.lastname.trim() === "",
      email: !user.email || user.email.trim() === "" || !isEmailValid || (errorMessages.email !== ""),
      role: !user.role || user.role.trim() === "",
    };
    
    setErrors(newErrors);
    
    // Actualizar mensajes de error
    setErrorMessages(prev => ({
      ...prev,
      name: newErrors.name ? "El nombre es requerido" : "",
      lastname: newErrors.lastname ? "El apellido es requerido" : "",
      email: newErrors.email ? 
        (user.email?.trim() === "" ? "El correo es requerido" : 
         !isEmailValid ? "Formato de correo inválido" : 
         prev.email) : "",
      role: newErrors.role ? "El rol es requerido" : "",
    }));
    
    return !Object.values(newErrors).some(error => error);
  };

  const [originalEmail, setOriginalEmail] = useState(user.email);

  useEffect(() => {
    setOriginalEmail(user.email);
    // Reiniciar errores cuando cambia el usuario
    setErrors({
      name: false,
      lastname: false,
      email: false,
      role: false,
    });
    setErrorMessages({
      name: "",
      lastname: "",
      email: "",
      role: "",
    });
  }, [user._id]); // Se actualiza cuando cambia el usuario a editar

  useEffect(() => {
    if (user.email && user.email.trim() !== "") {
      const timer = setTimeout(() => {
        if (!validateEmailFormat(user.email)) {
          setErrors((prev) => ({ ...prev, email: true }));
          setErrorMessages(prev => ({ ...prev, email: "Formato de correo inválido" }));
        } else if (user.email !== originalEmail) {
          checkEmailAvailability(user.email);
        } else {
          setErrors((prev) => ({ ...prev, email: false }));
          setErrorMessages(prev => ({ ...prev, email: "" }));
        }
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [user.email, originalEmail]);

  // Función para manejar el cierre del modal y limpiar el formulario
  const handleModalClose = () => {
    // Limpiar estados internos
    setErrors({ 
      name: false,
      lastname: false,
      email: false,
      role: false,
    });
    setErrorMessages({
      name: "",
      lastname: "",
      email: "",
      role: "",
    });
    setCheckingEmail(false);
    
    // Notificar al componente padre para restablecer el usuario si se proporciona la función
    if (resetUser) {
      resetUser();
    }
    
    // Llamar a la función onClose proporcionada por el componente padre
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={handleModalClose}
      aria-labelledby="edit-modal-title"
      aria-describedby="edit-modal-description"
    >
      <Paper sx={style} elevation={5}>
        <Box
          sx={{
            p: 2,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            bgcolor: (theme) =>
              theme.palette.mode === "dark" ? "primary.dark" : "primary.main",
            color: "white",
            borderTopLeftRadius: 8,
            borderTopRightRadius: 8,
          }}
        >
          <Stack direction="row" spacing={1} alignItems="center">
            <EditIcon />
            <Typography variant="h6" component="h2" fontWeight="bold">
              Modificación de Usuario
            </Typography>
          </Stack>
          <IconButton
            onClick={handleModalClose}
            size="small"
            aria-label="cerrar"
            sx={{ color: "white" }}
          >
            <CloseIcon />
          </IconButton>
        </Box>

        <Box sx={{ p: 3 }}>
          <form onSubmit={handleFormSubmit}>
            <TextField
              label="Nombres"
              name="name"
              value={user.name}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
              size="small"
              error={errors.name}
              helperText={errors.name ? errorMessages.name : ""}
              variant="outlined"
              sx={{ mb: 2 }}
            />

            <TextField
              label="Apellidos"
              name="lastname"
              value={user.lastname}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
              size="small"
              error={errors.lastname}
              helperText={errors.lastname ? errorMessages.lastname : ""}
              variant="outlined"
              sx={{ mb: 2 }}
            />

            <TextField
              label="Usuario"
              name="username"
              value={user.username}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
              disabled
              size="small"
              variant="outlined"
              sx={{ mb: 2 }}
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
              error={errors.email}
              helperText={errors.email ? errorMessages.email : ""}
              variant="outlined"
              sx={{ mb: 0 }}
              InputProps={{
                endAdornment: checkingEmail ? (
                  <CircularProgress size={20} />
                ) : null,
              }}
            />

            <Divider sx={{ my: 3 }} />

            <Stack direction="row" spacing={2} justifyContent="flex-end">
              <Button
                variant="outlined"
                color="error"
                onClick={handleModalClose}
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
