import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Stack,
  //Autocomplete,
  TextField,
  Fab,
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

import Add from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { useNavigate } from "react-router-dom";
import { IBook } from "../../interfaces/bookInterface";
import { bookService } from "../../services/bookService";
import Swal from "sweetalert2";
import { SearchBar } from "../SearchBar";

export function Book() {
  const [books, setBooks] = useState<IBook[]>([]);
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredBooks, setFilteredBooks] = useState<IBook[]>([]);
  //const [stock, setStock] = useState(Number);
  // const [error, setError] = useState({
  //   error: false,
  //   message: "",
  // });


  useEffect(() => {
    console.log("Fetch");
    const fetchData = async () => {
      const response = await bookService.getBooks();
      if(response.success){
        setBooks(response.result);
      } 
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (searchTerm === "") {
      setFilteredBooks([]);
    }
  }, [searchTerm]);

  const onCLickCreate = async () => {
    navigate("/crear-libro");
  };

  const initialBookState: IBook = {
    _id: "",
    title: "",
    author: "",
    stockInt: 0,
    stockExt: 0,
    // Aquí podrías establecer un valor por defecto si lo deseas
  };

  const [book, setBook] = useState<IBook>(initialBookState);

  async function onClickUpdate(book: IBook) {
    try {
      setBook(book);
      handleOpen();
    } catch (error) {
      Swal.fire({
        position: "center",
        icon: "error",
        text: "El libro no existe",
        showConfirmButton: false,
        timer: 2000,
      });
    }
  }

  const onClickDelete = async (id: string | undefined) => {
    try {
      if (!id) {
        return Swal.fire({
          position: "center",
          icon: "error",
          text: "El libro no existe",
          showConfirmButton: false,
          timer: 2000,
        });
      }
      const response = await bookService.deleteBook(id);
      if (response.success) {
        const response = await bookService.getBooks();
        setBooks(response.result);
        return Swal.fire({
          position: "center",
          icon: "success",
          text: "El libro fue eliminado",
          showConfirmButton: false,
          timer: 2000,
        });
      }
    } catch (error) {
      Swal.fire({
        position: "center",
        icon: "error",
        text: "El libro no existe",
        showConfirmButton: false,
        timer: 2000,
      });
    }
  };

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>
  ) => {
    const { name, value } = e.target;
    setBook({ ...book, [name as string]: value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    // Se envía los datos del usuario al servidor o realizar otras acciones según necesidades
   
    if (book.stockExt >= 0 && book.stockInt >= 0 && (book.title != "") && (book.author != "")) {
      bookService.updateBook(book._id, book);
      const response = await bookService.getBooks();
      setBooks(response.result);
      // Se reinicia el formulario después de enviar los datos
      setBook(initialBookState);
      handleClose();
      Swal.fire({
        position: "center",
        icon: "success",
        text: "El libro fue modificado",
        showConfirmButton: true,
      });
    
  }else{
    handleClose();
    Swal.fire({
      position: "center",
      icon: "error",
      text: "Datos faltantes o inválidos",
      showConfirmButton: true,
    });
  }
}

const onClickSearch = () => {
  const filtered = books.filter(book => 
    `${book.title}`.toLowerCase().includes(searchTerm.toLowerCase()))

  setFilteredBooks(filtered);
};

  return (
    <Stack>
      <Container>
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
          sx={style}
        >
          <Container maxWidth="xs">
            <Typography variant="h6" gutterBottom marginTop={2}>
              Modificación de Libro
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
                label="Stock Interno"
                name="stockInt"
                value={book.stockInt}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
                type="number"
                size="small"
                // helperText={error.message}
                // error={error.error}
              />
              <TextField
                label="Stock Externo"
                name="stockExt"
                value={book.stockExt}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
                type="number"
                size="small"
              />
              <Stack direction="row" spacing={2} style={{ marginTop: "20px" }}>
                <Button
                  type="submit"
                  variant="contained"
                  color="success"
                  onClick={handleSubmit}
                >
                  <Typography fontSize={13}>Modificar</Typography>
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  onClick={handleClose}
                >
                  <Typography fontSize={13}>Cancelar</Typography>
                </Button>
              </Stack>
            </form>
          </Container>
        </Modal>

        <Card style={{ marginTop: "20px", marginBottom: "15px" }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Libros
            </Typography>
            <Stack 
              direction="row" 
              spacing={2} 
              style={{ marginTop: "20px" }}
              justifyContent="space-between"
              alignItems="center"
            >
              <Fab
                color="success"
                onClick={() => onCLickCreate()}
                size="small"
              >
                <Add />
              </Fab>
              <SearchBar
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                onSearch={onClickSearch}
                placeholder="Buscar usuario..."
              />
            </Stack>
          </CardContent>
        </Card>
        <Grid container spacing={2}>
          {(filteredBooks.length > 0 ? filteredBooks : books)?.map((book, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card style={{ marginTop: "5px" }}>
                <CardContent>
                  <Typography component="div">
                    {book.title}
                  </Typography>

                  <Typography variant="body2" color="text.secondary">
                    Autor: {book.author}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Stock Interno: {book.stockInt}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Stock Externo: {book.stockExt}
                  </Typography>
                  <Stack
                    direction="row"
                    spacing={2}
                    style={{ marginTop: "20px" }}
                  >
                    <Fab
                      size="small"
                      color="primary"
                      aria-label="edit"
                      onClick={() => onClickUpdate(book)}
                    >
                      <EditIcon />
                    </Fab>
                    <Fab
                      size="small"
                      color="error"
                      aria-label="edit"
                      onClick={() => onClickDelete(book._id)}
                    >
                      <DeleteIcon />
                    </Fab>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Stack>
  );
}
