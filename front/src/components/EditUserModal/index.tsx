import { ChangeEvent, FormEvent, useState } from "react";
import { IUser } from "../../interfaces/userInterface";
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
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import EditIcon from "@mui/icons-material/Edit";

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
}

export const UserEditModal = ({
  open,
  onClose,
  user,
  handleInputChange,
  handleSubmit,
}: UserEditModalProps) => {
  const [loading, setLoading] = useState(false);

  const handleFormSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await handleSubmit(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
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
              Modificación de Usuario
            </Typography>
          </Stack>
          <IconButton onClick={onClose} size="small" aria-label="cerrar" sx={{ color: "white" }}>
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
              required
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
              required
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
              required
              variant="outlined"
              sx={{ mb: 2 }}
            />

            <FormControl 
              fullWidth 
              margin="normal" 
              size="small"
              required
              sx={{ mb: 2 }}
            >
              <InputLabel>Rol</InputLabel>
              <Select
                label="Rol"
                name="role"
                value={user.role}
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
            
            <Divider sx={{ my: 3 }} />
            
            <Stack direction="row" spacing={2} justifyContent="flex-end">
              <Button
                variant="outlined"
                color="error"
                onClick={onClose}
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