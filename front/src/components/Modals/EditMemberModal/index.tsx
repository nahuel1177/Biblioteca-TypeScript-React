import { useState, ChangeEvent, FormEvent, useEffect } from "react";
import { memberService } from "../../../services/memberService";
import {
  Typography,
  TextField,
  Button,
  Stack,
  Modal,
  Paper,
  Divider,
  IconButton,
  Box,
  CircularProgress,
} from "@mui/material";
import Swal from "sweetalert2";
import CloseIcon from "@mui/icons-material/Close";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import EditIcon from "@mui/icons-material/Edit";
import { IMember } from "../../../interfaces/memberInterface";

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

interface EditMemberModalProps {
  open: boolean;
  handleClose: () => void;
  member: IMember;
  onMemberUpdated: () => void;
}

export function EditMemberModal({ open, handleClose, member, onMemberUpdated }: EditMemberModalProps) {
  const [editedMember, setEditedMember] = useState<IMember>(member);
  const [loading, setLoading] = useState(false);
  const [checkingDni, setCheckingDni] = useState(false);
  const [checkingEmail, setCheckingEmail] = useState(false);
  const [errors, setErrors] = useState({
    name: false,
    lastname: false,
    email: false,
    dni: false,
  });
  const [errorMessages, setErrorMessages] = useState({
    dni: "",
    email: "",
  });

  // Actualizar el miembro editado cuando cambia el miembro original
  useEffect(() => {
    setEditedMember(member);
  }, [member]);

  // Función para manejar el cierre del modal y limpiar el formulario
  const handleModalClose = () => {
    // Restablecer todos los estados a sus valores iniciales
    setEditedMember(member);
    setLoading(false);
    setCheckingDni(false);
    setCheckingEmail(false);
    setErrors({
      name: false,
      lastname: false,
      email: false,
      dni: false,
    });
    setErrorMessages({
      dni: "",
      email: "",
    });
    
    // Llamar a la función handleClose proporcionada por el componente padre
    handleClose();
  };

  // Añadir debounce para verificación de DNI
  useEffect(() => {
    if (editedMember.dni && editedMember.dni > 0 && editedMember.dni !== member.dni) {
      const timer = setTimeout(() => {
        checkDniAvailability(editedMember.dni);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [editedMember.dni, member.dni]);

  // Añadir debounce para verificación de Email
  useEffect(() => {
    if (editedMember.email && 
        editedMember.email.trim() !== "" && 
        editedMember.email !== member.email) {
      const timer = setTimeout(() => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (emailRegex.test(editedMember.email || '')) {
          checkEmailAvailability(editedMember.email || '');
        }
      }, 500);
      return () => clearTimeout(timer);
    } else if (editedMember.email === member.email) {
      // Si el correo no ha cambiado, limpiamos cualquier error existente
      setErrors(prev => ({ ...prev, email: false }));
      setErrorMessages(prev => ({ ...prev, email: "" }));
    }
  }, [editedMember.email, member.email]);

  const checkDniAvailability = async (dni: number) => {
    setCheckingDni(true);
    try {
      const response = await memberService.getMemberByDni(dni);
      if (response.success) {
        setErrors(prev => ({ ...prev, dni: true }));
        setErrorMessages(prev => ({ ...prev, dni: "Este DNI ya está registrado" }));
      } else {
        setErrorMessages(prev => ({ ...prev, dni: "" }));
      }
    } catch (error) {
      console.error("Error checking DNI:", error);
    } finally {
      setCheckingDni(false);
    }
  };

  const checkEmailAvailability = async (email: string) => {
    setCheckingEmail(true);
    try {
      const response = await memberService.getMemberByMail(email);
      if (response.success) {
        setErrors(prev => ({ ...prev, email: true }));
        setErrorMessages(prev => ({ ...prev, email: "Este correo electrónico ya está registrado" }));
      } else {
        setErrorMessages(prev => ({ ...prev, email: "" }));
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
    setEditedMember({ ...editedMember, [name as string]: value });

    if (name && errors[name as keyof typeof errors]) {
      setErrors({
        ...errors,
        [name]: false,
      });
      
      // Limpiar mensaje de error para DNI y email
      if (name === 'dni' || name === 'email') {
        setErrorMessages(prev => ({
          ...prev,
          [name]: "",
        }));
      }
    }
  };

  const validateForm = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isEmailValid = editedMember.email ? emailRegex.test(editedMember.email) : false;
    
    const newErrors = {
      name: !editedMember.name || editedMember.name.trim() === "",
      lastname: !editedMember.lastname || editedMember.lastname.trim() === "",
      email: !editedMember.email || editedMember.email.trim() === "" || !isEmailValid || (errorMessages.email !== ""),
      dni: !editedMember.dni || editedMember.dni <= 0 || (errorMessages.dni !== ""),
    };

    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // Verificación final de disponibilidad de DNI antes del envío
    if (editedMember.dni !== member.dni) {
      const dniCheck = await memberService.getMemberByDni(editedMember.dni || 0);
      if (dniCheck.success) {
        setErrors(prev => ({ ...prev, dni: true }));
        setErrorMessages(prev => ({ ...prev, dni: "Este DNI ya está registrado" }));
        return;
      }
    }

    // Verificación final de disponibilidad de Email antes del envío
    if (editedMember.email !== member.email) {
      const emailCheck = await memberService.getMemberByMail(editedMember.email || '');
      if (emailCheck.success) {
        setErrors(prev => ({ ...prev, email: true }));
        setErrorMessages(prev => ({ ...prev, email: "Este correo electrónico ya está registrado" }));
        return;
      }
    }
    // Si llegamos aquí, significa que el correo no está duplicado o no ha cambiado
    setLoading(true);
    try {
      const response = await memberService.updateMember(editedMember._id, editedMember);
      if (response.success) {
        handleClose();
        onMemberUpdated();
        Swal.fire({
          position: "center",
          icon: "success",
          title: "¡Éxito!",
          text: "El socio fue modificado exitosamente",
          showConfirmButton: true,
          confirmButtonColor: "#4caf50",
        });
      } else {
        Swal.fire({
          position: "center",
          icon: "error",
          title: "Error",
          text: "Error al modificar el socio",
          showConfirmButton: true,
          confirmButtonColor: "#f44336",
        });
      }
    } catch (error) {
      Swal.fire({
        position: "center",
        icon: "error",
        title: "Error",
        text: "Ocurrió un error al procesar la solicitud",
        showConfirmButton: true,
        confirmButtonColor: "#f44336",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={handleModalClose} // Usar la nueva función en lugar de handleClose
      aria-labelledby="edit-modal-title"
      aria-describedby="edit-modal-description"
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
            <EditIcon />
            <Typography variant="h6" component="h2" fontWeight="bold">
              Modificación de Socio
            </Typography>
          </Stack>
          <IconButton onClick={handleModalClose} size="small" aria-label="cerrar" sx={{ color: "white" }}>
            <CloseIcon />
          </IconButton>
        </Box>

        <Box sx={{ p: 3 }}>
          <form onSubmit={handleSubmit}>
            <TextField
              label="Nombres"
              name="name"
              value={editedMember.name}
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
              value={editedMember.lastname}
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
              label="Documento"
              name="dni"
              value={editedMember.dni}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
              type="number"
              size="small"
              error={errors.dni}
              helperText={errors.dni ? 
                (errorMessages.dni || "El documento es requerido") : ""}
              InputProps={{ 
                inputProps: { min: 1 },
                endAdornment: checkingDni ? <CircularProgress size={20} /> : null
              }}
              variant="outlined"
              sx={{ mb: 2 }}
            />

            <TextField
              label="Correo electrónico"
              name="email"
              value={editedMember.email}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
              type="email"
              size="small"
              error={errors.email}
              helperText={errors.email ? 
                (errorMessages.email || "El correo es requerido y debe tener un formato válido") : ""}
              variant="outlined"
              sx={{ mb: 0 }}
              InputProps={{ 
                endAdornment: checkingEmail ? <CircularProgress size={20} /> : null
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
}