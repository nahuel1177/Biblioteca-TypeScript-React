import { ChangeEvent, FormEvent } from "react";
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
  Container,
  Box,
  Modal,
} from "@mui/material";

const style = {
  position: "absolute",
  top: "40%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
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
  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      disableEscapeKeyDown
      disableAutoFocus
      disableEnforceFocus
      BackdropProps={{
        sx: {
          backgroundColor: "rgba(0, 0, 0, 0.7)",
        },
      }}
    >
      <Box
        sx={{
          ...style,
          zIndex: 1300,
        }}
      >
        <Container maxWidth="xs">
          <Typography variant="h6" gutterBottom marginTop={2}>
            Modificación de Usuario
          </Typography>
          <form onSubmit={handleSubmit}>
            <TextField
              label="Nombres"
              name="name"
              value={user.name}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
              size="small"
            />
            <TextField
              label="Apellidos"
              name="lastname"
              value={user.lastname}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
              size="small"
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
            />

            <FormControl fullWidth margin="normal" size="small">
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
            <Stack direction="row" spacing={2} style={{ marginTop: "20px" }}>
              <Button
                type="submit"
                variant="contained"
                color="success"
                onClick={handleSubmit}
              >
                <Typography fontSize={13}>Modificar</Typography>
              </Button>
              <Button variant="contained" color="error" onClick={onClose}>
                <Typography fontSize={13}>Cancelar</Typography>
              </Button>
            </Stack>
          </form>
        </Container>
      </Box>
    </Modal>
  );
};