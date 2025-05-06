/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, ChangeEvent, FormEvent, useEffect } from "react";
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  Paper,
  Stack,
  Divider,
  CircularProgress,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { userService } from "../../../services/userService";
import { IUser } from "../../../interfaces/userInterface";	
import { useSweetAlert } from "../../../hooks/useSweetAlert";
import CancelIcon from "@mui/icons-material/Cancel";
import SaveIcon from "@mui/icons-material/Save";
import PersonIcon from "@mui/icons-material/Person";

interface EditProfileModalProps {
  open: boolean;
  onClose: () => void;
  user: IUser;
  onUpdate: (updatedUser: IUser) => void;
}

export const EditProfileModal: React.FC<EditProfileModalProps> = ({
  open,
  onClose,
  user,
  onUpdate,
}) => {
  const [formData, setFormData] = useState<IUser>({ ...user });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [checkingEmail, setCheckingEmail] = useState(false);
  const [originalEmail, setOriginalEmail] = useState(user.email);
  const swal = useSweetAlert();

  // Actualizar el email original cuando cambia el usuario
  useEffect(() => {
    if (open) {
      setFormData({ ...user });
      setOriginalEmail(user.email);
      setPassword("");
      setErrors({});
    }
  }, [user, open]);

  // Función para manejar el cierre del modal y limpiar el formulario
  const handleModalClose = () => {
    // Restablecer todos los estados a sus valores iniciales
    setFormData({ ...user });
    setPassword("");
    setLoading(false);
    setCheckingEmail(false);
    setErrors({});
    setOriginalEmail(user.email);
    
    // Llamar a la función onClose proporcionada por el componente padre
    onClose();
  };

  // Verificar disponibilidad de email cuando cambia
  useEffect(() => {
    if (formData.email && 
        formData.email.trim() !== "" && 
        formData.email !== originalEmail) {
      const timer = setTimeout(() => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (emailRegex.test(formData.email || '')) {
          checkEmailAvailability(formData.email || '');
        }
      }, 500);
      return () => clearTimeout(timer);
    } else if (formData.email === originalEmail) {
      // Si el correo no ha cambiado, limpiamos cualquier error existente
      setErrors(prev => ({ ...prev, email: "" }));
    }
  }, [formData.email, originalEmail]);

  const checkEmailAvailability = async (email: string) => {
    setCheckingEmail(true);
    try {
      const response = await userService.getUserByMail(email);
      if (response.success) {
        setErrors(prev => ({ ...prev, email: "Este correo electrónico ya está registrado" }));
      } else {
        setErrors(prev => ({ ...prev, email: "" }));
      }
    } catch (error) {
      console.error("Error checking email:", error);
    } finally {
      setCheckingEmail(false);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === "password") {
      setPassword(value);
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }

    // Clear error when field is edited
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name?.trim()) {
      newErrors.name = "El nombre es requerido";
    }

    if (!formData.lastname?.trim()) {
      newErrors.lastname = "El apellido es requerido";
    }

    if (!formData.email?.trim()) {
      newErrors.email = "El email es requerido";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email inválido";
    }

    // Validación de contraseña obligatoria
    if (!password.trim()) {
      newErrors.password = "La contraseña es requerida";
    } else if (password.length < 6) {
      newErrors.password = "La contraseña debe tener al menos 6 caracteres";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // Verificación final de disponibilidad de Email antes del envío
    if (formData.email !== originalEmail) {
      const emailCheck = await userService.getUserByMail(formData.email || '');
      if (emailCheck.success) {
        setErrors(prev => ({ ...prev, email: "Este correo electrónico ya está registrado" }));
        return;
      }
    }

    setLoading(true);
    try {
      // Only include password in the update if it was provided
      const dataToUpdate = {
        _id: user._id,
        name: formData.name,
        lastname: formData.lastname,
        username: user.username,
        ...(password ? { password } : {}),
        email: formData.email,
        role: user.role
      };
      
      const response = await userService.updateUser(user._id, dataToUpdate);

      if (response && response.success) {
        swal.success("Perfil actualizado correctamente");
        
        // Update with the new data
        const updatedUser = {
          ...user,
          ...dataToUpdate
        };
        
        onUpdate(updatedUser);
        onClose();
      } else {
        swal.error(response?.error || "Error al actualizar el perfil");
      }
    } catch (error: any) {
      console.error("Error updating profile:", error);
      onClose();
      swal.error(error?.message || "Error al actualizar el perfil");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={handleModalClose} // Usar la nueva función en lugar de onClose
      aria-labelledby="edit-profile-modal-title"
    >
      <Paper
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 450,
          p: 0,
          borderRadius: 2,
          boxShadow: 24,
          outline: "none",
        }}
      >
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
            <PersonIcon />
            <Typography variant="h6" component="h2" fontWeight="bold">
              Editar Perfil
            </Typography>
          </Stack>
          <IconButton onClick={handleModalClose} size="small" aria-label="cerrar" sx={{ color: "white" }}>
            <CloseIcon />
          </IconButton>
        </Box>

        <Box sx={{ p: 3 }}>
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Nombre"
              name="name"
              value={formData.name || ""}
              onChange={handleChange}
              error={!!errors.name}
              helperText={errors.name}
              variant="outlined"
              margin="normal"
              size="small"
              sx={{ mb: 2 }}
            />

            <TextField
              fullWidth
              label="Apellido"
              name="lastname"
              value={formData.lastname || ""}
              onChange={handleChange}
              error={!!errors.lastname}
              helperText={errors.lastname}
              variant="outlined"
              margin="normal"
              size="small"
              sx={{ mb: 2 }}
            />

            <TextField
              fullWidth
              label="Nombre de usuario"
              name="username"
              value={formData.username || ""}
              InputProps={{
                readOnly: true,
              }}
              variant="outlined"
              margin="normal"
              size="small"
              disabled
              sx={{ mb: 2 }}
            />

            <TextField
              fullWidth
              label="Email"
              name="email"
              type="email"
              value={formData.email || ""}
              onChange={handleChange}
              error={!!errors.email}
              helperText={errors.email}
              variant="outlined"
              margin="normal"
              size="small"
              sx={{ mb: 2 }}
              InputProps={{
                endAdornment: checkingEmail ? <CircularProgress size={20} /> : null
              }}
            />

            <TextField
              fullWidth
              label="Contraseña"
              name="password"
              type="password"
              value={password}
              onChange={handleChange}
              error={!!errors.password}
              helperText={errors.password || "Ingrese su contraseña actual para guardar los cambios o una nueva si desea cambiarla."}
              variant="outlined"
              margin="normal"
              size="small"
              sx={{ mb: 2 }}
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