import { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Stack,
  useTheme,
} from "@mui/material";

import { useNavigate } from "react-router-dom";
import { IBook } from "../../interfaces/bookInterface";
import { bookService } from "../../services/bookService";
import { SearchBar } from "../SearchBar";
import { CreateBookModal } from "../Modals/CreateBookModal";
import { EditBookModal } from "../Modals/EditBookModal";
import { useSweetAlert } from "../../hooks/useSweetAlert";
import { CreateButton, EditButton, DeleteButton } from "../Buttons";
import { ILoan } from "../../interfaces/loanInterface";
import { loanService } from "../../services/loanService";

// Remove the async keyword from the component function
export function Book() {
  const [books, setBooks] = useState<IBook[]>([]);
  const [loans, setLoans] = useState<ILoan[]>([]);
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
    document
      .querySelector(".swal2-container")
      ?.setAttribute("data-theme", theme.palette.mode);
  }, [theme.palette.mode]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await bookService.getBooks();
        if (response.success) {
          setBooks(response.result);
        } else {
          swal.fire({
            toast: true,
            position: "top-end",
            text: "Error al cargar los libros",
            icon: "error",
            showConfirmButton: false,
            timer: 1500,
          });
        }
      } catch (error) {
        swal.fire({
          toast: true,
          position: "top-end",
          text: "Hubo un problema al cargar los libros. Por favor, inténtelo más tarde.",
          icon: "error",
          showConfirmButton: false,
          timer: 1500,
        });
        navigate("/error500");
      }
    };
    fetchData();
  }, [navigate]);

  useEffect(() => {
    const fetchLoans = async () => {
      try {
        const response = await loanService.getLoans();
        if (response.success) {
          setLoans(response.result);
        } else {
          swal.fire({
            toast: true,
            position: "top-end",
            text: "Error al cargar los préstamos",
            icon: "error",
            showConfirmButton: false,
            timer: 1500,
          });
        }
      } catch (error) {
        swal.fire({
          text: "Hubo un problema al cargar los préstamos. Por favor, inténtelo más tarde.",
          icon: "error",
          showConfirmButton: false,
          timer: 1500,
        });
      }
    };
    fetchLoans();
  }, []);

  useEffect(() => {
    if (searchTerm === "") {
      setFilteredBooks([]);
    }
  }, [searchTerm]);

  const onCLickCreate = () => {
    handleOpenCreateModal();
  };

  const initialBookState: IBook = {
    _id: "",
    title: "",
    author: "",
    isbn: 0,
    stockInt: 0,
    stockExt: 0,
  };

  const [selectedBook, setSelectedBook] = useState<IBook>(initialBookState);

  async function onClickUpdate(book: IBook) {
    try {
      setSelectedBook(book);
      handleOpenEditModal();
    } catch (error) {
      swal.fire({
        text: "El libro no existe",
        icon: "error",
        showConfirmButton: false,
        timer: 1500,
      });
    }
  }

  const findBookOnLoan = (id: string) => {
    // Check if the member has any active loans
    const activeLoan = loans.find(
      (loan) => loan.bookId === id && loan.isActive === true
    );
    console.log("activeLoan: ", activeLoan?._id);

    return activeLoan;
  };

  const onClickDelete = async (id: string) => {
    try {
      const bookFinded = findBookOnLoan(id);
      if (!bookFinded) {
        const result = await swal.confirm("¿Esta seguro que desea eliminar?");
        if (result.isConfirmed) {
          const response = await bookService.deleteBook(id);
          if (response.success) {
            const response = await bookService.getBooks();
            setBooks(response.result);
            return swal.success("El libro fue eliminado");
          }
        }
      } else {
        swal.fire({
          text: "Imposible eliminar. El libro tiene un préstamo vigente.",
          icon: "error",
          showConfirmButton: false,
          timer: 1500,
        });
      }
    } catch (error) {
      swal.fire({
        text: "Hubo un problema, intentelo más tarde",
        icon: "error",
        showConfirmButton: false,
        timer: 1500,
      });
    }
  };

  const onClickSearch = () => {
    const filtered = books.filter(
      (book) =>
        `${book.title}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        `${book.author}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        `${book.isbn}`.toString().includes(searchTerm)
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
              <CreateButton
                onClick={onCLickCreate}
                tooltipTitle="Crear Libro"
              />
              <SearchBar
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                onSearch={onClickSearch}
                placeholder="Título, autor o ISBN..."
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
                      ISBN: {book.isbn}
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
                      <EditButton
                        onClick={() => onClickUpdate(book)}
                        tooltipTitle="Editar Libro"
                      />
                      <DeleteButton
                        onClick={() => onClickDelete(book._id)}
                        tooltipTitle="Eliminar Libro"
                      />
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
