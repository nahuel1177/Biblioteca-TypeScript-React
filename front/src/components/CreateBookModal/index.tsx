import { useState, ChangeEvent, FormEvent } from "react";
import {
  Container,
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
import { IBook } from "../../interfaces/bookInterface";
import { bookService } from "../../services/bookService";
import Swal from "sweetalert2";
import CloseIcon from "@mui/icons-material/Close";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";

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

interface CreateBookModalProps {
  open: boolean;
  handleClose: () => void;
  onBookCreated: () => void;
}

export function CreateBookModal({ open, handleClose, onBookCreated }: CreateBookModalProps) {
  const initialBookState: IBook = {
    _id: "",
    title: "",
    author: "",
    stockInt: 0,
    stockExt: 0,
  };

  const [newBook, setNewBook] = useState<IBook>(initialBookState);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({
    title: false,
    author: false,
    stockInt: false,
    stockExt: false,
  });

  const resetForm = () => {
    setNewBook(initialBookState);
    setErrors({
      title: false,
      author: false,
      stockInt: false,
      stockExt: false,
    });
  };

  const handleNewBookInputChange = (
    e: ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>
  ) => {
    const { name, value } = e.target;
    setNewBook({ ...newBook, [name as string]: value });
    
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
      title: newBook.title.trim() === "",
      author: newBook.author.trim() === "",
      stockInt: newBook.stockInt < 0,
      stockExt: newBook.stockExt < 0,
    };
    
    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error);
  };

  const handleCreateSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const response = await bookService.createBook(newBook);
      if (response.success) {
        resetForm();
        handleClose();
        onBookCreated();
        Swal.fire({
          position: "center",
          icon: "success",
          title: "¡Éxito!",
          text: "El libro fue creado exitosamente",
          showConfirmButton: true,
          confirmButtonColor: "#4caf50",
        });
      } else {
        Swal.fire({
          position: "center",
          icon: "error",
          title: "Error",
          text: "Error al crear el libro",
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
            <LibraryBooksIcon />
            <Typography variant="h6" component="h2" fontWeight="bold">
              Crear Nuevo Libro
            </Typography>
          </Stack>
          <IconButton onClick={handleCancel} size="small" aria-label="cerrar" sx={{ color: "white" }}>
            <CloseIcon />
          </IconButton>
        </Box>
        
        <Box sx={{ p: 3 }}>
          <form onSubmit={handleCreateSubmit}>
            <TextField
              label="Título"
              name="title"
              value={newBook.title}
              onChange={handleNewBookInputChange}
              fullWidth
              margin="normal"
              size="small"
              required
              error={errors.title}
              helperText={errors.title ? "El título es requerido" : ""}
              autoFocus
              variant="outlined"
              sx={{ mb: 2 }}
            />
            
            <TextField
              label="Autor"
              name="author"
              value={newBook.author}
              onChange={handleNewBookInputChange}
              fullWidth
              margin="normal"
              size="small"
              required
              error={errors.author}
              helperText={errors.author ? "El autor es requerido" : ""}
              variant="outlined"
              sx={{ mb: 2 }}
            />
            
            <Stack direction="row" spacing={2}>
              <TextField
                label="Stock Interno"
                name="stockInt"
                value={newBook.stockInt}
                onChange={handleNewBookInputChange}
                fullWidth
                type="number"
                size="small"
                required
                error={errors.stockInt}
                helperText={errors.stockInt ? "El valor debe ser mayor o igual a 0" : ""}
                InputProps={{ inputProps: { min: 0 } }}
                variant="outlined"
              />
              
              <TextField
                label="Stock Externo"
                name="stockExt"
                value={newBook.stockExt}
                onChange={handleNewBookInputChange}
                fullWidth
                type="number"
                size="small"
                required
                error={errors.stockExt}
                helperText={errors.stockExt ? "El valor debe ser mayor o igual a 0" : ""}
                InputProps={{ inputProps: { min: 0 } }}
                variant="outlined"
              />
            </Stack>
            
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