import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Stack,
  TextField,
  Fab,
  useTheme,
} from "@mui/material";

import Add from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { useNavigate } from "react-router-dom";
import { IBook } from "../../interfaces/bookInterface";
import { bookService } from "../../services/bookService";
import { SearchBar } from "../SearchBar";
import { CreateBookModal } from "../CreateBookModal";
import { EditBookModal } from "../EditBookModal";
import { useSweetAlert } from "../../hooks/useSweetAlert";

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
  const theme = useTheme();
  const swal = useSweetAlert();
  
  // Configure SweetAlert2 theme based on app theme
  useEffect(() => {
    // Set SweetAlert2 theme based on the app's current theme
    document.querySelector('.swal2-container')?.setAttribute('data-theme', theme.palette.mode);
  }, [theme.palette.mode]);

  useEffect(() => {
    console.log("Fetch");
    const fetchData = async () => {
      try {
        const response = await bookService.getBooks();
        if (response.success) {
          setBooks(response.result);
        }
      } catch (error) {
        console.error("Error fetching books:", error);
        navigate("/error500");
      }
    };
    fetchData();
  }, [navigate]);

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
      swal.error("El libro no existe");
    }
  }

  const onClickDelete = async (id: string | undefined) => {
    try {
      if (!id) {
        return swal.error("El libro no existe");
      }
      
      // Add confirmation dialog before deleting
      const result = await swal.confirm('¿Está seguro que desea eliminar?');
      
      // Only proceed with deletion if user confirmed
      if (result.isConfirmed) {
        const response = await bookService.deleteBook(id);
        if (response.success) {
          const response = await bookService.getBooks();
          setBooks(response.result);
          return swal.success("El libro fue eliminado");
        }
      }
    } catch (error) {
      swal.error("El libro no existe");
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
