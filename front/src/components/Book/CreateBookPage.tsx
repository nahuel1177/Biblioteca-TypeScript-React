import React, { useState, ChangeEvent, FormEvent } from "react";
import {
  TextField,
  Button,
  //FormControl,
  //InputLabel,
  //Select,
  //MenuItem,
  Container,
  Stack,
  Typography,
} from "@mui/material";
import { bookService } from "../../services/bookService";
import { useNavigate } from "react-router-dom";
import { ICreateBook } from "../../interfaces/bookInterface";
import Swal from "sweetalert2";
//import { Add } from "@mui/icons-material";

// Componente principal
export const CreateBookPage: React.FC = () => {
  const navigate = useNavigate();

  // Estado inicial del formulario
  const initialBookState: ICreateBook = {
    title: "",
    author: "",
    stockInt: 0,
    stockExt: 0,
    // Aquí podrías establecer un valor por defecto si lo deseas
  };

  // Estado del formulario
  const [book, setBook] = useState<ICreateBook>(initialBookState);

  // Manejar cambios en los campos del formulario
  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>
  ) => {
    const { name, value } = e.target;
    setBook({ ...book, [name as string]: value });
  };

  // Manejar envío del formulario
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    // Aquí podrías enviar los datos del usuario al servidor o realizar otras acciones según tus necesidades
    if (book.stockExt >= 0 && book.stockInt >= 0 && (book.title != "") && (book.author != "")) {
      const bookFinded = await bookService.getBookByTitle(book.title)
      if (!bookFinded.success) {
      bookService.createBook(book);
      Swal.fire({
        position: "center",
        icon: "success",
        text: "El libro fue dado de alta",
        showConfirmButton: true,
      });
      // Puedes reiniciar el formulario después de enviar los datos
      setBook(initialBookState);
    }else {
      Swal.fire({
        position: "center",
        icon: "error",
        text: "El libro ya existe.",
        showConfirmButton: true,
      });
    }}
    else{
      Swal.fire({
        position: "center",
        icon: "error",
        text: "Datos faltantes o inválidos",
        showConfirmButton: true,
      });
    }
  };

  const handleHome = async () => {
    navigate("/libros");
  };

  return (
    <Stack>
      <Container maxWidth="xs">
        <Typography variant="h6" gutterBottom marginTop={2}>
          Alta de Libro
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Título"
            name="title"
            value={book.title}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
            size="small"
          />
          <TextField
            label="Autor"
            name="author"
            value={book.author}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
            size="small"
          />
          <TextField
            label="Ejemplares Internos"
            name="stockInt"
            value={book.stockInt}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
            size="small"
          />
          <TextField
            label="Ejemplares Externos"
            name="stockExt"
            value={book.stockExt}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
            size="small"
          />
          <Stack direction="row" spacing={2} style={{ marginTop: "20px" }}>
            <Button type="submit" variant="contained" color="success">
              <Typography fontSize={13}>Crear</Typography>
            </Button>
            <Button variant="contained" color="error" onClick={handleHome}>
              <Typography fontSize={13}>Cancelar</Typography>
            </Button>
          </Stack>
        </form>
      </Container>
    </Stack>
  );
};
