import { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Stack,
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
  const swal = useSweetAlert();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await bookService.getBooks();
        if (response.success) {
          // Si la respuesta es exitosa, establecer los libros (incluso si es un array vacío)
          setBooks(response.result || []);
        } else if (!response.result || response.result.length === 0) {
          // Si no hay libros, simplemente establecer un array vacío sin mostrar error
          setBooks([]);
        } else {
          // Solo mostrar error si hay un problema real (no simplemente una colección vacía)
          swal.toast("Error al cargar los libros", "error");
        }
      } catch (error) {
        console.error("Error al cargar libros:", error);
        // Solo navegar a la página de error en caso de errores graves
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
          // Si la respuesta es exitosa, establecer los préstamos (incluso si es un array vacío)
          setLoans(response.result || []);
        } else if (!response.result || response.result.length === 0) {
          // Si no hay préstamos, simplemente establecer un array vacío sin mostrar error
          setLoans([]);
        } else {
          // Solo mostrar error si hay un problema real (no simplemente una colección vacía)
          swal.toast("Error al cargar los préstamos", "error");
        }
      } catch (error) {
        console.error("Error al cargar préstamos:", error);
        // No navegar a la página de error para problemas con préstamos
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
    loanable: true,
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
    // Chequear si el libro tiene un préstamo activo
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
            setBooks(response.result || []);
            return swal.success("El libro fue eliminado");
          }
        }
      } else {
        swal.error("Imposible eliminar. El libro tiene un préstamo vigente.");
      }
    } catch (error) {
      console.error("Error al eliminar libro:", error);
      swal.error("Hubo un problema, intentelo más tarde");
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
    try {
      const response = await bookService.getBooks();
      if (response.success) {
        setBooks(response.result || []);
      }
    } catch (error) {
      console.error("Error al refrescar libros:", error);
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
                tooltipTitle="Agregar Libro"
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
