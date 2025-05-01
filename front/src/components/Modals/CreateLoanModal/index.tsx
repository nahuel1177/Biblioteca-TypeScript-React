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
  const [members, setMembers] = useState<IMember[]>([]);
  const [books, setBooks] = useState<IBook[]>([]);
  const [loading, setLoading] = useState(false);

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
      const membersResponse = await memberService.getMembers();
      if (membersResponse.success) {
        setMembers(membersResponse.result);
      }

      const booksResponse = await bookService.getBooks();
      if (booksResponse.success) {
        setBooks(booksResponse.result);
      }
    };

    if (open) {
      fetchData();
    }
  }, [open]);

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
      memberId: formData.memberId.trim() === "",
      bookId: formData.bookId.trim() === "",
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
      // Check if member is sanctioned
      const selectedMember = members.find(
        (member) => member._id === formData.memberId
      );
      if (selectedMember?.isSanctioned) {
        Swal.fire({
          position: "center",
          icon: "error",
          title: "Error",
          text: "El socio se encuentra sancionado y no puede solicitar préstamos",
          showConfirmButton: true,
          confirmButtonColor: "#f44336",
        });
        return;
      }

      // Check book stock based on loan type
      const selectedBook = books.find((book) => book._id === formData.bookId);
      if (formData.type === "internal" && selectedBook?.stockInt === 0) {
        Swal.fire({
          position: "center",
          icon: "error",
          title: "Error",
          text: "No hay stock interno disponible para este libro",
          showConfirmButton: true,
          confirmButtonColor: "#f44336",
        });
        return;
      } else if (formData.type === "external" && selectedBook?.stockExt === 0) {
        Swal.fire({
          position: "center",
          icon: "error",
          title: "Error",
          text: "No hay stock externo disponible para este libro",
          showConfirmButton: true,
          confirmButtonColor: "#f44336",
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
        Swal.fire({
          position: "center",
          icon: "success",
          title: "¡Éxito!",
          text: "El préstamo fue creado exitosamente",
          showConfirmButton: true,
          confirmButtonColor: "#4caf50",
        });
      } else {
        Swal.fire({
          position: "center",
          icon: "error",
          title: "Error",
          text: "Error al crear el préstamo",
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
                  `${option.title} - ${option.author} `
                }
                getOptionDisabled={(option) =>
                  option.stockInt === 0 && option.stockExt === 0
                }
                onChange={(_, newValue) => {
                  setFormData({
                    ...formData,
                    bookId: newValue?._id || "",
                  });
                  if (errors.bookId) {
                    setErrors({
                      ...errors,
                      bookId: false,
                    });
                  }
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Libro"
                    error={errors.bookId}
                    helperText={errors.bookId ? "El libro es requerido" : ""}
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
              error={errors.type}
              sx={{ mb: 0 }}
            >
              <InputLabel>Tipo de Préstamo</InputLabel>
              <Select
                label="Tipo de Préstamo"
                name="type"
                value={formData.type}
                onChange={(e) =>
                  handleInputChange(
                    e as ChangeEvent<{ name?: string; value: unknown }>
                  )
                }
              >
                <MenuItem value="internal">Interno</MenuItem>
                <MenuItem value="external">Externo</MenuItem>
              </Select>
              {errors.type && (
                <FormHelperText>
                  El tipo de préstamo es requerido
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
