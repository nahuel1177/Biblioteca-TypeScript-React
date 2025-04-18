import { useState, ChangeEvent, FormEvent } from "react";
import { memberService } from "../../services/memberService";
import {
  Typography,
  TextField,
  Button,
  Stack,
  Modal,
  Box,
  Paper,
  Divider,
  IconButton,
} from "@mui/material";
import Swal from "sweetalert2";
import CloseIcon from "@mui/icons-material/Close";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import { IMember } from "../../interfaces/memberInterface";

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

interface CreateMemberModalProps {
  open: boolean;
  handleClose: () => void;
  onMemberCreated: () => void;
}

export function CreateMemberModal({ open, handleClose, onMemberCreated }: CreateMemberModalProps) {
  const initialMemberState: IMember = {
    _id: "",
    name: "",
    lastname: "",
    email: "",
    dni: 0,
    isSanctioned: false,
  };

  const [newMember, setNewMember] = useState<IMember>(initialMemberState);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({
    name: false,
    lastname: false,
    email: false,
    dni: false,
  });

  const resetForm = () => {
    setNewMember(initialMemberState);
    setErrors({
      name: false,
      lastname: false,
      email: false,
      dni: false,
    });
  };

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>
  ) => {
    const { name, value } = e.target;
    setNewMember({ ...newMember, [name as string]: value });
    
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
      name: !newMember.name || newMember.name.trim() === "",
      lastname: !newMember.lastname || newMember.lastname.trim() === "",
      email: newMember.email?.trim() === "",
      dni: !newMember.dni || newMember.dni <= 0,
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
      const response = await memberService.createMember({
        name: newMember.name || '',
        lastname: newMember.lastname || '',
        email: newMember.email || '',
        dni: newMember.dni || 0,
      });
      if (response.success) {
        resetForm();
        handleClose();
        onMemberCreated();
        Swal.fire({
          position: "center",
          icon: "success",
          title: "¡Éxito!",
          text: "El socio fue creado exitosamente",
          showConfirmButton: true,
          confirmButtonColor: "#4caf50",
        });
      } else {
        Swal.fire({
          position: "center",
          icon: "error",
          title: "Error",
          text: "Error al crear el socio",
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

  const handleCancel = () => {
    resetForm();
    handleClose();
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
              Crear Nuevo Socio
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
              value={newMember.name}
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
              value={newMember.lastname}
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
              label="Documento"
              name="dni"
              value={newMember.dni}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
              type="number"
              size="small"
              required
              error={errors.dni}
              helperText={errors.dni ? "El documento es requerido y debe ser mayor a 0" : ""}
              InputProps={{ inputProps: { min: 1 } }}
              variant="outlined"
              sx={{ mb: 2 }}
            />
            
            <TextField
              label="Correo electrónico"
              name="email"
              value={newMember.email}
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
}