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
import EditIcon from "@mui/icons-material/Edit";
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

interface EditMemberModalProps {
  open: boolean;
  handleClose: () => void;
  member: IMember;
  onMemberUpdated: () => void;
}

export function EditMemberModal({ open, handleClose, member, onMemberUpdated }: EditMemberModalProps) {
  const [editedMember, setEditedMember] = useState<IMember>(member);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({
    name: false,
    lastname: false,
    email: false,
    dni: false,
  });

  // Update local state when the member prop changes
  useState(() => {
    setEditedMember(member);
  });

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>
  ) => {
    const { name, value } = e.target;
    setEditedMember({ ...editedMember, [name as string]: value });
    
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
      name: !editedMember.name || editedMember.name.trim() === "",
      lastname: !editedMember.lastname || editedMember.lastname.trim() === "",
      email: editedMember.email?.trim() === "",
      dni: !editedMember.dni || editedMember.dni <= 0,
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
      onClose={handleClose}
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
          <IconButton onClick={handleClose} size="small" aria-label="cerrar" sx={{ color: "white" }}>
            <CloseIcon />
          </IconButton>
        </Box>
        
        <Box sx={{ p: 3 }}>
          <form onSubmit={handleSubmit}>
            <TextField
              label="Nombres"
              name="name"
              value={member.name}
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
              value={member.lastname}
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
              value={member.dni}
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
              value={member.email}
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
                onClick={handleClose}
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