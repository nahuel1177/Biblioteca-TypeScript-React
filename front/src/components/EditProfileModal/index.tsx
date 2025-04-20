import React, { useState, ChangeEvent, FormEvent } from "react";
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  Grid,
  Paper,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { userService } from "../../services/userService";
import { IUser } from "../../interfaces/userInterface";	
import { useSweetAlert } from "../../hooks/useSweetAlert";


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
  const swal = useSweetAlert();

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

    // Password validation only if user entered something
    if (password && password.length < 6) {
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

    try {
      // Only include password in the update if it was provided
      const dataToUpdate = {
        _id: user._id,
        name: formData.name,
        lastname: formData.lastname,
        username: user.username,
        ...(password ? { password: formData.password } : { password: user.password }),
        email: formData.email,
        role: user.role
      };
      console.log("Data to update:", dataToUpdate.username);
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
      swal.error(error?.message || "Error al actualizar el perfil");
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="edit-profile-modal-title"
    >
      <Paper
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 500,
          maxWidth: "90%",
          p: 4,
          borderRadius: 2,
          boxShadow: 24,
        }}
      >
        <Box sx={{ mb: 2, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Typography variant="h5" component="h2" fontWeight="bold">
            Editar Perfil
          </Typography>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>

        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
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
              />
            </Grid>

            <Grid item xs={12} sm={6}>
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
              />
            </Grid>

            <Grid item xs={12}>
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
              />
            </Grid>

            <Grid item xs={12}>
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
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Nueva Contraseña"
                name="password"
                type="password"
                value={password}
                onChange={handleChange}
                error={!!errors.password}
                helperText={errors.password || "Dejar en blanco para mantener la contraseña actual"}
                variant="outlined"
                margin="normal"
                size="small"
              />
            </Grid>

            <Grid item xs={12}>
              <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2, gap: 2 }}>
                <Button 
                  variant="outlined" 
                  onClick={onClose}
                  sx={{ textTransform: "none" }}
                >
                  Cancelar
                </Button>
                <Button 
                  type="submit" 
                  variant="contained" 
                  color="primary"
                  sx={{ textTransform: "none" }}
                >
                  Guardar
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Modal>
  );
};