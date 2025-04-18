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
} from "@mui/material";

import Add from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { useNavigate } from "react-router-dom";
import { IBook } from "../../interfaces/bookInterface";
import { bookService } from "../../services/bookService";
import Swal from "sweetalert2";
import { SearchBar } from "../SearchBar";
import { CreateBookModal } from "../CreateBookModal";
import { EditBookModal } from "../EditBookModal";

export function Book() {
  const [books, setBooks] = useState<IBook[]>([]);
  const navigate = useNavigate();
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const handleOpenEditModal = () => setOpenEditModal(true);
  const handleCloseEditModal = () => setOpenEditModal(false);
  const handleOpenCreateModal = () => setOpenCreateModal(true);
  const handleCloseCreateModal = () => setOpenCreateModal(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredBooks, setFilteredBooks] = useState<IBook[]>([]);

  useEffect(() => {
    console.log("Fetch");
    const fetchData = async () => {
      const response = await bookService.getBooks();
      if (response.success) {
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
    handleOpenCreateModal();
  };

  const initialBookState: IBook = {
    _id: "",
    title: "",
    author: "",
    stockInt: 0,
    stockExt: 0,
  };

  const [selectedBook, setSelectedBook] = useState<IBook>(initialBookState);

  async function onClickUpdate(book: IBook) {
    try {
      setSelectedBook(book);
      handleOpenEditModal();
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
      
      // Add confirmation dialog before deleting
      const result = await Swal.fire({
        text: '¿Estás seguro que desea eliminar?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Eliminar',
        cancelButtonText: 'Cancelar'
      });
      
      // Only proceed with deletion if user confirmed
      if (result.isConfirmed) {
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

  const onClickSearch = () => {
    const filtered = books.filter(
      (book) =>
        `${book.title}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        `${book.author}`.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredBooks(filtered);
  };

  const refreshBooks = async () => {
    const response = await bookService.getBooks();
    if (response.success) {
      setBooks(response.result);
    }
  };

  return (
    <Stack>
      <Container>
        <EditBookModal 
          open={openEditModal} 
          handleClose={handleCloseEditModal} 
          book={selectedBook}
          onBookUpdated={refreshBooks}
        />

        <CreateBookModal 
          open={openCreateModal} 
          handleClose={handleCloseCreateModal} 
          onBookCreated={refreshBooks}
        />

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
              <Fab color="success" onClick={() => onCLickCreate()} size="small">
                <Add />
              </Fab>
              <SearchBar
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                onSearch={onClickSearch}
                placeholder="Buscar por título o autor..."
              />
            </Stack>
          </CardContent>
        </Card>
        <Grid container spacing={2}>
          {(filteredBooks.length > 0 ? filteredBooks : books)?.map(
            (book, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card style={{ marginTop: "5px" }}>
                  <CardContent>
                    <Typography component="div">{book.title}</Typography>

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
            )
          )}
        </Grid>
      </Container>
    </Stack>
  );
}
