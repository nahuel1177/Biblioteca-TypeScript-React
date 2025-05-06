import { useState, useEffect, ChangeEvent, FormEvent } from "react";
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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Autocomplete,
  CircularProgress,
} from "@mui/material";

import Swal from "sweetalert2";
import CloseIcon from "@mui/icons-material/Close";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import LibraryAddIcon from "@mui/icons-material/LibraryAdd";
import { IMember } from "../../../interfaces/memberInterface";
import { IBook } from "../../../interfaces/bookInterface";
import { memberService } from "../../../services/memberService";
import { bookService } from "../../../services/bookService";
import { loanService } from "../../../services/loanService";
import { useTheme } from "@mui/material/styles";

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

interface CreateLoanModalProps {
  open: boolean;
  handleClose: () => void;
  onLoanCreated: () => void;
}

export function CreateLoanModal({
  open,
  handleClose,
  onLoanCreated,
}: CreateLoanModalProps) {
  const theme = useTheme(); // Obtener el tema actual
  const [members, setMembers] = useState<IMember[]>([]);
  const [books, setBooks] = useState<IBook[]>([]);
  const [loading, setLoading] = useState(false);
  const [bookError, setBookError] = useState("");
  const [checkingDuplicateLoan, setCheckingDuplicateLoan] = useState(false);

  // Función de utilidad para mostrar alertas con el tema actual
const showAlert = (
  icon: 'success' | 'error' | 'warning' | 'info' | 'question',
  text: string,
  options: unknown = {}
  ) => {
  return Swal.fire({
  icon,
  text,
  background: theme.palette.background.paper,
  color: theme.palette.text.primary,
  confirmButtonColor: 
  icon === 'success' ? theme.palette.success.main : 
  icon === 'error' ? theme.palette.error.main : 
  theme.palette.primary.main,
...(options as Record<string, unknown>)
  });
  };

  const [formData, setFormData] = useState({
    memberId: "",
    bookId: "",
    type: "",
  });

  const [errors, setErrors] = useState({
    memberId: false,
    bookId: false,
    type: false,
  });

  useEffect(() => {
    const fetchData = async () => {
      try{
        const membersResponse = await memberService.getMembers();
        if (membersResponse.success) {
          setMembers(membersResponse.result);
        }
      }catch(error){
        showAlert('error', "Error al cargar los socios", {
          position: "center",
          title: "Error",
          showConfirmButton: true,
        });
      }
      try{
        const booksResponse = await bookService.getBooks();
        if (booksResponse.success) {
          setBooks(booksResponse.result);
        }
      }catch(error){
        showAlert('error', "Error al cargar los libros", {
          position: "center",
          title: "Error",
          showConfirmButton: true,
        });
      }
    };

    if (open) {
      fetchData();
    }
  }, [open]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (formData.memberId && formData.bookId) {
        checkDuplicateLoan(formData.memberId, formData.bookId);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [formData.memberId, formData.bookId]);

  const checkDuplicateLoan = async (memberId: string, bookId: string) => {
    setCheckingDuplicateLoan(true);
    try {
      const loansResponse = await loanService.getLoans();
      if (loansResponse.success) {
        const activeLoans = loansResponse.result.filter(loan => loan.isActive);
        const hasDuplicateLoan = activeLoans.some(
          loan => loan.memberId === memberId && loan.bookId === bookId
        );
        
        if (hasDuplicateLoan) {
          setBookError("Este socio ya tiene un préstamo activo de este libro");
          setErrors(prev => ({ ...prev, bookId: true }));
        } else {
          setBookError("");
          setErrors(prev => ({ ...prev, bookId: false }));
        }
      }
    } catch (error) {
      showAlert('error', "Error al verificar préstamos duplicados", {
        position: "center",
        title: "Error",
        showConfirmButton: true,
      });
    } finally {
      setCheckingDuplicateLoan(false);
    }
  };

  const resetForm = () => {
    setFormData({
      memberId: "",
      bookId: "",
      type: "",
    });
    setErrors({
      memberId: false,
      bookId: false,
      type: false,
    });
  };

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name as string]: value });

    // Limpiar error mientras se está escribiendo
    if (name && errors[name as keyof typeof errors]) {
      setErrors({
        ...errors,
        [name]: false,
      });
    }
  };

  const validateForm = () => {
    const newErrors = {
      memberId: formData.memberId.trim() === "",
      bookId: formData.bookId.trim() === "" || Boolean(bookError),
      type: formData.type.trim() === "",
    };

    setErrors(newErrors);
    return !Object.values(newErrors).some((error) => error);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      // Cjhequear si el socio está sancionado
      const selectedMember = members.find(
        (member) => member._id === formData.memberId
      );
      if (selectedMember?.isSanctioned) {
        showAlert('error', "El socio se encuentra sancionado y no puede solicitar préstamos", {
          position: "center",
          title: "Error",
          showConfirmButton: true,
        });
        return;
      }

      // Cequear si el libro está disponible para el tipo de préstamo seleccionado
      const selectedBook = books.find((book) => book._id === formData.bookId);
      
      // Validar si el libro no es prestable (loanable = false) y se intenta hacer un préstamo externo
      if (formData.type === "external" && selectedBook && selectedBook.loanable === false) {
        showAlert('error', "Este libro no puede ser prestado externamente, solo está disponible para préstamos internos", {
          position: "center",
          title: "Error",
          showConfirmButton: true,
        });
        return;
      }
      
      if (formData.type === "internal" && selectedBook?.stockInt === 0) {
        showAlert('error', "No hay stock disponible para este libro", {
          position: "center",
          title: "Error",
          showConfirmButton: true,
        });
        return;
      } else if (formData.type === "external" && selectedBook?.stockExt === 0) {
        showAlert('error', "No hay stock disponible para este libro", {
          position: "center",
          title: "Error",
          showConfirmButton: true,
        });
        return;
      }

      // Create loan
      const loanData = {
        memberId: formData.memberId,
        bookId: formData.bookId,
        type: formData.type,
      };

      const response = await loanService.createLoan(loanData);
      if (response.success) {
        resetForm();
        handleClose();
        onLoanCreated();
        showAlert('success', "El préstamo fue creado exitosamente", {
          position: "center",
          title: "¡Éxito!",
          showConfirmButton: true,
        });
      } else {
        showAlert('error', "Error al crear el préstamo", {
          position: "center",
          title: "Error",
          showConfirmButton: true,
        });
      }
    } catch (error) {
      showAlert('error', "Ocurrió un error al procesar la solicitud", {
        position: "center",
        title: "Error",
        showConfirmButton: true,
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
            <LibraryAddIcon />
            <Typography variant="h6" component="h2" fontWeight="bold">
              Crear Nuevo Préstamo
            </Typography>
          </Stack>
          <IconButton
            onClick={handleCancel}
            size="small"
            aria-label="cerrar"
            sx={{ color: "white" }}
          >
            <CloseIcon />
          </IconButton>
        </Box>

        <Box sx={{ p: 3 }}>
          <form onSubmit={handleSubmit}>
            <FormControl
              fullWidth
              margin="normal"
              size="small"
              required
              error={errors.memberId}
              sx={{ mb: 2 }}
            >
              <Autocomplete
                id="member-select"
                options={members}
                getOptionLabel={(option) =>
                  `${option.name} ${option.lastname}${
                    option.isSanctioned ? " (Sancionado)" : ""
                  }`
                }
                getOptionDisabled={(option) => Boolean(option.isSanctioned)}
                onChange={(_, newValue) => {
                  setFormData({
                    ...formData,
                    memberId: newValue?._id || "",
                  });
                  if (errors.memberId) {
                    setErrors({
                      ...errors,
                      memberId: false,
                    });
                  }
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Socio"
                    error={errors.memberId}
                    helperText={errors.memberId ? "El socio es requerido" : ""}
                    size="small"
                  />
                )}
                isOptionEqualToValue={(option, value) =>
                  option._id === value._id
                }
              />
            </FormControl>

            <FormControl
              fullWidth
              margin="normal"
              size="small"
              required
              error={errors.bookId}
              sx={{ mb: 2 }}
            >
              <Autocomplete
                id="book-select"
                options={books}
                getOptionLabel={(option) =>
                  `${option.title} - ${option.author}`
                }
                getOptionDisabled={(option: IBook): boolean => {
                  // Disable if no stock
                  const noStock = option.stockInt === 0 && option.stockExt === 0;
                  return Boolean(noStock);
                }}
                onChange={(_, newValue) => {
                  setFormData({
                    ...formData,
                    bookId: newValue?._id || "",
                  });
                  
                  // The actual check will be done in the useEffect with debounce
                  if (newValue && formData.memberId) {
                    setCheckingDuplicateLoan(true);
                  } else if (errors.bookId) {
                    setErrors({
                      ...errors,
                      bookId: false,
                    });
                    setBookError("");
                  }
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Libro"
                    error={errors.bookId}
                    helperText={errors.bookId ? (bookError || "El libro es requerido") : 
                      (formData.bookId && books.find(book => book._id === formData.bookId)?.loanable === false ? 
                      "El libro elegido solo permite préstamos internos" : "")}
                    size="small"
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <>
                          {checkingDuplicateLoan ? (
                            <CircularProgress color="inherit" size={20} />
                          ) : null}
                          {params.InputProps.endAdornment}
                        </>
                      ),
                    }}
                  />
                )}
                isOptionEqualToValue={(option, value) =>
                  option._id === value._id
                }
                
              />
            </FormControl>

            <FormControl
              fullWidth
              margin="normal"
              size="small"
              error={errors.type}
              sx={{ mb: 0 }}
            >
              <InputLabel>Tipo de Préstamo</InputLabel>
              <Select
                label="Tipo de Préstamo"
                name="type"
                value={formData.type}
                onChange={(e) => {
                  const newValue = e.target.value as string;
                  
                  // Validar si se selecciona préstamo externo para un libro que no es prestable
                  if (newValue === "external" && books.find(book => book._id === formData.bookId)?.loanable === false) {
                    setErrors({
                      ...errors,
                      type: true
                    });
                  } else {
                    handleInputChange(
                      e as ChangeEvent<{ name?: string; value: unknown }>
                    );
                  }
                }}
                disabled={!formData.bookId} // Deshabilitar hasta que se seleccione un libro
              >
                <MenuItem value="internal">Interno</MenuItem>
                <MenuItem 
                  value="external" 
                  disabled={books.find(book => book._id === formData.bookId)?.loanable === false}
                >
                  Externo
                </MenuItem>
              </Select>
              {errors.type && (
                <FormHelperText error>
                  {formData.type === "external" && books.find(book => book._id === formData.bookId)?.loanable === false 
                    ? "Este libro no permite préstamos externos" 
                    : "El tipo de préstamo es requerido"}
                </FormHelperText>
              )}
            </FormControl>

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
