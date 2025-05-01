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
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import VisibilityIcon from "@mui/icons-material/Visibility";

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

interface ViewUserModalProps {
  open: boolean;
  onClose: () => void;
  user: IUser;
}

export const ViewUserModal = ({
  open,
  onClose,
  user,
}: ViewUserModalProps) => {
  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="view-modal-title"
      aria-describedby="view-modal-description"
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
            <VisibilityIcon />
            <Typography variant="h6" component="h2" fontWeight="bold">
              Detalles de Usuario
            </Typography>
          </Stack>
          <IconButton
            onClick={onClose}
            size="small"
            aria-label="cerrar"
            sx={{ color: "white" }}
          >
            <CloseIcon />
          </IconButton>
        </Box>

        <Box sx={{ p: 3 }}>
          <TextField
            label="Nombres"
            value={user.name || ""}
            fullWidth
            margin="normal"
            size="small"
            variant="outlined"
            InputProps={{ readOnly: true }}
            sx={{ mb: 2 }}
          />

          <TextField
            label="Apellidos"
            value={user.lastname || ""}
            fullWidth
            margin="normal"
            size="small"
            variant="outlined"
            InputProps={{ readOnly: true }}
            sx={{ mb: 2 }}
          />

          <TextField
            label="Usuario"
            value={user.username || ""}
            fullWidth
            margin="normal"
            size="small"
            variant="outlined"
            InputProps={{ readOnly: true }}
            sx={{ mb: 2 }}
          />

          <TextField
            label="Correo electrónico"
            value={user.email || ""}
            fullWidth
            margin="normal"
            size="small"
            variant="outlined"
            InputProps={{ readOnly: true }}
            sx={{ mb: 2 }}
          />

          <TextField
            label="Rol"
            value={user.role === "admin" ? "Administrador" : "Usuario"}
            fullWidth
            margin="normal"
            size="small"
            variant="outlined"
            InputProps={{ readOnly: true }}
            sx={{ mb: 0 }}
          />

          <Divider sx={{ my: 3 }} />

          <Stack direction="row" spacing={2} justifyContent="flex-end">
            <Button
              variant="contained"
              color="primary"
              onClick={onClose}
            >
              Cerrar
            </Button>
          </Stack>
        </Box>
      </Paper>
    </Modal>
  );
};