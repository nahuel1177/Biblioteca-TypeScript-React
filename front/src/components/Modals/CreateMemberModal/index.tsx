import { useState, ChangeEvent, FormEvent, useEffect } from "react";
import { memberService } from "../../../services/memberService";
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
  CircularProgress,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import { IMember } from "../../../interfaces/memberInterface";
import { useSweetAlert } from "../../../hooks/useSweetAlert";

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
  const [checkingDni, setCheckingDni] = useState(false);
  const [checkingEmail, setCheckingEmail] = useState(false);
  const [errors, setErrors] = useState({
    name: false,
    lastname: false,
    email: false,
    dni: false,
  });
  const [errorMessages, setErrorMessages] = useState({
    email: "",
    dni: "",
  });

  const swal = useSweetAlert();

  // Add debounce for DNI and email checks
  useEffect(() => {
    if (newMember.dni && newMember.dni > 0) {
      const timer = setTimeout(() => {
        checkDniAvailability(newMember.dni);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [newMember.dni]);

  useEffect(() => {
    if (newMember.email && newMember.email.trim() !== "") {
      const timer = setTimeout(() => {
        checkEmailAvailability(newMember.email || '');
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [newMember.email]);

  const checkDniAvailability = async (dni: number) => {
    setCheckingDni(true);
    try {
      const response = await memberService.getMemberByDni(dni);
      if (response.success) {
        setErrors(prev => ({ ...prev, dni: true }));
        setErrorMessages(prev => ({ ...prev, dni: "Este DNI ya está registrado" }));
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
      }
    } catch (error) {
      console.error("Error checking email:", error);
    } finally {
      setCheckingEmail(false);
    }
  };

  const resetForm = () => {
    setNewMember(initialMemberState);
    setErrors({
      name: false,
      lastname: false,
      email: false,
      dni: false,
    });
    setErrorMessages({
      email: "",
      dni: "",
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
      
      // Clear error messages for email and dni
      if (name === 'email' || name === 'dni') {
        setErrorMessages(prev => ({
          ...prev,
          [name]: "",
        }));
      }
    }
  };

  const validateForm = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isEmailValid = newMember.email ? emailRegex.test(newMember.email) : false;
    
    const newErrors = {
      name: !newMember.name || newMember.name.trim() === "",
      lastname: !newMember.lastname || newMember.lastname.trim() === "",
      email: !newMember.email || newMember.email.trim() === "" || !isEmailValid || (errorMessages.email !== ""),
      dni: !newMember.dni || newMember.dni <= 0 || (errorMessages.dni !== ""),
    };
    
    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    // Final check for DNI and email availability before submission
    setLoading(true);
    try {
      const dniCheck = await memberService.getMemberByDni(newMember.dni || 0);
      const emailCheck = await memberService.getMemberByMail(newMember.email || '');
      
      if (dniCheck.success) {
        setErrors(prev => ({ ...prev, dni: true }));
        setErrorMessages(prev => ({ ...prev, dni: "Este DNI ya está registrado" }));
        setLoading(false);
        return;
      }
      
      if (emailCheck.success) {
        setErrors(prev => ({ ...prev, email: true }));
        setErrorMessages(prev => ({ ...prev, email: "Este correo electrónico ya está registrado" }));
        setLoading(false);
        return;
      }

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
        swal.success("El socio fue creado exitosamente");
      } else {
        swal.error("Error al crear el socio");
      }
    } catch (error) {
      swal.error("Ocurrió un error al procesar la solicitud");
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
              error={errors.dni}
              helperText={errors.dni ? 
                (errorMessages.dni || "El documento es requerido") : ""}
              InputProps={{ 
                endAdornment: checkingDni ? <CircularProgress size={20} /> : null
              }}
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
              error={errors.email}
              helperText={errors.email ? 
                (errorMessages.email || "El correo es requerido y debe tener un formato válido") : ""}
              InputProps={{ 
                endAdornment: checkingEmail ? <CircularProgress size={20} /> : null
              }}
              variant="outlined"
              sx={{ mb: 0 }}
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