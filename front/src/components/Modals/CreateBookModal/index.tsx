import { useState, ChangeEvent, FormEvent, useEffect } from "react";
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
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";
import { IBook } from "../../../interfaces/bookInterface";
import { bookService } from "../../../services/bookService";
import CloseIcon from "@mui/icons-material/Close";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";
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
    isbn: 0,
    loanable: true,
    stockInt: 0,
    stockExt: 0,
  };

  const [newBook, setNewBook] = useState<IBook>(initialBookState);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({
    title: false,
    author: false,
    isbn: false,
    stockInt: false,
    stockExt: false,
  });
  const [checkingIsbn, setCheckingIsbn] = useState(false);
  const [isbnError, setIsbnError] = useState("");

  // Add debounce for ISBN check
  useEffect(() => {
    if (newBook.isbn && !isNaN(newBook.isbn) && newBook.isbn.toString().length === 13) {
      const timer = setTimeout(() => {
        checkIsbnAvailability(newBook.isbn);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [newBook.isbn]);

  const checkIsbnAvailability = async (isbn: number) => {
    setCheckingIsbn(true);
    try {
      const response = await bookService.getBookByIsbn(isbn);
      if (response.success) {
        setErrors(prev => ({ ...prev, isbn: true }));
        setIsbnError("Este ISBN ya está registrado");
      } else {
        setIsbnError("");
      }
    } catch (error) {
      console.error("Error checking ISBN:", error);
    } finally {
      setCheckingIsbn(false);
    }
  };

  const resetForm = () => {
    setNewBook(initialBookState);
    setErrors({
      title: false,
      author: false,
      isbn: false,
      stockInt: false,
      stockExt: false,
    });
    setIsbnError("");
  };

  const handleNewBookInputChange = (
    e: ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>
  ) => {
    const { name, value } = e.target;
    
    // Manejo especial para el campo loanable (convertir string a boolean)
    if (name === 'loanable') {
      const isLoanable = value === 'true';
      
      // Si loanable es false, establecer stockExt a 0
      if (!isLoanable) {
        setNewBook({ 
          ...newBook, 
          [name]: isLoanable,
          stockExt: 0 
        });
      } else {
        setNewBook({ ...newBook, [name]: isLoanable });
      }
    } else {
      setNewBook({ ...newBook, [name as string]: value });
    }
    
    // Limpiar el error si el campo está siendo editado
    if (name && errors[name as keyof typeof errors]) {
      setErrors({
        ...errors,
        [name]: false,
      });
      
      // Limpiar el mensaje de error específico para el ISBN
      if (name === 'isbn') {
        setIsbnError("");
      }
    }
  };

  const validateForm = () => {
    const newErrors = {
      title: newBook.title.trim() === "",
      author: newBook.author.trim() === "",
      isbn: newBook.isbn.toString().length !== 13 || isNaN(newBook.isbn) || isbnError !== "",
      stockInt: newBook.stockInt < 0,
      stockExt: newBook.stockExt < 0,
    };
    
    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error);
  };

  const swal = useSweetAlert();
  
  const handleCreateSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    // Chequear si el ISBN ya está en uso
    setLoading(true);
    try {
      if (newBook.isbn) {
        const isbnCheck = await bookService.getBookByIsbn(newBook.isbn);
        if (isbnCheck.success) {
          setErrors(prev => ({ ...prev, isbn: true }));
          setIsbnError("Este ISBN ya está registrado");
          setLoading(false);
          return;
        }
      }

      const response = await bookService.createBook(newBook);
      if (response.success) {
        resetForm();
        handleClose();
        onBookCreated();
        swal.success("El libro fue creado exitosamente");
      } else {
        swal.error("Error al crear el libro");
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
              error={errors.author}
              helperText={errors.author ? "El autor es requerido" : ""}
              variant="outlined"
              sx={{ mb: 2 }}
            />
            
            <TextField
              label="ISBN"
              name="isbn"
              value={newBook.isbn}
              onChange={handleNewBookInputChange}
              fullWidth
              margin="normal"
              size="small"
              error={errors.isbn}
              helperText={errors.isbn ? 
                (isbnError || "El ISBN debe contener exactamente 13 dígitos") : 
                "Debe contener 13 dígitos"}
              variant="outlined"
              sx={{ mb: 2 }}
              InputProps={{ 
                inputMode: 'numeric',
                inputProps: { pattern: '[0-9]*' },
                endAdornment: checkingIsbn ? <CircularProgress size={20} /> : null
              }}
            />
            
            {/* Agregar botones de radio para la opción loanable */}
            <FormControl component="fieldset" sx={{ mb: 2 }}>
              <FormLabel component="legend">Préstamo en domicilio:</FormLabel>
              <RadioGroup
                row
                name="loanable"
                value={newBook.loanable.toString()}
                onChange={handleNewBookInputChange}
              >
                <FormControlLabel 
                  value="true" 
                  control={<Radio />} 
                  label="Habilitado" 
                />
                <FormControlLabel 
                  value="false" 
                  control={<Radio />} 
                  label="Deshabilitado" 
                />
              </RadioGroup>
            </FormControl>
            
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
                disabled={!newBook.loanable}
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