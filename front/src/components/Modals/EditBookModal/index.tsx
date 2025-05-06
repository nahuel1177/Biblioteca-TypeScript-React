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
import { IBook } from "../../../interfaces/bookInterface";
import { bookService } from "../../../services/bookService";
import CloseIcon from "@mui/icons-material/Close";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import EditIcon from "@mui/icons-material/Edit";
import { useEffect } from "react";
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
  const swal = useSweetAlert();

  // Corrección: Usar useEffect para actualizar el estado cuando cambia book
  useEffect(() => {
    setEditedBook(book);
  }, [book]);

  // Función para manejar el cierre del modal y limpiar el formulario
  const handleModalClose = () => {
    // Restablecer todos los estados a sus valores iniciales
    setEditedBook(book);
    setLoading(false);
    setErrors({
      title: false,
      author: false,
      stockInt: false,
      stockExt: false,
    });
    
    // Llamar a la función handleClose proporcionada por el componente padre
    handleClose();
  };

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
        swal.success("El libro fue modificado exitosamente");
      } else {
        swal.error("Error al modificar el libro");
      }
    } catch (error) {
      swal.error("Ocurrió un error al procesar la solicitud");
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
              Modificación de Libro
            </Typography>
          </Stack>
          <IconButton onClick={handleModalClose} size="small" aria-label="cerrar" sx={{ color: "white" }}>
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
              error={errors.author}
              helperText={errors.author ? "El autor es requerido" : ""}
              variant="outlined"
              sx={{ mb: 4 }}
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