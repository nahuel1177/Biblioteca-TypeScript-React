import { useState, ChangeEvent, FormEvent } from "react";
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
import { IBook } from "../../interfaces/bookInterface";
import { bookService } from "../../services/bookService";
import Swal from "sweetalert2";
import CloseIcon from "@mui/icons-material/Close";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import EditIcon from "@mui/icons-material/Edit";
import { useEffect } from "react";

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

interface EditBookModalProps {
  open: boolean;
  handleClose: () => void;
  book: IBook;
  onBookUpdated: () => void;
}

export function EditBookModal({ open, handleClose, book, onBookUpdated }: EditBookModalProps) {
  const [editedBook, setEditedBook] = useState<IBook>(book);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({
    title: false,
    author: false,
    stockInt: false,
    stockExt: false,
  });

  // Corrección: Usar useEffect para actualizar el estado cuando cambia book
  useEffect(() => {
    setEditedBook(book);
  }, [book]);

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>
  ) => {
    const { name, value } = e.target;
    setEditedBook({ ...editedBook, [name as string]: value });
    
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
      title: editedBook.title.trim() === "",
      author: editedBook.author.trim() === "",
      stockInt: editedBook.stockInt < 0,
      stockExt: editedBook.stockExt < 0,
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
      const response = await bookService.updateBook(editedBook._id, editedBook);
      if (response.success) {
        handleClose();
        onBookUpdated();
        Swal.fire({
          position: "center",
          icon: "success",
          title: "¡Éxito!",
          text: "El libro fue modificado exitosamente",
          showConfirmButton: true,
          confirmButtonColor: "#4caf50",
        });
      } else {
        Swal.fire({
          position: "center",
          icon: "error",
          title: "Error",
          text: "Error al modificar el libro",
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
              Modificación de Libro
            </Typography>
          </Stack>
          <IconButton onClick={handleClose} size="small" aria-label="cerrar" sx={{ color: "white" }}>
            <CloseIcon />
          </IconButton>
        </Box>
        
        <Box sx={{ p: 3 }}>
          <form onSubmit={handleSubmit}>
            <TextField
              label="Título"
              name="title"
              value={editedBook.title}
              onChange={handleInputChange}
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
              value={editedBook.author}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
              size="small"
              required
              error={errors.author}
              helperText={errors.author ? "El autor es requerido" : ""}
              variant="outlined"
              sx={{ mb: 3 }}
            />
            
            <Stack direction="row" spacing={2}>
              <TextField
                label="Stock Interno"
                name="stockInt"
                value={editedBook.stockInt}
                onChange={handleInputChange}
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
                value={editedBook.stockExt}
                onChange={handleInputChange}
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